'use client'

import { useState, useEffect, useCallback } from 'react'
import { getFavorites, toggleFavorite, isFavorite, removeFavorite as removeFav, clearFavorites as clearFav } from '../lib/userData'
import type { FavoriteItem } from '../lib/userData'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [ready, setReady] = useState(false)

  const refresh = useCallback(() => {
    setFavorites(getFavorites())
  }, [])

  useEffect(() => {
    refresh()
    setReady(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'yummy:favorites') refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  const toggle = useCallback((item: Omit<FavoriteItem, 'savedAt'>) => {
    const newFav = toggleFavorite(item)
    refresh()
    return newFav
  }, [refresh])

  const checkFav = useCallback((slug: string) => {
    return favorites.some(f => f.slug === slug)
  }, [favorites])

  const removeFavorite = useCallback((slug: string) => {
    removeFav(slug)
    refresh()
  }, [refresh])

  const clearFavorites = useCallback(() => {
    clearFav()
    refresh()
  }, [refresh])

  return { favorites, toggle, isFavorite: checkFav, removeFavorite, clearFavorites, ready }
}