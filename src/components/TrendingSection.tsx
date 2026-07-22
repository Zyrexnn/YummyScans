'use client'

import { useState, useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import type { LatestManga } from '../lib/komiku'

function relTime(s: string): string {
  const t = s.toLowerCase()
  const num = t.match(/(\d+)/)?.[1] || '1'
  if (t.includes('menit')) return `${num}m`
  if (t.includes('jam')) return `${num}h`
  if (t.includes('hari')) return `${num}d`
  if (t.includes('minggu')) return `${num}w`
  return `${num}d`
}

function parseRecency(s: string): number {
  const t = s.toLowerCase()
  const num = parseInt(t.match(/(\d+)/)?.[1] || '99')
  if (t.includes('menit')) return num
  if (t.includes('jam')) return num * 60
  if (t.includes('hari')) return num * 1440
  return 99999
}

export default function TrendingSection({ manga = [] }: { manga?: LatestManga[] }) {
  const [tab, setTab] = useState<'trending' | 'popular'>('trending')
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const trending = useMemo(() =>
    [...manga]
      .filter(m => m.updatedOn)
      .sort((a, b) => parseRecency(a.updatedOn) - parseRecency(b.updatedOn))
      .slice(0, 10),
  [manga])

  const popular = useMemo(() =>
    manga.slice(0, 10),
  [manga])

  const items = tab === 'trending' ? trending : popular

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {tab === 'trending' ? 'Trending' : 'Populer'}
            </h2>
            <div className="flex gap-1 rounded-lg bg-secondary p-0.5">
              <button
                onClick={() => setTab('trending')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                  tab === 'trending'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setTab('popular')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                  tab === 'popular'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Populer
              </button>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.length > 0 ? (
            items.map((m, i) => (
              <a
                key={m.slug + i}
                href={`/manga/${m.slug}`}
                className="group flex-shrink-0 w-[160px] sm:w-[180px] snap-start no-underline"
              >
                <div className="relative">
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
                    <div className="absolute top-1.5 left-1.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-sm font-bold text-white backdrop-blur-sm">
                        {i + 1}
                      </span>
                    </div>
                    {(m.updatedOn?.toLowerCase().includes('menit') || m.updatedOn?.toLowerCase().includes('jam')) && (
                      <span className="absolute top-1.5 right-1.5 rounded bg-[#00dc64] px-1.5 py-0.5 text-[9px] font-bold text-black">
                        UP
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground group-hover:text-foreground/70 transition-colors">
                    {m.title}
                  </h3>
                  {m.updatedOn && (
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {relTime(m.updatedOn)}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            ))
          ) : (
            <p className="py-8 text-sm text-muted-foreground">Belum ada data.</p>
          )}
        </div>
      </div>
    </section>
  )
}
