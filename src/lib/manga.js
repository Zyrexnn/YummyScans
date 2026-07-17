import { supabase as anon } from '../db/supabase'

const FORMATS = ['manga', 'manhwa', 'manhua']
const TYPES = ['project', 'mirror']

function normalizeFormat(value) {
  const f = String(value || '').trim().toLowerCase()
  return FORMATS.includes(f) ? f : 'manga'
}

function normalizeType(value) {
  const t = String(value || '').trim().toLowerCase()
  return TYPES.includes(t) ? t : 'project'
}

/**
 * Get manga list with pagination and filters
 */
export async function getMangaList({ page = 1, limit = 20, status, genre, source, type } = {}, supabase = anon) {
  let query = supabase
    .from('manga')
    .select(`
      *,
      manga_genres(genres(id, name, slug))
    `)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status)
  if (source) query = query.eq('source', source)
  if (type) query = query.eq('type', type)
  if (genre) {
    query = query.eq('manga_genres.genres.slug', genre)
  }

  const { data, error, count } = await query
  if (error) throw error

  return { manga: data, count }
}

/**
 * Get manga by slug
 */
export async function getMangaBySlug(slug, supabase = anon) {
  const { data, error } = await supabase
    .from('manga')
    .select(`
      *,
      manga_genres(genres(id, name, slug))
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

/**
 * Get manga by ID
 */
export async function getMangaById(id, supabase = anon) {
  const { data, error } = await supabase
    .from('manga')
    .select(`
      *,
      manga_genres(genres(id, name, slug))
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create new manga
 */
export async function createManga(client, mangaData) {
  const supabase = client || anon
  const { genres, ...manga } = mangaData
  if (manga.format !== undefined) manga.format = normalizeFormat(manga.format)
  if (manga.type !== undefined) manga.type = normalizeType(manga.type)

  const { data, error } = await supabase
    .from('manga')
    .insert(manga)
    .select()
    .single()

  if (error) throw error

  // Insert genre relations
  if (genres && genres.length > 0) {
    const genreRelations = genres.map(genreId => ({
      manga_id: data.id,
      genre_id: genreId
    }))

    const { error: genreError } = await supabase
      .from('manga_genres')
      .insert(genreRelations)

    if (genreError) throw genreError
  }

  return data
}

/**
 * Update manga
 */
export async function updateManga(client, id, mangaData) {
  const supabase = client || anon
  const { genres, ...manga } = mangaData
  if (manga.format !== undefined) manga.format = normalizeFormat(manga.format)
  if (manga.type !== undefined) manga.type = normalizeType(manga.type)

  const { data, error } = await supabase
    .from('manga')
    .update(manga)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // Update genre relations if provided
  if (genres !== undefined) {
    // Delete existing relations
    await supabase
      .from('manga_genres')
      .delete()
      .eq('manga_id', id)

    // Insert new relations
    if (genres.length > 0) {
      const genreRelations = genres.map(genreId => ({
        manga_id: id,
        genre_id: genreId
      }))

      const { error: genreError } = await supabase
        .from('manga_genres')
        .insert(genreRelations)

      if (genreError) throw genreError
    }
  }

  return data
}

/**
 * Delete manga
 */
export async function deleteManga(client, id) {
  const supabase = client || anon
  const { error } = await supabase
    .from('manga')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Get popular manga (most chapters)
 */
export async function getPopularManga(limit = 10, supabase = anon) {
  const { data, error } = await supabase
    .from('manga')
    .select(`
      *,
      manga_genres(genres(id, name, slug))
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get latest manga
 */
export async function getLatestManga(limit = 10, supabase = anon) {
  const { data, error } = await supabase
    .from('manga')
    .select(`
      *,
      manga_genres(genres(id, name, slug))
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Search manga by title
 */
export async function searchManga(query, limit = 20, supabase = anon) {
  const { data, error } = await supabase
    .from('manga')
    .select(`
      *,
      manga_genres(genres(id, name, slug))
    `)
    .ilike('title', `%${query}%`)
    .limit(limit)

  if (error) throw error
  return data
}

const FORMAT_LABEL = { manga: 'Manga', manhwa: 'Manhwa', manhua: 'Manhua' }

/**
 * Map a Supabase manga row to the LatestManga shape used by home/search UI.
 * `type` here is the format label (drives the flag), matching the scraper shape.
 */
export function toLatestShape(m) {
  return {
    title: m.title,
    coverUrl: m.cover_url,
    type: FORMAT_LABEL[m.format] || 'Manga',
    slug: m.slug,
    chapter: '',
    updatedOn: m.updated_at || m.created_at || '',
  }
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
