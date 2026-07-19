'use client'

import { useState, useEffect } from 'react'
import { Badge } from './ui/badge'
import { BookOpen, Clock, Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

interface MangaCardProps {
  title: string
  coverUrl: string | null
  slug: string
  type?: string
  chapter?: string
  updatedOn?: string
  genres?: { id: string; name: string; slug: string }[]
  status?: string
  index?: number
  className?: string
}

const FLAG: Record<string, string> = { Manhwa: '🇰🇷', Manga: '🇯🇵', Manhua: '🇨🇳' }

function parseDuration(updatedOn: string): string {
  const text = updatedOn.toLowerCase()
  const num = text.match(/(\d+)/)?.[1] || '1'
  if (text.includes('menit')) return `${num}m`
  if (text.includes('jam')) return `${num}h`
  if (text.includes('hari')) return `${num}d`
  if (text.includes('minggu')) return `${num}w`
  return `${num}d`
}

function isNew(updatedOn: string): boolean {
  const text = updatedOn.toLowerCase()
  return text.includes('menit') || text.includes('jam') || /^1\s*hari/.test(text)
}

export default function MangaCard({
  title,
  coverUrl,
  slug,
  type,
  chapter,
  updatedOn,
  genres,
  status,
  index = 0,
  className = ''
}: MangaCardProps) {
  const fresh = updatedOn ? isNew(updatedOn) : false
  const { favorites, toggle, isFavorite, ready } = useFavorites()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fav = ready ? isFavorite(slug) : false

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle({ slug, title, coverUrl, type })
  }

  return (
    <a
      href={`/manga/${slug}`}
      className={`group block ${className} animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.04}s`, contentVisibility: 'auto', containIntrinsicSize: '0 250px' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent && !parent.querySelector('.fallback')) {
                const div = document.createElement('div')
                div.className = 'fallback absolute inset-0 flex flex-col items-center justify-center bg-muted gap-2'
                div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg><span class="text-xs text-muted-foreground font-medium">No Cover</span>'
                parent.appendChild(div)
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">No Cover</span>
          </div>
        )}

        {/* top-left: time + NEW */}
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
          {updatedOn && (
            <span className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {parseDuration(updatedOn)}
            </span>
          )}
          {fresh && <span className="rounded bg-red-600 px-1 py-0.5 text-[9px] font-bold text-white">NEW</span>}
        </div>

        {/* top-right: favorite + flag + status */}
        <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
          {mounted && (
            <button
              onClick={handleFavorite}
              aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-background/80 backdrop-blur text-foreground/70 hover:bg-background hover:text-red-500 transition-colors"
            >
              <Heart className={`h-3.5 w-3.5 ${fav ? 'fill-current text-red-500' : 'stroke-current'}`} strokeWidth={2} />
            </button>
          )}
          {status && (
            <Badge
              variant={status === 'completed' ? 'default' : 'secondary'}
              className="text-[9px] font-mono uppercase tracking-wider rounded px-1.5 py-0.5 shadow backdrop-blur-sm"
            >
              {status === 'ongoing' ? 'Ongoing' : status === 'completed' ? 'Tamat' : 'Hiatus'}
            </Badge>
          )}
          {type && FLAG[type] && (
            <span className="flex h-4 w-4 items-center justify-center rounded bg-background text-[10px] leading-none shadow">
              {FLAG[type]}
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight text-foreground group-hover:text-foreground/70 transition-colors duration-200">
        {title}
      </h3>

      {chapter && (
        <p className="mt-1 truncate text-[10px] text-muted-foreground">{chapter}</p>
      )}
    </a>
  )
}
