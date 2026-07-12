import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')

  if (!imageUrl) {
    return new Response('Missing image URL', { status: 400 })
  }

  // Only allow MangaDex image domains
  let parsed: URL
  try {
    parsed = new URL(imageUrl)
  } catch {
    return new Response('Invalid URL', { status: 400 })
  }

  const allowedHosts = [
    'uploads.mangadex.org',
    'cmdxd98sb0x3yprd.mangadex.network',
    'uploads.mangadex.network'
  ]
  
  if (!allowedHosts.some(h => parsed.hostname.includes(h))) {
    return new Response(`Host not allowed: ${parsed.hostname}`, { status: 403 })
  }

  try {
    const imageRes = await fetch(imageUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'YummyScans/1.0' }
    })

    if (!imageRes.ok) {
      return new Response(`Image fetch failed: ${imageRes.status}`, { status: 502 })
    }

    const imageBuffer = await imageRes.arrayBuffer()

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=604800',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error: any) {
    console.error('[Page Proxy] Error:', error.message)
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
}
