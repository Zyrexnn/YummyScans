'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import AdScript from './AdScript'

type Slide = {
  title: string
  rating: number
  genre: string
  description: string
  image: string
}

type Announcement = {
  title: string
  date: string
  image: string
}

const slides: Slide[] = [
  {
    title: 'Job Change Log',
    rating: 8.6,
    genre: 'Romance',
    description:
      'Setelah kehilangan pekerjaan, ia menemukan dunia baru yang penuh warna — dan mungkin juga cinta yang tak terduga di balik layar kantor yang asing.',
    image: 'https://picsum.photos/seed/jobchange/1200/500',
  },
  {
    title: 'The Silent Blade',
    rating: 9.1,
    genre: 'Action',
    description:
      'Seorang pendekar bayangan harus menghadapi masa lalunya ketika klan lama kembali untuk menuntut balas atas darah yang pernah tumpah.',
    image: 'https://picsum.photos/seed/silentblade/1200/500',
  },
  {
    title: 'Starlight Café',
    rating: 7.9,
    genre: 'Slice of Life',
    description:
      'Di sebuah kafe kecil yang hanya muncul saat malam, setiap cangkir kopi menyimpan cerita dari pelanggan yang tak pernah kembali dua kali.',
    image: 'https://picsum.photos/seed/starlight/1200/500',
  },
]

const announcements: Announcement[] = [
  { title: 'Maintenance Server Mingguan', date: '12 Jul 2026', image: 'https://picsum.photos/seed/ann1/120/120' },
  { title: 'Rilis Chapter Baru: Job Change Log 42', date: '10 Jul 2026', image: 'https://picsum.photos/seed/ann2/120/120' },
  { title: 'Kompetisi Fan Art Bulan Ini', date: '08 Jul 2026', image: 'https://picsum.photos/seed/ann3/120/120' },
  { title: 'Update Tampilan Dark Mode', date: '05 Jul 2026', image: 'https://picsum.photos/seed/ann4/120/120' },
  { title: 'Open Rekrutmen Penerjemah', date: '01 Jul 2026', image: 'https://picsum.photos/seed/ann5/120/120' },
]

function Dots({ count, active, onChange }: { count: number; active: number; onChange: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={
            i === active
              ? 'h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-accent/40'
              : 'h-1.5 w-1.5 rounded-full bg-foreground/40'
          }
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const [ann, setAnn] = useState(0)

  const nextSlide = () => setSlide((s) => (s + 1) % slides.length)
  const prevSlide = () => setSlide((s) => (s - 1 + slides.length) % slides.length)
  const nextAnn = () => setAnn((a) => (a + 1) % announcements.length)
  const prevAnn = () => setAnn((a) => (a - 1 + announcements.length) % announcements.length)

  return (
    <section className="bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[65fr_35fr]">
          {/* HERO CAROUSEL */}
          <div className="relative">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-secondary lg:aspect-[16/7]">
              {slides.map((s, i) => (
                <div
                  key={i}
                  className={
                    'absolute inset-0 transition-opacity duration-500 ' +
                    (i === slide ? 'opacity-100' : 'opacity-0 pointer-events-none')
                  }
                >
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-4 sm:gap-3 sm:p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white sm:text-2xl md:text-4xl">{s.title}</h2>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-white sm:text-sm">
                        <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-accent text-accent" />
                        {s.rating.toFixed(1)}
                      </span>
                      <span className="rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground sm:text-xs">
                        {s.genre}
                      </span>
                    </div>
                    <p className="line-clamp-2 max-w-xl text-xs text-white/70 sm:text-sm md:text-base">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={prevSlide}
                aria-label="Previous"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <Dots count={slides.length} active={slide} onChange={setSlide} />
              <button
                onClick={nextSlide}
                aria-label="Next"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* PENGUMUMAN PANEL */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-end justify-between">
              <h3 className="text-base font-bold text-foreground sm:text-lg">Pengumuman</h3>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Semua
              </a>
            </div>

            <div className="flex flex-1 flex-col gap-2 sm:gap-3">
              {[0, 1].map((offset) => {
                const a = announcements[(ann + offset) % announcements.length]
                return (
                  <div
                    key={offset}
                    className="flex items-center gap-2.5 rounded-xl bg-secondary p-2.5 transition sm:gap-3 sm:p-3"
                  >
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-11 w-11 flex-shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[13px] font-semibold text-foreground sm:text-sm">{a.title}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">{a.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={prevAnn}
                aria-label="Previous announcement"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <Dots count={announcements.length} active={ann} onChange={setAnn} />
              <button
                onClick={nextAnn}
                aria-label="Next announcement"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AD */}
        <AdScript className="mt-10" />
      </div>
    </section>
  )
}
