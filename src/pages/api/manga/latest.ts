import type { APIRoute } from 'astro'
import { fetchLatest } from '../../../lib/komiku'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1', 10)

  try {
    const manga = await fetchLatest(page)
    return new Response(JSON.stringify({ status: true, manga }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ status: false, message: error.message, manga: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
