'use client'

import { useState } from 'react'
import MangaCard from './MangaCard'
import type { LatestManga } from '../lib/komiku'

type Tab = 'Manhwa' | 'Manga' | 'Manhua'

export default function Rekomendasi({ manga }: { manga: LatestManga[] }) {
  const [tab, setTab] = useState<Tab>('Manhwa')

  const items = manga.filter((m) => m.type === tab)

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h2 className="mb-5 text-2xl font-bold text-foreground md:text-3xl">Rekomendasi</h2>

        <div className="mb-6 flex gap-3">
          {(['Manhwa', 'Manga', 'Manhua'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                'rounded-full px-5 py-2 text-sm font-semibold transition ' +
                (tab === t
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-foreground/70 hover:bg-muted')
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-4 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <p className="py-10 text-sm text-muted-foreground">Belum ada komik untuk kategori ini.</p>
          )}
        </div>
      </div>
    </section>
  )
}
