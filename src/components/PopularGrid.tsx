'use client'

import { useState, useEffect } from 'react'
import { Clock, Loader2 } from 'lucide-react'
import type { LatestManga } from '../lib/komiku'

const GENRES = [
  { name: 'Action', slug: 'action' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Thriller', slug: 'thriller' },
  { name: 'Slice of Life', slug: 'slice-of-life' },
  { name: 'Isekai', slug: 'isekai' },
  { name: 'Manhwa', slug: 'manhwa' },
  { name: 'Seinen', slug: 'seinen' },
  { name: 'Shounen', slug: 'shounen' },
]

function relTime(s: string): string {
  const t = s.toLowerCase()
  const num = t.match(/(\d+)/)?.[1] || '1'
  if (t.includes('menit')) return `${num}m`
  if (t.includes('jam')) return `${num}h`
  if (t.includes('hari')) return `${num}d`
  return `${num}d`
}

export default function PopularGrid({ manga = [] }: { manga?: LatestManga[] }) {
  const [tab, setTab] = useState('action')
  const [items, setItems] = useState<LatestManga[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/genre/${tab}`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setItems(data.manga?.slice(0, 18) || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [tab])

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Seri Populer per Genre
          </h2>
          <a
            href="/genre"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Lihat semua
          </a>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GENRES.map((g) => (
            <button
              key={g.slug}
              onClick={() => setTab(g.slug)}
              className={`flex-shrink-0 snap-start rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition ${
                tab === g.slug
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {items.map((m, i) => (
              <a
                key={m.slug + i}
                href={`/manga/${m.slug}`}
                className="group no-underline"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                  <img
                    src={m.coverUrl}
                    alt={m.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground group-hover:text-foreground/70 transition-colors">
                  {m.title}
                </h3>
                {m.updatedOn && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {relTime(m.updatedOn)}
                  </p>
                )}
              </a>
            ))}
          </div>
        ) : (
          <p className="py-8 text-sm text-muted-foreground">Belum ada data untuk genre ini.</p>
        )}
      </div>
    </section>
  )
}
