'use client'

import { useMemo, useState, useEffect } from 'react'
import { LayoutGrid, List, Heart } from 'lucide-react'
import MangaCard from './MangaCard'
import { useFavorites } from '../hooks/useFavorites'
import type { LatestManga } from '../lib/komiku'

type Tab = 'Project' | 'Mirror'
type View = 'grid' | 'list'

const FLAG: Record<string, string> = { Manhwa: '🇰🇷', Manga: '🇯🇵', Manhua: '🇨🇳' }
const PER_PAGE = 24

function relTime(s: string): string {
  const t = s.toLowerCase()
  const num = t.match(/(\d+)/)?.[1] || '1'
  if (t.includes('menit')) return `${num} mnt`
  if (t.includes('jam')) return `${num} jam`
  if (t.includes('hari')) return `${num} hari`
  if (t.includes('minggu')) return `${num} mgg`
  if (t.includes('bulan') || t.includes('bln')) return `${num} bln`
  if (t.includes('tahun')) return `${num} thn`
  return s
}

function isNew(s: string): boolean {
  const t = s.toLowerCase()
  return t.includes('menit') || t.includes('jam') || /^1\s*hari/.test(t)
}

function FavHeart({ slug, title, coverUrl, type }: { slug: string; title: string; coverUrl: string | null; type?: string }) {
  const { toggle, isFavorite, ready } = useFavorites()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted || !ready) return <div className="w-7 h-7" />

  const fav = isFavorite(slug)
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle({ slug, title, coverUrl, type }) }}
      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
        fav ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'
      }`}
      aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
    </button>
  )
}

export default function UpdateSection({ project = [], mirror = [] }: { project?: LatestManga[]; mirror?: LatestManga[] }) {
  const [tab, setTab] = useState<Tab>('Project')
  const [view, setView] = useState<View>('grid')
  const [page, setPage] = useState(1)

  const source = tab === 'Project' ? project : mirror

  const items = useMemo<LatestManga[]>(() => {
    const start = (page - 1) * PER_PAGE
    return source.slice(start, start + PER_PAGE)
  }, [source, page])

  const totalPages = Math.max(1, Math.ceil(source.length / PER_PAGE))

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Update</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              aria-label="Grid view"
              className={
                'flex h-9 w-9 items-center justify-center rounded-lg transition ' +
                (view === 'grid' ? 'bg-foreground text-background' : 'bg-secondary text-foreground/70')
              }
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              aria-label="List view"
              className={
                'flex h-9 w-9 items-center justify-center rounded-lg transition ' +
                (view === 'list' ? 'bg-foreground text-background' : 'bg-secondary text-foreground/70')
              }
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="mb-6 flex gap-3">
          {(['Project', 'Mirror'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t)
                setPage(1)
              }}
              className={
                'rounded-full px-5 py-2 text-sm font-semibold transition ' +
                (tab === t ? 'bg-foreground text-background' : 'bg-secondary text-foreground/70 hover:bg-muted')
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* COMIC GRID / LIST */}
        {items.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {items.map((m, i) => (
                <MangaCard
                  key={m.slug + i}
                  title={m.title}
                  coverUrl={m.coverUrl}
                  slug={m.slug}
                  type={m.type}
                  chapter={m.chapter}
                  updatedOn={m.updatedOn}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((m, i) => (
                <a
                  key={m.slug + i}
                  href={`/manga/${m.slug}`}
                  className="flex items-center gap-3 rounded-lg bg-secondary p-2 transition hover:bg-muted"
                >
                  <img
                    src={m.coverUrl}
                    alt={m.title}
                    loading="lazy"
                    className="h-16 w-12 flex-shrink-0 rounded object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement
                      t.style.display = 'none'
                    }}
                  />
                  <FavHeart slug={m.slug} title={m.title} coverUrl={m.coverUrl} type={m.type} />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-foreground">{m.title}</h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {m.chapter} · {relTime(m.updatedOn)} · {FLAG[m.type] || ''}
                    </p>
                  </div>
                  {isNew(m.updatedOn) && (
                    <span className="rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">UP</span>
                  )}
                </a>
              ))}
            </div>
          )
        ) : (
          <p className="py-10 text-sm text-muted-foreground">
            {tab === 'Project' ? 'Belum ada komik project.' : 'Belum ada update mirror.'}
          </p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition hover:bg-muted disabled:opacity-40"
          >
            <span className="text-lg leading-none">‹</span>
          </button>
          <span className="text-sm font-medium text-foreground px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition hover:bg-muted disabled:opacity-40"
          >
            <span className="text-lg leading-none">›</span>
          </button>
        </div>
        )}
      </div>
    </section>
  )
}
