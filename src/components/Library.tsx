'use client'

import { useState, useEffect } from 'react'
import { Heart, History, BookOpen, Clock, Trash2, ArrowRight, X } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
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

export default function Library() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { history, remove: removeHistory, clear: clearHistory } = useHistory()
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites')

  // Group history by mangaSlug, keep latest chapter per manga
  const mangaMap = new Map<string, HistoryItem>()
  for (const item of history) {
    const existing = mangaMap.get(item.mangaSlug)
    if (!existing || item.readAt > existing.readAt) {
      mangaMap.set(item.mangaSlug, item)
    }
  }
  const historyItems = Array.from(mangaMap.values()).sort((a, b) => b.readAt - a.readAt)

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-lg mb-2">Library</h1>
        <p className="text-body-sm text-muted-foreground">
          Kelola manga favorit dan riwayat bacaan Anda
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          <Heart className="w-4 h-4" />
          Favorit <span className="bg-secondary px-2 py-0.5 rounded-full text-xs font-mono">{favorites.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          <History className="w-4 h-4" />
          Riwayat <span className="bg-secondary px-2 py-0.5 rounded-full text-xs font-mono">{historyItems.length}</span>
        </button>
      </div>

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-headline">Favorit Anda</h2>
            {favorites.length > 0 && (
              <button
                onClick={() => { if (confirm('Hapus semua favorit?')) clearFavorites() }}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Hapus Semua
              </button>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-headline mb-2">Belum Ada Favorit</h3>
              <p className="text-body-sm text-muted-foreground mb-6">
                Tambah manga ke favorit dengan menekan ikon hati di kartu manga atau halaman detail.
              </p>
              <a href="/latest" className="inline-flex items-center gap-2 yummy-btn-primary">
                Jelajahi Manga Terbaru
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {favorites.map((manga) => (
                <article key={manga.slug} className="group relative">
                  <a href={`/manga/${manga.slug}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                      {manga.coverUrl ? (
                        <img
                          src={manga.coverUrl}
                          alt={manga.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">No Cover</span>
                        </div>
                      )}
                      {manga.type && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded bg-background text-[10px] leading-none shadow">
                          {manga.type === 'Manhwa' ? '🇰🇷' : manga.type === 'Manhua' ? '🇨🇳' : '🇯🇵'}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(manga.slug) }}
                        className="absolute left-1.5 bottom-1.5 p-1.5 rounded-full bg-background/80 backdrop-blur shadow text-red-500 hover:bg-red-500/20 transition-colors"
                        aria-label="Hapus dari favorit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground group-hover:text-foreground/70 transition-colors duration-200">
                      {manga.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-headline">Riwayat Baca</h2>

          {historyItems.length === 0 ? (
            <div className="text-center py-16">
              <History className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-headline mb-2">Belum Ada Riwayat</h3>
              <p className="text-body-sm text-muted-foreground mb-6">
                Riwayat baca akan muncul di sini setelah Anda membaca chapter.
              </p>
              <a href="/latest" className="inline-flex items-center gap-2 yummy-btn-primary">
                Jelajahi Manga Terbaru
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {historyItems.map((item) => (
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
                          removeHistory(item.mangaSlug)
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

              <button
                onClick={() => {
                  if (confirm('Hapus semua riwayat baca?')) {
                    clearHistory()
                  }
                }}
                className="w-full mt-6 py-2 rounded-lg bg-muted text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Hapus Semua Riwayat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}