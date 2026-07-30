'use client'

import { useState, useEffect, useCallback } from 'react'

const FAV_EVENT = 'fav-changed'

export function readFavStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

function writeFavStorage<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent(FAV_EVENT, { detail: { key } }))
}

export function useFavorites<T extends { id: number }>(storageKey: string) {
  const [items, setItems] = useState<T[]>([])

  useEffect(() => {
    setItems(readFavStorage<T>(storageKey))

    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ key: string }>
      if (ce.detail.key === storageKey) {
        setItems(readFavStorage<T>(storageKey))
      }
    }
    window.addEventListener(FAV_EVENT, handler)
    return () => window.removeEventListener(FAV_EVENT, handler)
  }, [storageKey])

  const isFavorite = useCallback(
    (id: number) => items.some((item) => item.id === id),
    [items],
  )

  const toggle = useCallback(
    (item: T) => {
      const current = readFavStorage<T>(storageKey)
      const exists = current.some((i) => i.id === item.id)
      const next = exists
        ? current.filter((i) => i.id !== item.id)
        : [...current, item]
      writeFavStorage(storageKey, next)
      setItems(next)
    },
    [storageKey],
  )

  return { items, isFavorite, toggle }
}
