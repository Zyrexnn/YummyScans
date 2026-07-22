'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, BookOpen, Home, Compass, Clock, Swords, Heart, Wand2, Rocket, Flame, Ghost, Bookmark, History } from 'lucide-react'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/search', label: 'Cari', icon: Search },
  { href: '/genre', label: 'Genre', icon: Compass },
  { href: '/latest', label: 'Terbaru', icon: Clock },
  { href: '/library', label: 'Library', icon: Bookmark },
]

const QUICK_GENRES = [
  { name: 'Action', slug: 'action', icon: Swords },
  { name: 'Romance', slug: 'romance', icon: Heart },
  { name: 'Fantasy', slug: 'fantasy', icon: Wand2 },
  { name: 'Isekai', slug: 'isekai', icon: Rocket },
  { name: 'Ecchi', slug: 'ecchi', icon: Flame },
  { name: 'Horror', slug: 'horror', icon: Ghost },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setPathname(window.location.pathname)
    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0b]/95 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-[#0a0a0b]'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 sm:h-[60px] flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 group no-underline shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-[-4deg] duration-300">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <span className="text-lg sm:text-[22px] font-bold tracking-tight text-white">
              YummyScans
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline ${
                  isActive(link.href)
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1.5">
            <form action="/search" method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                name="q"
                placeholder="Cari manga..."
                className="h-9 w-[200px] rounded-lg bg-white/10 border border-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                onFocus={(e) => {
                  (e.target as HTMLInputElement).blur()
                  window.location.href = '/search'
                }}
              />
            </form>
            <div className="text-white">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1">
            <a href="/search" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Search className="w-5 h-5 text-white" />
            </a>
            <div className="text-white">
              <ThemeToggle />
            </div>
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-[70] w-[280px] bg-[#0a0a0b] shadow-xl md:hidden flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 shrink-0">
                <a href="/" className="flex items-center gap-2 no-underline" onClick={() => setIsOpen(false)}>
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">
                    YummyScans
                  </span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 px-3">
                <div className="space-y-0.5">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                        isActive(link.href)
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <link.icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-white/40">
                    Genre Populer
                  </p>
                  <div className="space-y-0.5">
                    {QUICK_GENRES.map((g) => (
                      <a
                        key={g.slug}
                        href={`/genre/${g.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors no-underline"
                      >
                        <g.icon className="w-3.5 h-3.5 shrink-0 text-white/40" />
                        {g.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 p-4">
                <a href="/admin/login" onClick={() => setIsOpen(false)} className="text-sm font-medium text-white/60 hover:text-white">
                  Admin Login
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
