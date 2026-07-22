'use client'

import { useMemo, useState } from 'react'
import { Clock } from 'lucide-react'
import type { LatestManga } from '../lib/komiku'

function relTime(s: string): string {
  if (!s) return ''
  const t = s.toLowerCase()
  const num = t.match(/(\d+)/)?.[1] || '1'
  if (t.includes('menit')) return `${num} mnt`
  if (t.includes('jam')) return `${num} jam`
  if (t.includes('hari')) return `${num} hari`
  if (t.includes('minggu')) return `${num} mgg`
  return s
}

function isNew(s: string): boolean {
  const t = s.toLowerCase()
  return t.includes('menit') || t.includes('jam') || /^1\s*hari/.test(t)
}

const STATUSES = ['all', 'ongoing', 'completed'] as const

export default function ProjectSection({ manga = [] }: { manga?: LatestManga[] }) {
  const [status, setStatus] = useState<'all' | 'ongoing' | 'completed'>('all')

  const items = useMemo(() => {
    if (status === 'all') return manga
    return manga.filter(m => {
      const label = m.type?.toLowerCase() || ''
      if (status === 'ongoing') return !label.includes('completed') && !label.includes('tamat')
      if (status === 'completed') return label.includes('completed') || label.includes('tamat')
      return true
    })
  }, [manga, status])

  if (manga.length === 0) return null

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Project YummyScans
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Karya terjemahan original dari tim YummyScans
            </p>
          </div>
          <a
            href="/search?src=project"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Lihat semua
          </a>
        </div>

        <div className="flex gap-2 mt-5 mb-6">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={
                'rounded-full px-4 py-1.5 text-sm font-semibold transition ' +
                (status === s
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground')
              }
            >
              {s === 'all' ? 'Semua' : s === 'ongoing' ? 'Ongoing' : 'Tamat'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.length > 0 ? (
            items.map((m, i) => (
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
                  {isNew(m.updatedOn) && (
                    <span className="absolute top-1.5 right-1.5 rounded bg-[#00dc64] px-1.5 py-0.5 text-[9px] font-bold text-black">
                      UP
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-white/80">
                      <Clock className="h-3 w-3" />
                      {relTime(m.updatedOn)}
                    </span>
                  </div>
                </div>
                <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground group-hover:text-foreground/70 transition-colors">
                  {m.title}
                </h3>
              </a>
            ))
          ) : (
            <p className="col-span-full py-8 text-sm text-muted-foreground">
              Belum ada project untuk filter ini.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
