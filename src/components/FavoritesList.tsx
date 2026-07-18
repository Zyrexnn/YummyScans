'use client'

import { useEffect, useState } from 'react'
import { Heart, Trash2, X } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { timeAgo } from '../lib/userData'

interface FavoritesListProps {
  onClear?: () => void
}

export default function FavoritesList({ onClear }: FavoritesListProps) {
  const { favorites, removeFavorite, clearFavorites, ready } = useFavorites()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || !ready) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-headline mb-2">Belum Ada Favorit</h3>
        <p className="text-body-sm text-muted-foreground mb-6">Tambah manga ke favorit dengan menekan ikon hati di kartu manga atau halaman detail.</p>
        <a href="/latest" className="inline-flex items-center gap-2 yummy-btn-primary">
          Jelajahi Manga Terbaru
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-headline">Favorit ({favorites.length})</h2>
        {onClear && (
          <button
            onClick={() => { if (confirm('Hapus semua favorit?')) { clearFavorites(); onClear?.(); }}}
            className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Hapus Semua
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {favorites.map((manga, i) => (
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    <span className="text-xs text-muted-foreground font-medium">No Cover</span>
                  </div>
                )}
                {manga.type && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded bg-background text-[10px] leading-none shadow">
                    {manga.type === 'Manhwa' ? '🇰🇷' : manga.type === 'Manhua' ? '🇨🇳' : '🇯🇵'}
                  </span>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(manga.slug); }}
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
    </div>
  )
}