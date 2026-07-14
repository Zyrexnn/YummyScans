'use client'

import { useState } from 'react'
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Clock,
  Eye,
  ArrowDownToLine,
  X,
  SlidersHorizontal,
} from 'lucide-react'

type Manga = { title: string; coverUrl: string; type: string; slug: string; chapter: string; updatedOn: string }

const GENRES: { name: string; slug: string }[] = [
  { name: 'Action', slug: 'action' },
  { name: 'Adaptation', slug: 'adaptation' },
  { name: 'Adult', slug: 'adult' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Cooking', slug: 'cooking' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Demon', slug: 'demon' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Ecchi', slug: 'ecchi' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Harem', slug: 'harem' },
  { name: 'Historical', slug: 'historical' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Isekai', slug: 'isekai' },
  { name: 'Josei', slug: 'josei' },
  { name: 'Magic', slug: 'magic' },
  { name: 'Martial Arts', slug: 'martial-arts' },
  { name: 'Mature', slug: 'mature' },
  { name: 'Mecha', slug: 'mecha' },
  { name: 'Medical', slug: 'medical' },
  { name: 'Military', slug: 'military' },
  { name: 'Music', slug: 'music' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'One Shot', slug: 'one-shot' },
  { name: 'Police', slug: 'police' },
  { name: 'Psychological', slug: 'psychological' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Samurai', slug: 'samurai' },
  { name: 'School', slug: 'school' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Seinen', slug: 'seinen' },
  { name: 'Shoujo', slug: 'shoujo' },
  { name: 'Shounen', slug: 'shounen' },
  { name: 'Slice of Life', slug: 'slice-of-life' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Super Power', slug: 'super-power' },
  { name: 'Supernatural', slug: 'supernatural' },
  { name: 'Thriller', slug: 'thriller' },
  { name: 'Tragedy', slug: 'tragedy' },
  { name: 'Vampire', slug: 'vampire' },
  { name: 'Webtoon', slug: 'webtoon' },
]

const FLAG: Record<string, string> = { Manhwa: '🇰🇷', Manga: '🇯🇵', Manhua: '🇨🇳' }
const FORMATS = ['Manhwa', 'Manga', 'Manhua']

function shortRel(s: string): string {
  const t = s.toLowerCase()
  const n = t.match(/\d+/)?.[1] || '1'
  if (t.includes('menit')) return `${n}m`
  if (t.includes('jam')) return `${n}h`
  if (t.includes('hari')) return `${n}d`
  if (t.includes('minggu')) return `${n}w`
  if (t.includes('bulan') || t.includes('bln')) return `${n}b`
  if (t.includes('tahun')) return `${n}y`
  return `${n}d`
}

function isNew(s: string): boolean {
  const t = s.toLowerCase()
  return t.includes('menit') || t.includes('jam') || /^1\s*hari/.test(t)
}

function chapterNum(chapter: string): string {
  const m = chapter.match(/(\d+(?:\.\d+)?)/)
  return m ? m[1] : '0'
}

// ponytail: views not provided by the scrape source; deterministic pseudo-value until a real metric exists
function fakeViews(slug: string): string {
  let h = 0
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const n = 1200 + (h % 1_980_000)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border py-3">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-sm font-bold text-foreground">{title}</span>
        <ChevronDown className={'h-4 w-4 text-muted-foreground transition-transform ' + (open ? 'rotate-180' : '')} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function Card({ m }: { m: Manga }) {
  const fresh = isNew(m.updatedOn)
  return (
    <a href={`/manga/${m.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
        <img
          src={m.coverUrl}
          alt={m.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        {/* top-left: time */}
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
          <span className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {shortRel(m.updatedOn)}
          </span>
          {fresh && <span className="rounded bg-red-600 px-1 py-0.5 text-[9px] font-bold text-white">NEW</span>}
        </div>
        {/* top-right: flag */}
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded bg-background text-[10px] leading-none shadow">
          {FLAG[m.type] || '🏳️'}
        </span>
      </div>
      <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground">{m.title}</h3>
      <p className="mt-1 truncate text-[10px] text-muted-foreground">{m.chapter || 'Ch. -'}</p>
    </a>
  )
}

function ListRow({ m }: { m: Manga }) {
  const fresh = isNew(m.updatedOn)
  return (
    <a href={`/manga/${m.slug}`} className="flex items-center gap-3 rounded-lg bg-secondary p-2 transition hover:bg-muted">
      <img
        src={m.coverUrl}
        alt={m.title}
        loading="lazy"
        className="h-20 w-14 flex-shrink-0 rounded object-cover"
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-bold text-foreground">{m.title}</h3>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {shortRel(m.updatedOn)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {fakeViews(m.slug)}
          </span>
          <span>CH.{chapterNum(m.chapter)}</span>
          <span>{FLAG[m.type] || ''}</span>
        </div>
      </div>
      {fresh && <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">UP</span>}
    </a>
  )
}

export default function SearchExplorer({
  manga,
  query,
  typeFilter,
  genreFilter,
  page,
  hasMore,
}: {
  manga: Manga[]
  query: string
  typeFilter: string
  genreFilter: string
  page: number
  hasMore: boolean
}) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<'latest' | 'az' | 'za'>('latest')
  const [drawer, setDrawer] = useState(false)
  const [genreSearch, setGenreSearch] = useState('')

  const buildHref = (o: { q?: string; type?: string; genre?: string; page?: number }) => {
    const p = new URLSearchParams()
    p.set('q', o.q ?? query ?? '')
    const t = o.type !== undefined ? o.type : typeFilter
    if (t) p.set('type', t)
    const g = o.genre !== undefined ? o.genre : genreFilter
    if (g) p.set('genre', g)
    if (o.page && o.page > 1) p.set('page', String(o.page))
    const s = p.toString()
    return '/search' + (s ? '?' + s : '')
  }

  const filteredGenres = GENRES.filter((g) => g.name.toLowerCase().includes(genreSearch.toLowerCase()))

  const display = [...manga].sort((a, b) => {
    if (sort === 'az') return a.title.localeCompare(b.title)
    if (sort === 'za') return b.title.localeCompare(a.title)
    return 0
  })

  const Sidebar = (
    <div className="flex h-full flex-col">
      <Collapsible title="Genre" defaultOpen>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
            placeholder="Search Genre"
            className="h-9 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <div className="grid max-h-56 grid-cols-2 gap-1.5 overflow-y-auto pr-1">
          {filteredGenres.map((g) => {
            const active = genreFilter === g.slug
            return (
              <button
                key={g.slug}
                onClick={() => (window.location.href = buildHref({ genre: active ? '' : g.slug, page: 1 }))}
                className={
                  'rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium transition ' +
                  (active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/80 hover:bg-muted')
                }
              >
                {g.name}
              </button>
            )
          })}
        </div>
      </Collapsible>

      <Collapsible title="Format">
        <div className="flex flex-wrap gap-1.5">
          {FORMATS.map((f) => {
            const active = (typeFilter || '').toLowerCase() === f.toLowerCase()
            return (
              <button
                key={f}
                onClick={() => (window.location.href = buildHref({ type: active ? '' : f, page: 1 }))}
                className={
                  'rounded-lg px-3 py-1.5 text-[12px] font-medium transition ' +
                  (active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/80 hover:bg-muted')
                }
              >
                {f}
              </button>
            )
          })}
        </div>
      </Collapsible>
    </div>
  )

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* AD BANNER */}
        <div className="mb-6 grid grid-cols-2 gap-px border border-hairline dark:border-border">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex h-[90px] items-center justify-center bg-surface-soft text-sm font-medium text-muted-foreground dark:bg-secondary dark:text-muted-foreground md:h-[100px]"
            >
              Slot Iklan
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* SIDEBAR (desktop) */}
          <aside className="hidden w-1/5 flex-shrink-0 lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">{Sidebar}</div>
          </aside>

          {/* MAIN */}
          <div className="min-w-0 flex-1">
            {/* TOOLBAR */}
            <div className="mb-5 flex items-center gap-3">
              <form action="/search" method="get" className="relative flex-1">
                {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
                {genreFilter && <input type="hidden" name="genre" value={genreFilter} />}
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Cari"
                  className="h-10 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </form>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  className={
                    'flex h-10 w-10 items-center justify-center rounded-lg transition ' +
                    (view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/70')
                  }
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  aria-label="List view"
                  className={
                    'flex h-10 w-10 items-center justify-center rounded-lg transition ' +
                    (view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/70')
                  }
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'latest' | 'az' | 'za')}
                className="flex h-10 items-center rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none"
              >
                <option value="latest">Terbaru</option>
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
              </select>

              <button
                aria-label="Export"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground/70 transition hover:bg-secondary"
              >
                <ArrowDownToLine className="h-4 w-4" />
              </button>

              <button
                onClick={() => setDrawer(true)}
                aria-label="Filters"
                className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm font-medium text-foreground lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>
            </div>

            {/* RESULTS */}
            {display.length > 0 ? (
              view === 'grid' ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {display.map((m, i) => (
                    <Card key={m.slug + i} m={m} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {display.map((m, i) => (
                    <ListRow key={m.slug + i} m={m} />
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-2xl bg-secondary p-12 text-center">
                <p className="text-headline mb-2 text-foreground">Tidak ditemukan</p>
                <p className="text-sm text-muted-foreground">Pilih genre di sidebar atau ketik judul di kolom Cari.</p>
                <a href="/search" className="mt-4 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition hover:opacity-90">
                  Reset
                </a>
              </div>
            )}

            {/* PAGINATION */}
            {(page > 1 || hasMore) && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 && (
                  <a
                    href={buildHref({ page: page - 1 })}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition hover:bg-muted"
                  >
                    ‹
                  </a>
                )}
                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-accent bg-primary px-3 text-sm font-semibold text-primary-foreground">
                  {page}
                </span>
                {hasMore && (
                  <a
                    href={buildHref({ page: page + 1 })}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition hover:bg-muted"
                  >
                    ›
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm overflow-y-auto bg-background p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-bold text-foreground">Filter</span>
              <button onClick={() => setDrawer(false)} aria-label="Close" className="text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {Sidebar}
            <button
              onClick={() => setDrawer(false)}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
