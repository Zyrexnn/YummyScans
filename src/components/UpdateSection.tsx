'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import type { LatestManga } from '../lib/komiku'

const FLAG: Record<string, string> = { Manhwa: '🇰🇷', Manga: '🇯🇵', Manhua: '🇨🇳' }

function relTime(s: string): string {
  if (!s) return ''
  const t = s.toLowerCase()
  const num = t.match(/(\d+)/)?.[1] || '1'
  if (t.includes('menit')) return `${num} mnt`
  if (t.includes('jam')) return `${num} jam`
  if (t.includes('hari')) return `${num} hari`
  if (t.includes('minggu')) return `${num} mgg`
  if (t.includes('bulan') || t.includes('bln')) return `${num} bln`
  return s
}

function isNew(s: string): boolean {
  const t = s.toLowerCase()
  return t.includes('menit') || t.includes('jam') || /^1\s*hari/.test(t)
}

type Tab = 'Mirror' | 'Project'

export default function UpdateSection({ mirror = [], project = [] }: { mirror?: LatestManga[]; project?: LatestManga[] }) {
  const [tab, setTab] = useState<Tab>('Mirror')

  const items = tab === 'Mirror' ? mirror : project

  if (items.length === 0 && mirror.length === 0 && project.length === 0) return null

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Update Terbaru
          </h2>
          <div className="flex gap-1 rounded-lg bg-secondary p-0.5">
            {(['Mirror', 'Project'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${
                  tab === t
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.length > 0 ? (
            items.slice(0, 18).map((m, i) => (
              <a
                key={m.slug + i}
                href={`/manga/${m.slug}`}
                className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3 transition hover:bg-secondary no-underline group"
              >
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={m.coverUrl}
                    alt={m.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-foreground/70 transition-colors">
                    {m.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                    {m.chapter && <span className="font-medium text-foreground/60">{m.chapter}</span>}
                    {m.updatedOn && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {relTime(m.updatedOn)}
                      </span>
                    )}
                    {m.type && FLAG[m.type] && (
                      <span>{FLAG[m.type]}</span>
                    )}
                  </div>
                </div>
                {isNew(m.updatedOn) && (
                  <span className="flex-shrink-0 rounded bg-[#00dc64] px-2 py-0.5 text-[10px] font-bold text-black">
                    UP
                  </span>
                )}
              </a>
            ))
          ) : (
            <p className="col-span-full py-8 text-sm text-muted-foreground">
              Belum ada update.
            </p>
          )}
        </div>

        {items.length > 18 && (
          <div className="mt-6 text-center">
            <a
              href={tab === 'Mirror' ? '/latest' : '/search?src=project'}
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition no-underline"
            >
              Lihat semua update
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
