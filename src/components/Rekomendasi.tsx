'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { LatestManga } from '../lib/komiku'

type Tab = 'Manhwa' | 'Manga' | 'Manhua'

const FLAG: Record<Tab, string> = { Manhwa: '🇰🇷', Manga: '🇯🇵', Manhua: '🇨🇳' }

function parseDuration(updatedOn: string): string {
  const text = updatedOn.toLowerCase()
  if (text.includes('menit')) return text.match(/(\d+)/)?.[1] + 'm' || 'now'
  if (text.includes('jam')) return text.match(/(\d+)/)?.[1] + 'h' || 'now'
  if (text.includes('hari')) return text.match(/(\d+)/)?.[1] + 'd' || '7d'
  return '7d'
}

function isNew(updatedOn: string): boolean {
  const text = updatedOn.toLowerCase()
  return text.includes('menit') || text.includes('jam') || /^1\s*hari/.test(text)
}

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
              <a
                key={m.slug + i}
                href={`/manga/${m.slug}`}
                className="group w-[140px] flex-shrink-0 snap-start md:w-[160px]"
              >
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
                      {parseDuration(m.updatedOn)}
                    </span>
                  </div>
                  {/* top-right: flag */}
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded bg-background text-[10px] leading-none shadow">
                    {FLAG[m.type as Tab] || '🏳️'}
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground">{m.title}</h3>
                {m.chapter && (
                  <p className="mt-1 truncate text-[10px] text-muted-foreground">{m.chapter}</p>
                )}
              </a>
            ))
          ) : (
            <p className="py-10 text-sm text-muted-foreground">Belum ada komik untuk kategori ini.</p>
          )}
        </div>
      </div>
    </section>
  )
}
