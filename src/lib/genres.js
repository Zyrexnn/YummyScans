import { supabase } from '../db/supabase'

/**
 * Get all genres
 */
export async function getGenres() {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get genre by slug
 */
export async function getGenreBySlug(slug) {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

/**
 * Create new genre
 */
export async function createGenre(genreData) {
  const { data, error } = await supabase
    .from('genres')
    .insert(genreData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update genre
 */
export async function updateGenre(id, genreData) {
  const { data, error } = await supabase
    .from('genres')
    .update(genreData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete genre
 */
export async function deleteGenre(id) {
  const { error } = await supabase
    .from('genres')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Get manga count per genre
 */
export async function getGenreCounts() {
  const { data, error } = await supabase
    .from('genres')
    .select(`
      id,
      name,
      slug,
      manga_genres(count)
    `)

  if (error) throw error

  return data.map(genre => ({
    ...genre,
    count: genre.manga_genres?.[0]?.count || 0
  }))
}

/**
 * Generate slug from genre name
 */
export function generateGenreSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
