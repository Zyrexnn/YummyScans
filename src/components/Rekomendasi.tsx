'use client'

import { useState, useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MangaCard from './MangaCard'
import type { LatestManga } from '../lib/komiku'

type Tab = 'Manhwa' | 'Manga' | 'Manhua'

export default function Rekomendasi({ manga = [] }: { manga?: LatestManga[] }) {
  const [tab, setTab] = useState<Tab>('Manhwa')
  const scrollRef = useRef<HTMLDivElement>(null)

  const items = useMemo(() => manga.filter((m) => m.type === tab), [manga, tab])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.5
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Rekomendasi</h2>
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

        <div className="flex gap-2 mb-6">
          {(['Manhwa', 'Manga', 'Manhua'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                'rounded-full px-4 py-1.5 text-sm font-semibold transition ' +
                (tab === t
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground')
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.length > 0 ? (
            items.map((m, i) => (
              <div key={m.slug + i} className="w-[140px] flex-shrink-0 snap-start md:w-[160px]">
                <MangaCard
                  title={m.title}
                  coverUrl={m.coverUrl}
                  slug={m.slug}
                  type={m.type}
                  chapter={m.chapter}
                  updatedOn={m.updatedOn}
                  index={i}
                />
              </div>
            ))
          ) : (
            <p className="py-8 text-sm text-muted-foreground">Belum ada komik untuk kategori ini.</p>
          )}
        </div>
      </div>
    </section>
  )
}
