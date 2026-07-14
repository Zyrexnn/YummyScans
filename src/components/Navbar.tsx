'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl shadow-sm'
          : 'bg-background border-b border-border'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="/"
          className="flex items-center gap-2.5 group no-underline"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center transition-transform group-hover:rotate-[-4deg] duration-300">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-[22px] font-bold tracking-tight text-foreground">
            YummyScans
          </span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Beranda' },
            { href: '/search', label: 'Cari' },
            { href: '/genre', label: 'Genre' },
            { href: '/latest', label: 'Terbaru' },
          ].map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-sm font-medium px-4 py-2 rounded-[10px] hover:bg-secondary transition-colors text-foreground no-underline"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ThemeToggle />
          </motion.div>
          <motion.a
            href="/search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
              <Search className="w-5 h-5" />
            </Button>
          </motion.a>
          <motion.a
            href="/admin/login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button className="rounded-full text-sm font-medium px-5 h-9">
              Masuk
            </Button>
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <motion.button
            className="p-2 rounded-[10px] hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-background border-t border-border overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/search', label: 'Cari' },
                { href: '/genre', label: 'Genre' },
                { href: '/latest', label: 'Terbaru' },
              ].map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium px-4 py-3 rounded-[10px] hover:bg-secondary transition-colors text-foreground no-underline"
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex gap-3 pt-4 mt-2 border-t border-border">
                <a href="/search" className="flex-1">
                  <Button variant="outline" className="w-full rounded-full h-10">
                    <Search className="w-4 h-4 mr-2" /> Cari Manga
                  </Button>
                </a>
                <a href="/admin/login" className="flex-1">
                  <Button className="w-full rounded-full h-10">
                    Masuk
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
