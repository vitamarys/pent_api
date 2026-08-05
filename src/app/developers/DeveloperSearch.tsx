'use client'

import Image from 'next/image'
import { useRef, useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import s from './DeveloperSearch.module.scss'

interface SuggestionItem {
  slug: string
  name: string
  logoUrl?: string
}

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 3 6.58172 11 3C15.4183 3 19 6.58172 19 11Z"
        stroke="rgba(31,31,31,0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <>
      {text.slice(0, idx)}
      <span className={s.highlight}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function DeveloperSearch({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [inputValue, setInputValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) { setSuggestions([]); setOpen(false); return }
    try {
      const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? ''
      const res = await fetch(`${base}/api/catalog/developers?search=${encodeURIComponent(q)}&pageSize=8`)
      const json = await res.json()
      const items: SuggestionItem[] = (json.data ?? []).map((d: {
        id: number
        name: string
        logo?: { url: string } | null
        logoFile?: { url: string } | null
        pageUrl?: { url: string } | null
      }) => ({
        slug: d.pageUrl?.url?.replace(/^\/developers\//, '').replace(/\/$/, '') ?? String(d.id),
        name: d.name,
        logoUrl: d.logo?.url ?? d.logoFile?.url,
      }))
      setSuggestions(items)
      setOpen(items.length > 0)
      setActiveIdx(-1)
    } catch {
      setSuggestions([])
      setOpen(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)

    // Debounce URL update
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set('search', value)
      else params.delete('search')
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false })
      })
    }, 350)

    // Debounce suggestions fetch
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current)
    fetchTimerRef.current = setTimeout(() => fetchSuggestions(value), 200)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      const item = suggestions[activeIdx]
      router.push(`/developers/${item.slug}`)
      setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function handleSelect(item: SuggestionItem) {
    setOpen(false)
    router.push(`/developers/${item.slug}`)
  }

  return (
    <div className={s.wrap} ref={wrapRef}>
      <span className={s.icon}><IconSearch /></span>
      <input
        type="search"
        className={s.input}
        placeholder="Search developers…"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
        autoComplete="off"
        aria-label="Search developers"
        aria-expanded={open}
        aria-haspopup="listbox"
      />

      {open && suggestions.length > 0 && (
        <ul className={s.dropdown} role="listbox">
          {suggestions.map((item, i) => (
            <li
              key={item.slug}
              className={`${s.item} ${i === activeIdx ? s.itemActive : ''}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={() => handleSelect(item)}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <div className={s.logoCard}>
                {item.logoUrl
                  ? <Image src={item.logoUrl} alt={item.name} width={30} height={30} className={s.logoImg} style={{ height: 'auto' }} />
                  : <span className={s.logoPlaceholder} />
                }
              </div>
              <span className={s.itemName}>
                <HighlightMatch text={item.name} query={inputValue} />
              </span>
            </li>
          ))}
          <div className={s.scrollBar}><div className={s.scrollThumb} /></div>
        </ul>
      )}
    </div>
  )
}
