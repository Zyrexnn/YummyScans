import type { APIRoute } from 'astro'
import { fetchDetail } from '../../../lib/komiku'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')

  if (!slug) {
    return new Response(JSON.stringify({ status: false, message: 'Missing slug parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const detail = await fetchDetail(slug)
    return new Response(JSON.stringify({ status: true, ...detail }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ status: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
