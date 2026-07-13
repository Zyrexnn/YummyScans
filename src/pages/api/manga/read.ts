import type { APIRoute } from 'astro'
import { fetchChapterByUrl, BASE_URL } from '../../../lib/komiku'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const chapterUrl = url.searchParams.get('url')
  const slug = url.searchParams.get('slug')
  const mangaSlug = url.searchParams.get('manga')

  let finalUrl = chapterUrl

  if (!finalUrl && slug && mangaSlug) {
    finalUrl = `${BASE_URL}/komik/${mangaSlug}/${slug}/`
  } else if (!finalUrl && slug) {
    return new Response(JSON.stringify({ status: false, message: 'Missing manga parameter (manga slug)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (!finalUrl) {
    return new Response(JSON.stringify({ status: false, message: 'Missing url or slug+manga parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const data = await fetchChapterByUrl(finalUrl)
    return new Response(JSON.stringify({ status: true, ...data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ status: false, message: error.message, pages: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}