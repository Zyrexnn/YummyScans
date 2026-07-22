'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { LatestManga } from '../lib/komiku'

export default function Hero({ manga = [] }: { manga?: LatestManga[] }) {
  const [slide, setSlide] = useState(0)
  const slides = manga.slice(0, 5)

  const next = useCallback(() => {
    if (slides.length < 2) return
    setSlide((s) => (s + 1) % slides.length)
  }, [slides.length])
  const prev = useCallback(() => {
    if (slides.length < 2) return
    setSlide((s) => (s - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (slides.length === 0) return null

  const s = slides[slide]

  return (
    <section className="bg-[#0a0a0b] overflow-hidden">
      <div className="relative">
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] max-h-[500px]">
          {slides.map((slideData, i) => (
            <div
              key={slideData.slug + i}
              className={
                'absolute inset-0 transition-all duration-700 ease-in-out ' +
                (i === slide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none')
              }
            >
              <img
                src={slideData.coverUrl}
                alt={slideData.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-transparent" />
            </div>
          ))}

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 pb-8 sm:pb-12 md:pb-16">
              <div className="max-w-xl">
                <span className="inline-block rounded-full bg-[#00dc64] px-3 py-1 text-[11px] font-bold text-black mb-3 uppercase tracking-wider">
                  {s.type || 'Manga'}
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3">
                  {s.title}
                </h1>
                <p className="text-sm sm:text-base text-white/60 line-clamp-2 mb-5 max-w-lg">
                  {s.chapter || ''}
                </p>
                <a
                  href={`/manga/${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black hover:bg-white/90 transition-all hover:scale-105 no-underline"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Baca Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 sm:right-8 flex items-center gap-2">
          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`rounded-full transition-all ${
                      i === slide
                        ? 'h-2 w-6 bg-white'
                        : 'h-2 w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
