'use client'

import { useEffect, useState } from 'react'
import { BookOpen, ArrowRight, Play } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'

interface ContinueReadingProps {
  mangaSlug: string
  firstChapterSlug?: string
  firstChapterNum?: number
}

export default function ContinueReading({ mangaSlug, firstChapterSlug, firstChapterNum }: ContinueReadingProps) {
  const { history, ready } = useHistory()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || !ready) return null

  const mangaHistory = history
    .filter(h => h.mangaSlug === mangaSlug)
    .sort((a, b) => b.readAt - a.readAt)

  if (mangaHistory.length > 0) {
    const latest = mangaHistory[0]
    return (
      <a
        href={`/manga/${mangaSlug}/${latest.chapterSlug}`}
        className="yummy-btn-primary inline-flex items-center gap-2"
      >
        <BookOpen className="w-4 h-4" />
        Lanjut Ch.{latest.chapterNum}
        <ArrowRight className="w-4 h-4" />
      </a>
    )
  }

  if (firstChapterSlug) {
    return (
      <a
        href={`/manga/${mangaSlug}/${firstChapterSlug}`}
        className="yummy-btn-primary inline-flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Mulai Baca
        <ArrowRight className="w-4 h-4" />
      </a>
    )
  }

  return null
}
