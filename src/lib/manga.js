import { supabase } from '../db/supabase'

/**
 * Get manga list with pagination and filters
 */
export async function getMangaList({ page = 1, limit = 20, status, genre, source } = {}) {
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
export async function getMangaBySlug(slug) {
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
export async function getMangaById(id) {
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
export async function createManga(mangaData) {
  const { genres, ...manga } = mangaData

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
export async function updateManga(id, mangaData) {
  const { genres, ...manga } = mangaData

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
export async function deleteManga(id) {
  const { error } = await supabase
    .from('manga')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Get popular manga (most chapters)
 */
export async function getPopularManga(limit = 10) {
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
export async function getLatestManga(limit = 10) {
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
export async function searchManga(query, limit = 20) {
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

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
