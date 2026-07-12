import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const mangaId = url.searchParams.get('id')

  if (!mangaId) {
    return new Response('Missing manga ID', { status: 400 })
  }

  try {
    // First, get the manga info to find the cover filename
    const mangaRes = await fetch(
      `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (!mangaRes.ok) {
      return new Response('Manga not found', { status: 404 })
    }

    const mangaData = await mangaRes.json()
    const cover = mangaData.data?.relationships?.find((r: any) => r.type === 'cover_art')
    const fileName = cover?.attributes?.fileName

    if (!fileName) {
      return new Response('Cover not found', { status: 404 })
    }

    // Fetch the actual cover image
    const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`
    const imageRes = await fetch(imageUrl, { signal: AbortSignal.timeout(5000) })

    if (!imageRes.ok) {
      return new Response('Image fetch failed', { status: 502 })
    }

    const imageBuffer = await imageRes.arrayBuffer()

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache 24 hours
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Cover proxy error:', error)
    return new Response('Internal error', { status: 500 })
  }
}
