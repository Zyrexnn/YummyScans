'use client'

import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { BookOpen } from 'lucide-react'

interface MangaCardProps {
  title: string
  coverUrl: string | null
  slug: string
  genres?: { id: string; name: string; slug: string }[]
  status?: string
  index?: number
}

export default function MangaCard({
  title,
  coverUrl,
  slug,
  genres,
  status,
  index = 0
}: MangaCardProps) {
  return (
    <motion.a
      href={`/manga/${slug}`}
      className="group block"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative overflow-hidden rounded-[16px] bg-muted">
        <div className="aspect-[3/4] overflow-hidden relative">
          {coverUrl ? (
            <motion.img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
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

          {/* Shimmer */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {/* Status Badge */}
        {status && (
          <div className="absolute top-3 right-3">
            <Badge
              variant={status === 'completed' ? 'default' : 'secondary'}
              className="text-[10px] font-mono uppercase tracking-wider rounded-[8px] px-2.5 py-1 shadow-lg backdrop-blur-sm"
            >
              {status === 'ongoing' ? 'Ongoing' : status === 'completed' ? 'Tamat' : 'Hiatus'}
            </Badge>
          </div>
        )}
      </div>

      {/* Title */}
      <motion.h3
        className="text-[15px] font-semibold mt-3 line-clamp-2 text-foreground group-hover:text-foreground/70 transition-colors duration-200 leading-tight"
        whileHover={{ x: 2 }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h3>

      {/* Genres */}
      {genres && genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {genres.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-[4px]"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
    </motion.a>
  )
}
