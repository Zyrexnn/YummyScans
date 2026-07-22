import type { APIRoute } from 'astro'
import { fetchGenreManga } from '../../../lib/komiku'

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug

  if (!slug) {
    return new Response(JSON.stringify({ status: false, message: 'Missing genre slug', manga: [] }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const manga = await fetchGenreManga(slug)
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
