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
                  ? 'bg-[#6d28d9] text-white'
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
                className="group relative w-[140px] flex-shrink-0 snap-start overflow-hidden rounded-lg bg-secondary md:w-[160px]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={m.coverUrl}
                    alt={m.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement
                      t.style.display = 'none'
                    }}
                  />

                  {/* top-left badges */}
                  <div className="absolute left-2 top-2 flex items-center gap-1">
                    <span className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Clock className="h-3 w-3" />
                      {parseDuration(m.updatedOn)}
                    </span>
                    {isNew(m.updatedOn) && (
                      <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* top-right flag */}
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded bg-white text-[11px] leading-none shadow">
                    {FLAG[m.type as Tab] || '🏳️'}
                  </span>

                  {/* bottom gradient + title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 pt-8">
                    <h3 className="line-clamp-2 text-[13px] font-bold leading-tight text-white">
                      {m.title}
                    </h3>
                    {m.chapter && (
                      <p className="mt-1 truncate text-[10px] text-white/50">{m.chapter}</p>
                    )}
                  </div>
                </div>
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
