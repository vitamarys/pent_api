'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import s from './ResaleToolbar.module.scss'

const SORT_OPTIONS = [
  { id: 'newest',     label: 'Newest first' },
  { id: 'oldest',     label: 'Oldest first' },
  { id: 'price_asc',  label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
]

export default function ResaleToolbar({ view, sort }: { view: string; sort: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sortOpen) return
    const handle = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [sortOpen])

  function updateParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/resale?${p.toString()}`)
  }

  const currentSort = SORT_OPTIONS.find(o => o.id === sort)

  return (
    <div className={s.toolbar}>
      {/* View tabs */}
      <div className={s.tabs}>
        <button
          className={`${s.tab} ${view !== 'map' ? s.tabActive : ''}`}
          onClick={() => updateParam('view', null)}
        >
          Card
        </button>
        <button
          className={`${s.tab} ${view === 'map' ? s.tabActive : ''}`}
          onClick={() => updateParam('view', 'map')}
        >
          Map
        </button>
      </div>

      {/* Sort dropdown */}
      <div className={s.sortWrap} ref={sortRef}>
        <button
          className={`${s.sortBtn} ${sortOpen ? s.sortBtnOpen : ''} ${sort ? s.sortBtnActive : ''}`}
          onClick={() => setSortOpen(v => !v)}
        >
          <span className={s.sortLabel}>{currentSort?.label ?? 'Sort by'}</span>
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            className={`${s.sortChevron} ${sortOpen ? s.sortChevronOpen : ''}`}
          />
        </button>
        {sortOpen && (
          <div className={s.sortDropdown}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className={`${s.sortOption} ${sort === opt.id ? s.sortOptionActive : ''}`}
                onClick={() => {
                  updateParam('sort', opt.id)
                  setSortOpen(false)
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
