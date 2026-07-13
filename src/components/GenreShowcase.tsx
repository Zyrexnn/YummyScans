'use client'

import { motion } from 'framer-motion'
import {
  Swords, Mountain, Drama, Wand2, Ghost, Search,
  Heart, Rocket, Coffee, Trophy, Zap, Skull
} from 'lucide-react'

const genres = [
  { name: 'Action', slug: 'action', icon: Swords, color: 'bg-block-coral' },
  { name: 'Adventure', slug: 'adventure', icon: Mountain, color: 'bg-block-lime' },
  { name: 'Comedy', slug: 'comedy', icon: Drama, color: 'bg-block-cream' },
  { name: 'Fantasy', slug: 'fantasy', icon: Wand2, color: 'bg-block-lilac' },
  { name: 'Horror', slug: 'horror', icon: Ghost, color: 'bg-block-navy' },
  { name: 'Romance', slug: 'romance', icon: Heart, color: 'bg-block-pink' },
  { name: 'Sci-Fi', slug: 'sci-fi', icon: Rocket, color: 'bg-block-mint' },
  { name: 'Slice of Life', slug: 'slice-of-life', icon: Coffee, color: 'bg-block-cream' },
  { name: 'Sports', slug: 'sports', icon: Trophy, color: 'bg-block-lime' },
  { name: 'Supernatural', slug: 'supernatural', icon: Zap, color: 'bg-block-lilac' },
  { name: 'Thriller', slug: 'thriller', icon: Skull, color: 'bg-block-coral' },
  { name: 'Mystery', slug: 'mystery', icon: Search, color: 'bg-block-mint' },
]

export default function GenreShowcase() {
  return (
    <section className="section-spacing bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-eyebrow text-muted-foreground mb-3">Koleksi Lengkap</div>
          <h2 className="text-display-lg mb-4">Jelajahi Genre</h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Temukan manga favoritmu dari berbagai genre yang tersedia.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {genres.map((genre, i) => (
            <motion.a
              key={genre.slug}
              href={`/search?genre=${genre.slug}`}
              className="group relative overflow-hidden rounded-[16px] p-4 md:p-5 text-center no-underline transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <div className={`absolute inset-0 ${genre.color} opacity-30 dark:opacity-20 transition-opacity group-hover:opacity-50`} />
              <div className="relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <genre.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground/80" />
                </div>
                <span className="text-[12px] md:text-[13px] font-semibold text-foreground/90">{genre.name}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
