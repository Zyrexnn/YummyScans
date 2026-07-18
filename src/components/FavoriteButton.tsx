'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteButtonProps {
  slug: string
  title: string
  coverUrl: string | null
  type?: string
  iconOnly?: boolean
}

export default function FavoriteButton({ slug, title, coverUrl, type, iconOnly }: FavoriteButtonProps) {
  const { toggle, isFavorite, ready } = useFavorites()
  const [mounted, setMounted] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const fav = ready ? isFavorite(slug) : false

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle({ slug, title, coverUrl, type })
    setAnimating(true)
    setTimeout(() => setAnimating(false), 400)
  }

  if (!mounted) return null

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-full backdrop-blur shadow transition-all duration-200 ${
          fav
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
            : 'bg-background/80 text-foreground hover:text-red-500 hover:bg-red-500/20'
        } ${animating ? 'scale-125' : ''}`}
        aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-200 ${fav ? 'fill-current' : ''} ${animating ? 'animate-ping' : ''}`}
        />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
        fav
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 scale-105'
          : 'bg-secondary text-foreground border-2 border-border hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/5'
      } ${animating ? 'scale-110' : ''}`}
      aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${fav ? 'fill-current scale-110' : ''} ${animating ? 'animate-ping' : ''}`}
      />
      <span>{fav ? 'Favorit' : 'Tambah Favorit'}</span>
      {fav && (
        <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
      )}
    </button>
  )
}