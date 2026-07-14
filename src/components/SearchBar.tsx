'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'

type Suggestion = { title: string; coverUrl: string; type: string; slug: string }

export default function SearchBar() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(q), 250)
    return () => clearTimeout(t)
  }, [q, search])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (slug: string) => {
    window.location.href = `/manga/${slug}`
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (active >= 0 && results[active]) go(results[active].slug)
      else if (q.trim()) window.location.href = `/search?q=${encodeURIComponent(q)}`
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setActive(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Cari manga, manhwa, manhua..."
          className="h-9 w-full rounded-full border border-border bg-secondary pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6d28d9]/40"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('')
              setResults([])
            }}
            aria-label="Clear"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-border bg-background shadow-xl">
          {loading && <p className="px-4 py-3 text-sm text-muted-foreground">Mencari...</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted-foreground">Tidak ditemukan</p>
          )}
          {results.map((r, i) => (
            <button
              key={r.slug + i}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.slug)}
              className={
                'flex w-full items-center gap-3 px-3 py-2 text-left transition ' +
                (i === active ? 'bg-secondary' : '')
              }
            >
              <img
                src={r.coverUrl}
                alt=""
                className="h-10 w-8 flex-shrink-0 rounded bg-muted object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">{r.title}</span>
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                {r.type}
              </span>
            </button>
          ))}
          {results.length > 0 && (
            <a
              href={`/search?q=${encodeURIComponent(q)}`}
              className="block border-t border-border px-4 py-2 text-center text-xs font-medium text-[#a855f7] transition hover:bg-secondary"
            >
              Lihat semua hasil
            </a>
          )}
        </div>
      )}
    </div>
  )
}
