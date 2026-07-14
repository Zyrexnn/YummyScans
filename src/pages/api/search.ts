import type { APIRoute } from 'astro'
import { fetchSearch } from '../../lib/komiku'

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q') || ''
  const headers = { 'Content-Type': 'application/json' }
  if (!q.trim()) return new Response(JSON.stringify({ results: [] }), { headers })

  try {
    const items = await fetchSearch(q)
    return new Response(JSON.stringify({ results: items.slice(0, 8) }), { headers })
  } catch (e: any) {
    return new Response(JSON.stringify({ results: [], error: e.message }), { status: 500, headers })
  }
}
