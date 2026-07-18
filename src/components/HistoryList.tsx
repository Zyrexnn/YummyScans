'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Clock, Trash2, ArrowRight, X } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { timeAgo } from '../lib/userData'

interface HistoryItem {
  mangaSlug: string
  mangaTitle: string
  coverUrl: string | null
  type?: string
  chapterSlug: string
  chapterNum: string
  page?: number
  readAt: number
}

export default function HistoryList() {
  const { history, remove: removeHistory, clear: clearHistory, ready } = useHistory()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || !ready) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-headline mb-2">Belum Ada Riwayat Baca</h3>
        <p className="text-body-sm text-muted-foreground mb-6">Riwayat baca akan muncul di sini setelah Anda membaca chapter.</p>
        <a href="/latest" className="inline-flex items-center gap-2 yummy-btn-primary">
          Jelajahi Manga Terbaru
        </a>
      </div>
    )
  }

  // Group by mangaSlug, keep latest chapter per manga
  const mangaMap = new Map<string, HistoryItem>()
  for (const item of history) {
    const existing = mangaMap.get(item.mangaSlug)
    if (!existing || item.readAt > existing.readAt) {
      mangaMap.set(item.mangaSlug, item)
    }
  }
  const grouped = Array.from(mangaMap.values()).sort((a, b) => b.readAt - a.readAt)

  return (
    <div className="space-y-4">
      <h2 className="text-headline">Riwayat Baca ({grouped.length})</h2>

      <div className="space-y-3">
        {grouped.map((item) => (
          <article
            key={item.mangaSlug}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary hover:bg-muted/50 transition-colors group"
          >
            <a href={`/manga/${item.mangaSlug}`} className="relative w-20 h-28 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              {item.coverUrl ? (
                <img src={item.coverUrl} alt={item.mangaTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              {item.type && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded bg-background text-[10px] leading-none shadow">
                  {item.type === 'Manhwa' ? '🇰🇷' : item.type === 'Manhua' ? '🇨🇳' : '🇯🇵'}
                </span>
              )}
            </a>

            <div className="flex-1 min-w-0">
              <a href={`/manga/${item.mangaSlug}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 block">
                {item.mangaTitle}
              </a>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-mono">
                  <BookOpen className="w-3.5 h-3.5" /> Ch.{item.chapterNum}
                </span>
                {item.page && item.page > 1 && (
                  <span className="flex items-center gap-1.5 font-mono text-accent-foreground">
                    Hal. {item.page}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {timeAgo(item.readAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/manga/${item.mangaSlug}/${item.chapterSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Lanjut Baca
                <ArrowRight className="w-3 h-3" />
              </a>
              <button
                onClick={() => {
                  if (confirm('Hapus riwayat manga ini?')) {
                    removeHistory(item.mangaSlug);
                  }
                }}
                className="p-2 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                aria-label="Hapus riwayat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        onClick={() => {
          if (confirm('Hapus semua riwayat baca?')) {
            clearHistory();
          }
        }}
        className="w-full mt-6 py-2 rounded-lg bg-muted text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
      >
        Hapus Semua Riwayat
      </button>
    </div>
  )
}