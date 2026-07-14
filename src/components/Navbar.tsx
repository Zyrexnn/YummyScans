'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, BookOpen, Home, Compass, Clock, Swords, Heart, Wand2, Rocket, Flame, Ghost } from 'lucide-react'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/search', label: 'Cari', icon: Search },
  { href: '/genre', label: 'Genre', icon: Compass },
  { href: '/latest', label: 'Terbaru', icon: Clock },
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
            ? 'bg-background/90 backdrop-blur-xl shadow-sm'
            : 'bg-background border-b border-border'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 sm:h-[60px] flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 group no-underline shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-[-4deg] duration-300">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-[22px] font-bold tracking-tight text-foreground">
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
                    ? 'bg-secondary text-foreground'
                    : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1.5">
            <ThemeToggle />
            <a href="/search">
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-secondary">
                <Search className="w-5 h-5" />
              </Button>
            </a>
            <a href="/admin/login">
              <Button className="rounded-lg text-sm font-medium px-5 h-9">
                Masuk
              </Button>
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1">
            <a href="/search" className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Search className="w-5 h-5 text-foreground" />
            </a>
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed inset-y-0 left-0 z-[70] w-[280px] bg-background shadow-xl md:hidden flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
                <a href="/" className="flex items-center gap-2 no-underline" onClick={() => setIsOpen(false)}>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    YummyScans
                  </span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto py-3 px-3">
                <div className="space-y-0.5">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                        isActive(link.href)
                          ? 'bg-secondary text-foreground'
                          : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <link.icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>

                {/* Genre Quick Links */}
                <div className="mt-5">
                  <p className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Genre Populer
                  </p>
                  <div className="space-y-0.5">
                    {QUICK_GENRES.map((g) => (
                      <a
                        key={g.slug}
                        href={`/genre/${g.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors no-underline"
                      >
                        <g.icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                        {g.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="shrink-0 border-t border-border p-4">
                <a href="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-lg h-10 text-sm font-medium">
                    Masuk
                  </Button>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
