import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  // Test 1: Can we reach MangaDex API?
  try {
    const res = await fetch('https://api.mangadex.org/manga?limit=1', {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'YummyScans/1.0' }
    })
    results.tests.push({
      name: 'MangaDex API',
      status: res.status,
      ok: res.ok,
      error: res.ok ? null : `HTTP ${res.status}`
    })
    if (res.ok) {
      const data = await res.json()
      results.tests[results.tests.length - 1].sampleId = data.data?.[0]?.id
      results.tests[results.tests.length - 1].sampleTitle = data.data?.[0]?.attributes?.title?.en
    }
  } catch (e: any) {
    results.tests.push({ name: 'MangaDex API', status: 'error', error: e.message })
  }

  // Test 2: Can we reach MangaDex CDN?
  try {
    const res = await fetch('https://uploads.mangadex.org/covers', {
      signal: AbortSignal.timeout(10000)
    })
    results.tests.push({
      name: 'MangaDex CDN',
      status: res.status,
      ok: res.status < 500,
      error: res.status >= 500 ? `HTTP ${res.status}` : null
    })
  } catch (e: any) {
    results.tests.push({ name: 'MangaDex CDN', status: 'error', error: e.message })
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  })
}
