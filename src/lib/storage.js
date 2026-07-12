import { supabase } from '../db/supabase'

const COVER_BUCKET = 'covers'
const CHAPTER_BUCKET = 'chapters'

/**
 * Upload cover image for manga
 */
export async function uploadCover(mangaId, file) {
  const ext = file.name.split('.').pop()
  const filePath = `${mangaId}/cover.${ext}`

  const { data, error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) throw error

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(COVER_BUCKET)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

/**
 * Upload chapter page image
 */
export async function uploadChapterPage(mangaId, chapterId, file, pageNumber) {
  const ext = file.name.split('.').pop()
  const paddedNum = String(pageNumber).padStart(3, '0')
  const filePath = `${mangaId}/${chapterId}/${paddedNum}.${ext}`

  const { data, error } = await supabase.storage
    .from(CHAPTER_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) throw error

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(CHAPTER_BUCKET)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

/**
 * Upload multiple chapter pages
 */
export async function uploadChapterPages(mangaId, chapterId, files) {
  const uploadPromises = files.map((file, index) =>
    uploadChapterPage(mangaId, chapterId, file, index + 1)
  )

  const urls = await Promise.all(uploadPromises)
  return urls.map((url, index) => ({
    page_number: index + 1,
    image_url: url,
    filename: files[index].name
  }))
}

/**
 * Delete cover image
 */
export async function deleteCover(mangaId) {
  const { data, error } = await supabase.storage
    .from(COVER_BUCKET)
    .list(mangaId)

  if (error) throw error

  if (data && data.length > 0) {
    const filesToRemove = data.map(file => `${mangaId}/${file.name}`)
    const { error: removeError } = await supabase.storage
      .from(COVER_BUCKET)
      .remove(filesToRemove)

    if (removeError) throw removeError
  }
}

/**
 * Delete all chapter pages
 */
export async function deleteChapterPages(mangaId, chapterId) {
  const { data, error } = await supabase.storage
    .from(CHAPTER_BUCKET)
    .list(`${mangaId}/${chapterId}`)

  if (error) throw error

  if (data && data.length > 0) {
    const filesToRemove = data.map(file => `${mangaId}/${chapterId}/${file.name}`)
    const { error: removeError } = await supabase.storage
      .from(CHAPTER_BUCKET)
      .remove(filesToRemove)

    if (removeError) throw removeError
  }
}

/**
 * Get storage usage stats
 */
export async function getStorageStats() {
  const [covers, chapters] = await Promise.all([
    supabase.storage.from(COVER_BUCKET).list(),
    supabase.storage.from(CHAPTER_BUCKET).list()
  ])

  return {
    coversCount: covers.data?.length || 0,
    chaptersCount: chapters.data?.length || 0
  }
}
