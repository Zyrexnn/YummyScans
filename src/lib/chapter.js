import { supabase as anon } from '../db/supabase'

/**
 * Get chapters by manga ID
 */
export async function getChaptersByMangaId(mangaId, supabase = anon) {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('manga_id', mangaId)
    .order('chapter_number', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get chapter by ID with pages
 */
export async function getChapterById(chapterId, supabase = anon) {
  const { data, error } = await supabase
    .from('chapters')
    .select(`
      *,
      pages(*)
    `)
    .eq('id', chapterId)
    .single()

  if (error) throw error

  // Sort pages by page_number
  if (data.pages) {
    data.pages.sort((a, b) => a.page_number - b.page_number)
  }

  return data
}

/**
 * Create new chapter
 */
export async function createChapter(client, mangaId, chapterData) {
  const supabase = client || anon
  const { pages, ...chapter } = chapterData

  const { data, error } = await supabase
    .from('chapters')
    .insert({
      ...chapter,
      manga_id: mangaId,
      page_count: pages ? pages.length : 0
    })
    .select()
    .single()

  if (error) throw error

  // Insert pages if provided
  if (pages && pages.length > 0) {
    const pagesData = pages.map((page, index) => ({
      chapter_id: data.id,
      page_number: index + 1,
      image_url: page.image_url,
      filename: page.filename
    }))

    const { error: pagesError } = await supabase
      .from('pages')
      .insert(pagesData)

    if (pagesError) throw pagesError
  }

  return data
}

/**
 * Update chapter
 */
export async function updateChapter(client, chapterId, chapterData) {
  const supabase = client || anon
  const { pages, ...chapter } = chapterData

  const { data, error } = await supabase
    .from('chapters')
    .update(chapter)
    .eq('id', chapterId)
    .select()
    .single()

  if (error) throw error

  // Update pages if provided
  if (pages !== undefined) {
    // Delete existing pages
    await supabase
      .from('pages')
      .delete()
      .eq('chapter_id', chapterId)

    // Insert new pages
    if (pages.length > 0) {
      const pagesData = pages.map((page, index) => ({
        chapter_id: chapterId,
        page_number: index + 1,
        image_url: page.image_url,
        filename: page.filename
      }))

      const { error: pagesError } = await supabase
        .from('pages')
        .insert(pagesData)

      if (pagesError) throw pagesError
    }

    // Update page count
    await supabase
      .from('chapters')
      .update({ page_count: pages.length })
      .eq('id', chapterId)
  }

  return data
}

/**
 * Delete chapter
 */
export async function deleteChapter(client, chapterId) {
  const supabase = client || anon
  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', chapterId)

  if (error) throw error
}

/**
 * Get latest chapters across all manga
 */
export async function getLatestChapters(limit = 10, supabase = anon) {
  const { data, error } = await supabase
    .from('chapters')
    .select(`
      *,
      manga(id, title, slug, cover_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get next/previous chapter for navigation
 */
export async function getAdjacentChapters(mangaId, currentChapterNumber, supabase = anon) {
  const [prev, next] = await Promise.all([
    supabase
      .from('chapters')
      .select('id, chapter_number, title')
      .eq('manga_id', mangaId)
      .lt('chapter_number', currentChapterNumber)
      .order('chapter_number', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('chapters')
      .select('id, chapter_number, title')
      .eq('manga_id', mangaId)
      .gt('chapter_number', currentChapterNumber)
      .order('chapter_number', { ascending: true })
      .limit(1)
      .single()
  ])

  return {
    prev: prev.data || null,
    next: next.data || null
  }
}
