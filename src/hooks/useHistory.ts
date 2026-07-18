'use client'

import { useState, useEffect, useCallback } from 'react'
import { getHistory, addHistory, updateHistoryPage, removeHistory as removeHist, clearHistory as clearHist } from '../lib/userData'
import type { HistoryItem } from '../lib/userData'

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [ready, setReady] = useState(false)

  const refresh = useCallback(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    refresh()
    setReady(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'yummy:history') refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  const add = useCallback((item: Omit<HistoryItem, 'readAt'>) => {
    addHistory(item)
    refresh()
  }, [refresh])

  const updatePage = useCallback((mangaSlug: string, chapterSlug: string, page: number) => {
    updateHistoryPage(mangaSlug, chapterSlug, page)
    refresh()
  }, [refresh])

  const remove = useCallback((mangaSlug: string) => {
    removeHist(mangaSlug)
    refresh()
  }, [refresh])

  const clear = useCallback(() => {
    clearHist()
    refresh()
  }, [refresh])

  return { history, add, updatePage, remove, clear, ready }
}