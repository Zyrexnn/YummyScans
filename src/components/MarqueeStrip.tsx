'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface MarqueeStripProps {
  items?: string[]
}

export default function MarqueeStrip({ items = [] }: MarqueeStripProps) {
  if (items.length === 0) {
    items = [
      'One Piece Ch. 1100 sudah tersedia!',
      'Manga baru: Solo Leveling Season 2',
      'Update setiap hari Senin & Jumat',
      'Baca gratis tanpa iklan!'
    ]
  }

  const duplicatedItems = [...items, ...items]

  return (
    <motion.div
      className="bg-primary text-primary-foreground h-[40px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center h-full animate-marquee whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <span key={index} className="flex items-center gap-3 px-8">
            <Zap className="w-3 h-3 text-accent flex-shrink-0" />
            <span className="text-[13px] font-medium tracking-wide">
              {item}
            </span>
            <span className="text-primary-foreground/20 mx-3">•</span>
          </span>
        ))}
      </div>
    </motion.div>
  )
}
