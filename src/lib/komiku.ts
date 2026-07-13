import * as cheerio from 'cheerio'

export const BASE_URL = process.env.API_KOMIKU_URL || 'https://mangaku.guru'

const cache = new Map<string, { data: string; expiry: number }>()
const CACHE_TTL = 5 * 60 * 1000
const MAX_CACHE_SIZE = 100

function getCached(url: string): string | null {
  const entry = cache.get(url)
  if (entry && entry.expiry > Date.now()) return entry.data
  if (entry) cache.delete(url)
  return null
}

function setCache(url: string, data: string) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }
  cache.set(url, { data, expiry: Date.now() + CACHE_TTL })
}

async function fetchHTML(url: string, retries = 2): Promise<string> {
  const cached = getCached(url)
  if (cached) {
    console.log(`[Scraper] Cache hit: ${url}`)
    return cached
  }

  console.log(`[Scraper] Fetching: ${url}`)

  let lastError: Error | null = null
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        }
      })
      if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${url}`)

      const data = await res.text()
      setCache(url, data)
      return data
    } catch (error: any) {
      lastError = error
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`[Scraper] Retry ${attempt + 1}/${retries} after ${delay}ms: ${error.message}`)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  throw lastError || new Error(`Scraper fetch failed after ${retries + 1} attempts: ${url}`)
}

function parseChapterNum(slug: string): number {
  const match = slug.match(/chapter-([\d.]+)/)
  return match ? parseFloat(match[1]) : 0
}

function extractSlugFromHref(href: string): string {
  const match = href.match(/\/komik\/([^/]+)/)
  return match ? match[1] : ''
}

function parseCards($: cheerio.CheerioAPI): LatestManga[] {
  const items: LatestManga[] = []
  $('.mk-card').each((_idx, el) => {
    const $el = $(el)
    const title = $el.find('.mk-card__title').text().trim()
    const coverUrl = $el.find('.mk-card__cover img').attr('src') || $el.find('.mk-card__cover img').attr('data-src') || ''
    const type = $el.find('.mk-badge--tipe').text().trim() || 'Manga'
    const href = $el.attr('href') || ''
    const slug = extractSlugFromHref(href)
    const chapter = $el.find('.mk-card__chapter').text().trim()
    const updatedOn = $el.find('.mk-card__time').text().trim()

    if (title && slug) {
      items.push({ title, coverUrl, type, slug, chapter, updatedOn })
    }
  })
  return items
}

export interface LatestManga {
  title: string
  coverUrl: string
  type: string
  slug: string
  chapter: string
  updatedOn: string
}

export async function fetchLatest(page = 1): Promise<LatestManga[]> {
  const path = page === 1 ? '/manga/' : `/manga/page/${page}/`
  const html = await fetchHTML(BASE_URL + path)
  const $ = cheerio.load(html)
  return parseCards($)
}

export interface MangaDetail {
  title: string
  coverUrl: string
  synopsis: string
  genres: string[]
  status: string
  type: string
  author: string
  slug: string
  chapters: { title: string; slug: string }[]
}

export async function fetchDetail(slug: string): Promise<MangaDetail> {
  const html = await fetchHTML(`${BASE_URL}/komik/${slug}/`)
  const $ = cheerio.load(html)

  const rawTitle = $('h1').first().text().trim()
  const title = rawTitle.replace(/^Komik\s+/i, '').replace(/\s*(Manga|Manhwa|Manhua)\s*$/i, '').trim()

  let coverUrl = ''
  const mainImg = $('img').first()
  const mainImgSrc = mainImg.attr('src') || mainImg.attr('data-src') || ''
  if (mainImgSrc && (mainImgSrc.includes('manga') || mainImgSrc.includes('komik') || mainImgSrc.includes('upload'))) {
    coverUrl = mainImgSrc
  }

  let synopsis = ''
  $('p').each((_idx, el) => {
    const text = $(el).text().trim()
    if (text.length > 50 && !text.includes('Mangaku') && !text.includes('Tempat baca') && !text.includes('Rilis pertama') && !text.includes('Update terakhir')) {
      synopsis = text
      return false
    }
  })

  const genres: string[] = []
  $('a[href*="/genre/"]').each((_idx, el) => {
    const g = $(el).text().trim()
    if (g && g.length < 30 && !genres.includes(g) && !g.includes('Lihat semua') && !g.match(/^\d/)) {
      genres.push(g)
    }
  })

  let status = 'ongoing'
  const statusText = $('body').text().toLowerCase()
  if (statusText.includes('tamat') || statusText.includes('completed')) status = 'completed'
  else if (statusText.includes('hiatus')) status = 'hiatus'

  let type = 'Manga'
  const typeEl = $('.mk-badge--tipe, .mk-type, .type').first()
  if (typeEl.length) type = typeEl.text().trim()

  const chapters: { title: string; slug: string }[] = []
  const seenSlugs = new Set<string>()
  $('a[href*="/chapter-"]').each((_idx, el) => {
    const href = $(el).attr('href') || ''
    const chSlugMatch = href.match(/\/chapter-([\w.-]+)/)
    if (chSlugMatch) {
      const chSlug = `chapter-${chSlugMatch[1]}`
      if (seenSlugs.has(chSlug)) return
      seenSlugs.add(chSlug)
      const chTitle = $(el).find('.mk-chapter-list__name').text().trim() || `Chapter ${chSlugMatch[1].replace(/-/g, '.')}`
      chapters.push({ title: chTitle, slug: chSlug })
    }
  })

  chapters.sort((a, b) => parseChapterNum(a.slug) - parseChapterNum(b.slug))

  return { title, coverUrl, synopsis, genres, status, type, author: '', slug, chapters }
}

export interface ChapterPages {
  title: string
  pages: string[]
}

export async function fetchChapterByUrl(chapterUrl: string): Promise<ChapterPages> {
  const html = await fetchHTML(chapterUrl)
  const $ = cheerio.load(html)

  let title = $('h1').first().text().trim() || $('title').text().trim()
  title = title.replace(/^Komik\s+/i, '').trim()

  const pages: string[] = []
  const seenSrc = new Set<string>()

  function addPage(src: string | undefined) {
    if (src && !seenSrc.has(src) && !src.includes('thumbnail') && !src.includes('logo') && !src.includes('icon')) {
      seenSrc.add(src)
      pages.push(src)
    }
  }

  $('.mk-reader__page img').each((_idx, el) => {
    addPage($(el).attr('src') || $(el).attr('data-src'))
  })

  if (pages.length === 0) {
    $('.mk-reader img').each((_idx, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || ''
      if (src.includes('mangaku') || src.includes('upload') || src.includes('img.mangaku')) {
        addPage(src)
      }
    })
  }

  if (pages.length === 0) {
    $('img[src*="upload"], img[data-src*="upload"], img[src*="img.mangaku"], img[data-src*="img.mangaku"]').each((_idx, el) => {
      addPage($(el).attr('src') || $(el).attr('data-src'))
    })
  }

  return { title, pages }
}

export interface SearchResult {
  title: string
  coverUrl: string
  type: string
  slug: string
  updatedOn: string
}

export async function fetchSearch(query: string): Promise<SearchResult[]> {
  const html = await fetchHTML(`${BASE_URL}/?s=${encodeURIComponent(query)}`)
  const $ = cheerio.load(html)
  return parseCards($).map(m => ({
    title: m.title,
    coverUrl: m.coverUrl,
    type: m.type,
    slug: m.slug,
    updatedOn: m.updatedOn,
  }))
}

export async function fetchGenreManga(genreSlug: string, page = 1): Promise<LatestManga[]> {
  const path = page === 1 ? `/genre/${genreSlug}/` : `/genre/${genreSlug}/page/${page}/`
  const html = await fetchHTML(BASE_URL + path)
  const $ = cheerio.load(html)
  return parseCards($)
}

export async function fetchByType(type: string, page = 1): Promise<LatestManga[]> {
  const slug = type.toLowerCase()
  const path = page === 1 ? `/tipe/${slug}/` : `/tipe/${slug}/page/${page}/`
  const html = await fetchHTML(BASE_URL + path)
  const $ = cheerio.load(html)
  return parseCards($)
}

export async function fetchByGenreAndType(genreSlug: string, type: string, page = 1): Promise<LatestManga[]> {
  const tipe = type.toLowerCase()
  const url = page === 1
    ? `${BASE_URL}/komik/?genre=${genreSlug}&tipe=${tipe}`
    : `${BASE_URL}/komik/page/${page}/?genre=${genreSlug}&tipe=${tipe}`
  const html = await fetchHTML(url)
  const $ = cheerio.load(html)
  return parseCards($)
}

export async function fetchGenreList(): Promise<{ name: string; slug: string; count: string }[]> {
  const html = await fetchHTML(BASE_URL)
  const $ = cheerio.load(html)
  const genres: { name: string; slug: string; count: string }[] = []
  const seen = new Set<string>()

  $('a[href*="/genre/"]').each((_idx, el) => {
    const href = $(el).attr('href') || ''
    const slugMatch = href.match(/\/genre\/([^/]+)\/?/)
    if (slugMatch) {
      const slug = slugMatch[1]
      if (seen.has(slug)) return
      const text = $(el).text().trim()
      const countMatch = text.match(/(\d+)\s*komik/i)
      const name = text.replace(/\d+\s*komik/i, '').replace(/Lihat semua\s*→?/i, '').trim()
      if (name && name.length < 30) {
        seen.add(slug)
        genres.push({ name, slug, count: countMatch ? countMatch[1] : '' })
      }
    }
  })

  return genres
}

export async function fetchGenreCount(genreSlug: string): Promise<number> {
  try {
    const html = await fetchHTML(`${BASE_URL}/genre/${genreSlug}/`)
    const $ = cheerio.load(html)
    const pageText = $('body').text()
    const countMatch = pageText.match(/(\d+)\s*komik/i)
    return countMatch ? parseInt(countMatch[1], 10) : $('.mk-card').length || 0
  } catch {
    return 0
  }
}
