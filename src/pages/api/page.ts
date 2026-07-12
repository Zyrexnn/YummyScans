import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')

  if (!imageUrl) {
    return new Response('Missing image URL', { status: 400 })
  }

  // Only allow MangaDex image domains
  const allowedDomains = ['uploads.mangadex.org', 'cmdxd98sb0x3yprd.mangadex.network']
  try {
    const parsed = new URL(imageUrl)
    if (!allowedDomains.includes(parsed.hostname)) {
      return new Response('Domain not allowed', { status: 403 })
    }
  } catch {
    return new Response('Invalid URL', { status: 400 })
  }

  try {
    const imageRes = await fetch(imageUrl, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'YummyScans/1.0' }
    })

    if (!imageRes.ok) {
      return new Response('Image fetch failed', { status: 502 })
    }

    const imageBuffer = await imageRes.arrayBuffer()

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=604800', // Cache 7 days
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Page proxy error:', error)
    return new Response('Internal error', { status: 500 })
  }
}
