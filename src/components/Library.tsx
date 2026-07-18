'use client'

import { useState, useEffect } from 'react'
import { Heart, History, BookOpen, Clock, Trash2, ArrowRight, X, ChevronLeft } from 'lucide-react'
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

  const mangaMap = new Map<string, HistoryItem>()
  for (const item of history) {
    const existing = mangaMap.get(item.mangaSlug)
    if (!existing || item.readAt > existing.readAt) {
      mangaMap.set(item.mangaSlug, item)
    }
  }
  const historyItems = Array.from(mangaMap.values()).sort((a, b) => b.readAt - a.readAt)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-display-lg mb-1">Library</h1>
        <p className="text-body-sm text-muted-foreground">
          Kelola manga favorit dan riwayat bacaan Anda
        </p>
      </div>

      <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-6 w-full overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorit</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
            activeTab === 'favorites' ? 'bg-white/20' : 'bg-secondary'
          }`}>{favorites.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
            activeTab === 'history' ? 'bg-white/20' : 'bg-secondary'
          }`}>{historyItems.length}</span>
        </button>
      </div>

      {activeTab === 'favorites' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-headline">Favorit Anda</h2>
            {favorites.length > 0 && (
              <button
                onClick={() => { if (confirm('Hapus semua favorit?')) clearFavorites() }}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Hapus Semua
              </button>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-headline mb-2">Belum Ada Favorit</h3>
              <p className="text-body-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Tambah manga ke favorit dengan menekan ikon hati di kartu manga atau halaman detail.
              </p>
              <a href="/latest" className="inline-flex items-center gap-2 yummy-btn-primary">
                Jelajahi Manga Terbaru
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded bg-background/90 text-[10px] leading-none shadow-sm">
                          {manga.type === 'Manhwa' ? '🇰🇷' : manga.type === 'Manhua' ? '🇨🇳' : '🇯🇵'}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(manga.slug) }}
                        className="absolute left-1.5 bottom-1.5 p-1.5 rounded-full bg-background/80 backdrop-blur shadow text-red-500 hover:bg-red-500/20 hover:scale-110 transition-all"
                        aria-label="Hapus dari favorit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                      {manga.title}
                    </h3>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {historyItems.length > 0 && (
            <div className="flex items-center justify-between">
              <h2 className="text-headline">Riwayat Baca</h2>
              <button
                onClick={() => { if (confirm('Hapus semua riwayat baca?')) clearHistory() }}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Hapus Semua
              </button>
            </div>
          )}

          {historyItems.length === 0 ? (
            <div className="text-center py-16">
              <History className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-headline mb-2">Belum Ada Riwayat</h3>
              <p className="text-body-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Riwayat baca akan muncul di sini setelah Anda membaca chapter.
              </p>
              <a href="/latest" className="inline-flex items-center gap-2 yummy-btn-primary">
                Jelajahi Manga Terbaru
              </a>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {historyItems.map((item) => (
                <article
                  key={item.mangaSlug}
                  className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-secondary hover:bg-muted/50 transition-colors group"
                >
                  <a href={`/manga/${item.mangaSlug}`} className="relative w-16 sm:w-20 h-22 sm:h-28 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt={item.mangaTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 sm:w-8 h-6 sm:h-8 text-muted-foreground" />
                      </div>
                    )}
                    {item.type && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded bg-background text-[10px] leading-none shadow">
                        {item.type === 'Manhwa' ? '🇰🇷' : item.type === 'Manhua' ? '🇨🇳' : '🇯🇵'}
                      </span>
                    )}
                  </a>

                  <div className="flex-1 min-w-0">
                    <a href={`/manga/${item.mangaSlug}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 block text-sm sm:text-base">
                      {item.mangaTitle}
                    </a>
                    <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono">
                        <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Ch.{item.chapterNum}
                      </span>
                      {item.page && item.page > 1 && (
                        <span className="flex items-center gap-1 font-mono text-accent-foreground">
                          Hal. {item.page}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {timeAgo(item.readAt)}
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                      <a
                        href={`/manga/${item.mangaSlug}/${item.chapterSlug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
                        className="p-1.5 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        aria-label="Hapus riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
