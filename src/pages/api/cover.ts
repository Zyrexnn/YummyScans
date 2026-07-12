import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const mangaId = url.searchParams.get('id')

  if (!mangaId) {
    return new Response(JSON.stringify({ error: 'Missing manga ID' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  console.log(`[Cover Proxy] Request for manga: ${mangaId}`)

  try {
    // Get manga info to find cover filename
    const mangaRes = await fetch(
      `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`,
      { 
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'YummyScans/1.0' }
      }
    )

    console.log(`[Cover Proxy] MangaDex response: ${mangaRes.status}`)

    if (!mangaRes.ok) {
      return new Response(JSON.stringify({ error: `MangaDex error: ${mangaRes.status}` }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const mangaData = await mangaRes.json()
    const cover = mangaData.data?.relationships?.find((r: any) => r.type === 'cover_art')
    const fileName = cover?.attributes?.fileName

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'No cover art found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fetch the actual cover image
    const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`
    console.log(`[Cover Proxy] Fetching image: ${imageUrl}`)
    
    const imageRes = await fetch(imageUrl, { 
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'YummyScans/1.0' }
    })

    console.log(`[Cover Proxy] Image response: ${imageRes.status}`)

    if (!imageRes.ok) {
      return new Response(JSON.stringify({ error: `Image fetch failed: ${imageRes.status}` }), { 
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const imageBuffer = await imageRes.arrayBuffer()
    console.log(`[Cover Proxy] Image size: ${imageBuffer.byteLength} bytes`)

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error: any) {
    console.error('[Cover Proxy] Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
