const MANGADEX_API = 'https://api.mangadex.org'

export interface MangaItem {
  id: string
  title: string
  slug: string
  coverUrl: string | null
  status: string
  genres: { id: string; name: string; slug: string }[]
}

async function mangaDexFetch(path: string, timeout = 15000) {
  const url = `${MANGADEX_API}${path}`
  console.log(`[MangaDex] Fetching: ${url}`)
  
  const res = await fetch(url, {
    signal: AbortSignal.timeout(timeout),
    headers: { 
      'User-Agent': 'YummyScans/1.0',
      'Accept': 'application/json'
    }
  })

  console.log(`[MangaDex] Response: ${res.status} ${res.statusText}`)
  
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`[MangaDex] Error body: ${text}`)
    throw new Error(`MangaDex API error: ${res.status} - ${path}`)
  }

  return res.json()
}

export async function fetchPopularManga(limit = 5): Promise<MangaItem[]> {
  const data = await mangaDexFetch(
    `/manga?order[followedCount]=desc&limit=${limit}&includes[]=cover_art&contentRating=safe`
  )

  if (!data.data || data.data.length === 0) {
    throw new Error('No manga returned from MangaDex')
  }

  console.log(`[MangaDex] Got ${data.data.length} manga`)

  return data.data.map((manga: any) => {
    const cover = manga.relationships?.find((r: any) => r.type === 'cover_art')
    const fileName = cover?.attributes?.fileName
    const title = manga.attributes?.title?.en 
      || manga.attributes?.title?.ja 
      || Object.values(manga.attributes?.title || {})[0] 
      || 'Unknown'

    console.log(`[MangaDex] Manga: ${title}, cover: ${fileName}`)

    return {
      id: manga.id,
      title,
      slug: manga.id,
      coverUrl: fileName ? `/api/cover?id=${manga.id}` : null,
      status: manga.attributes?.status || 'ongoing',
      genres: (manga.attributes?.tags || [])
        .filter((t: any) => t.attributes?.group === 'genre')
        .slice(0, 3)
        .map((t: any) => ({
          id: t.id,
          name: t.attributes?.name?.en || 'Unknown',
          slug: t.id
        })),
    }
  })
}

export async function fetchMangaDetail(mangaId: string) {
  return mangaDexFetch(`/manga/${mangaId}?includes[]=cover_art&includes[]=author`)
    .then(data => data.data)
}

export async function fetchMangaChapters(mangaId: string, lang = 'id') {
  try {
    const data = await mangaDexFetch(
      `/manga/${mangaId}/feed?translatedLanguage[]=${lang}&order[chapter]=desc&limit=100`
    )
    return data.data || []
  } catch {
    console.warn(`[MangaDex] No chapters found for ${mangaId} in lang ${lang}`)
    return []
  }
}

export async function fetchChapterPages(chapterId: string) {
  const data = await mangaDexFetch(`/at-home/server/${chapterId}`)
  return {
    baseUrl: data.baseUrl,
    hash: data.chapter?.hash,
    pages: data.chapter?.data || [],
    pagesSaver: data.chapter?.dataSaver || []
  }
}

export async function fetchChapterInfo(chapterId: string) {
  try {
    const data = await mangaDexFetch(`/chapter/${chapterId}`)
    return data.data?.attributes || null
  } catch {
    return null
  }
}
