'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Search, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { useQuery } from '@tanstack/react-query'
import { useCatalogOptions } from '@/hooks/useCatalogSearch'
import { searchProperty } from '@/api/listings'
import s from './ResaleFilters.module.scss'

const PRICE_MIN = 0
const PRICE_MAX = 99_999_999

const STATUS_OPTIONS = [
  { id: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
  { id: 'COMPLETED',          label: 'Completed' },
]

const FURNISHING_OPTIONS = [
  { id: 'FURNISHED',        label: 'Furnished' },
  { id: 'UNFURNISHED',      label: 'Unfurnished' },
  { id: 'PARTLY_FURNISHED', label: 'Partly Furnished' },
]

function formatPrice(val: number) {
  return Math.round(val).toLocaleString('en-US').replace(/,/g, ' ')
}

// ── Editable price input (from HeroHome) ──────────────────────
function PriceInput({ value, onCommit, onApply, min, max, showCurrency }: {
  value: number
  onCommit: (n: number) => void
  onApply: (committed: number) => void
  min: number
  max: number
  showCurrency?: boolean
}) {
  const [draft, setDraft] = useState(formatPrice(value))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(formatPrice(value))
  }, [value])

  return (
    <div className={s.inlinePriceValWrap}>
      <input
        className={s.inlinePriceInput}
        value={draft}
        onFocus={() => { focused.current = true; setDraft(String(value)) }}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false
          const parsed = parseInt(draft.replace(/\D/g, ''), 10)
          if (!isNaN(parsed)) {
            const clamped = Math.min(Math.max(parsed, min), max)
            onCommit(clamped)
            setDraft(formatPrice(clamped))
            onApply(clamped)
          } else {
            setDraft(formatPrice(value))
          }
        }}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
      />
      {showCurrency && <span className={s.inlinePriceCurrency}>AED</span>}
    </div>
  )
}

// ── Inline price slider (desktop bar) ────────────────────────
function InlinePriceSlider({ value, onChange, onApply, min, max }: {
  value: [number, number]
  onChange: (v: [number, number]) => void
  onApply: (v: [number, number]) => void
  min: number
  max: number
}) {
  const priceActive = value[0] !== min || value[1] !== max
  return (
    <div className={`${s.inlinePriceBox} ${priceActive ? s.inlinePriceBoxActive : ''}`}>
      <div className={s.inlinePriceRow}>
        <PriceInput
          value={value[0]}
          onCommit={n => onChange([Math.min(n, value[1] - 50_000), value[1]])}
          onApply={n => onApply([Math.min(n, value[1] - 50_000), value[1]])}
          min={min}
          max={value[1] - 50_000}
        />
        <span className={s.inlinePriceSep} />
        <PriceInput
          value={value[1]}
          onCommit={n => onChange([value[0], Math.max(n, value[0] + 50_000)])}
          onApply={n => onApply([value[0], Math.max(n, value[0] + 50_000)])}
          min={value[0] + 50_000}
          max={max}
          showCurrency
        />
      </div>
      <Slider.Root
        className={s.inlineSliderRoot}
        min={min}
        max={max}
        step={50_000}
        value={value}
        onValueChange={v => onChange(v as [number, number])}
        onValueCommit={v => onApply(v as [number, number])}
      >
        <Slider.Track className={s.inlineSliderTrack}>
          <Slider.Range className={s.inlineSliderRange} />
        </Slider.Track>
        <Slider.Thumb className={s.inlineSliderThumb} aria-label="Min price" />
        <Slider.Thumb className={s.inlineSliderThumb} aria-label="Max price" />
      </Slider.Root>
    </div>
  )
}

// ── Desktop dropdown wrapper ──────────────────────────────────
function FilterDropdown({ label, count, isActive, onClose, children }: {
  label: string
  count?: number
  isActive: boolean
  onClose?: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    onClose?.()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, close])

  return (
    <div className={s.filterDropdownWrap} ref={ref}>
      <button
        className={`${s.filterItem} ${(isActive || open) ? s.filterItemSelected : ''}`}
        onClick={() => open ? close() : setOpen(true)}
      >
        {!!count && <span className={s.counterBadge}>{count}</span>}
        <span className={s.filterItemLabel}>{label}</span>
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          className={`${s.filterItemChevron} ${open ? s.chevronOpen : ''}`}
        />
      </button>
      {open && (
        <div className={s.filterDropdown}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Tag pill (modal) ──────────────────────────────────────────
function Tag({ label, active, disabled, onToggle }: {
  label: string
  active: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <button
      className={`${s.tag} ${active ? s.tagActive : ''} ${disabled ? s.tagDisabled : ''}`}
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
    >
      <span>{label}</span>
      {active && <X size={14} strokeWidth={1.5} />}
    </button>
  )
}

// ── Price slider (modal) ──────────────────────────────────────
function PriceRange({ value, onChange }: {
  value: [number, number]
  onChange: (v: [number, number]) => void
}) {
  return (
    <div className={s.priceBox}>
      <div className={s.priceRow}>
        <span className={s.priceVal}>{formatPrice(value[0])}</span>
        <span className={s.priceSep} />
        <span className={s.priceVal}>{formatPrice(value[1])}</span>
        <span className={s.priceCur}>AED</span>
      </div>
      <Slider.Root
        className={s.sliderRoot}
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={50_000}
        value={value}
        onValueChange={v => onChange(v as [number, number])}
      >
        <Slider.Track className={s.sliderTrack}>
          <Slider.Range className={s.sliderRange} />
        </Slider.Track>
        <Slider.Thumb className={s.sliderThumb} aria-label="Min price" />
        <Slider.Thumb className={s.sliderThumb} aria-label="Max price" />
      </Slider.Root>
    </div>
  )
}

// ── Active tags row ───────────────────────────────────────────
function ActiveTags({ selectedTypes, selectedBedrooms, selectedStatus, selectedFurnishing, search, typeOptions, bedroomOptions, onRemoveType, onRemoveBed, onRemoveStatus, onRemoveFurnishing, onRemoveSearch, onClear }: {
  selectedTypes: number[]
  selectedBedrooms: string[]
  selectedStatus: string | null
  selectedFurnishing: string | null
  search: { id: number; label: string; type: 'name' | 'area' }[]
  typeOptions: { id: number; label: string }[]
  bedroomOptions: { id: string; label: string }[]
  onRemoveType: (id: number) => void
  onRemoveBed: (id: string) => void
  onRemoveStatus: () => void
  onRemoveFurnishing: () => void
  onRemoveSearch: (item: { id: number; label: string; type: 'name' | 'area' }) => void
  onClear: () => void
}) {
  const hasAny = selectedTypes.length > 0 || selectedBedrooms.length > 0 || selectedStatus || selectedFurnishing || search.length > 0
  if (!hasAny) return null

  return (
    <div className={s.activeTags}>
      {search.map(item => (
        <button key={`${item.type}-${item.id}`} className={s.activeTag} onClick={() => onRemoveSearch(item)}>
          {item.label} <X size={12} strokeWidth={2} />
        </button>
      ))}
      {selectedTypes.map(id => {
        const label = typeOptions.find(o => o.id === id)?.label ?? String(id)
        return (
          <button key={id} className={s.activeTag} onClick={() => onRemoveType(id)}>
            {label} <X size={12} strokeWidth={2} />
          </button>
        )
      })}
      {selectedBedrooms.map(id => {
        const label = bedroomOptions.find(o => o.id === id)?.label ?? id
        return (
          <button key={id} className={s.activeTag} onClick={() => onRemoveBed(id)}>
            {label} <X size={12} strokeWidth={2} />
          </button>
        )
      })}
      {selectedStatus && (
        <button className={s.activeTag} onClick={onRemoveStatus}>
          {STATUS_OPTIONS.find(o => o.id === selectedStatus)?.label} <X size={12} strokeWidth={2} />
        </button>
      )}
      {selectedFurnishing && (
        <button className={s.activeTag} onClick={onRemoveFurnishing}>
          {FURNISHING_OPTIONS.find(o => o.id === selectedFurnishing)?.label} <X size={12} strokeWidth={2} />
        </button>
      )}
      <button className={s.clearAll} onClick={onClear}>Clear all</button>
    </div>
  )
}

// ── Highlight matched text ────────────────────────────────────
function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className={s.suggestionHighlight}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ── Main component ────────────────────────────────────────────
export default function ResaleFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // init from URL
  const [selectedTypes,    setSelectedTypes]    = useState<number[]>(() =>
    (searchParams.get('propertyTypes') ?? '').split(',').map(Number).filter(Boolean)
  )
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>(() =>
    (searchParams.get('beds') ?? '').split(',').filter(Boolean)
  )
  const [selectedStatus,   setSelectedStatus]   = useState<string | null>(() =>
    searchParams.get('status')
  )
  const [selectedFurnishing, setSelectedFurnishing] = useState<string | null>(() =>
    searchParams.get('furnishing')
  )
  const [price, setPrice] = useState<[number, number]>(() => {
    const p = searchParams.get('price')
    if (p) {
      const [min, max] = p.split('-').map(Number)
      if (min && max) return [min, max]
    }
    return [PRICE_MIN, PRICE_MAX]
  })
  const [selectedSearch, setSelectedSearch] = useState<{ id: number; label: string; type: 'name' | 'area' }[]>(() =>
    (searchParams.get('search') ?? '').split(',').filter(Boolean).map((label, i) => ({
      id: i,
      label,
      type: 'name' as const,
    }))
  )
  const [searchDraft, setSearchDraft] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const searchWrapRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // debounce search query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchDraft), 300)
    return () => clearTimeout(t)
  }, [searchDraft])

  // fetch suggestions
  const { data: suggestionsData, isFetching: suggestionsFetching } = useQuery({
    queryKey: ['resale-search-suggestions', debouncedQuery],
    queryFn: () => searchProperty(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 30_000,
  })

  const suggestionNames = suggestionsData?.data?.name ?? []
  const suggestionAreas = suggestionsData?.data?.area ?? []
  const hasResults = suggestionNames.length > 0 || suggestionAreas.length > 0
  const showDropdown = searchOpen && debouncedQuery.length > 0 && !suggestionsFetching

  // click-outside to close suggestion dropdown
  useEffect(() => {
    if (!searchOpen) return
    function handle(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [searchOpen])

  const { data: options } = useCatalogOptions('secondary')
  const typeOptions     = options?.propertyTypeOptions ?? []
  const bedroomOptions  = options?.bedroomOptions      ?? []

  const activeCount = selectedTypes.length + selectedBedrooms.length +
    (selectedStatus ? 1 : 0) + (selectedFurnishing ? 1 : 0)

  useEffect(() => {
    document.body.style.overflow = (isModalOpen || mobileSearchOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isModalOpen, mobileSearchOpen])

  // auto-focus mobile search input when overlay opens
  useEffect(() => {
    if (mobileSearchOpen) {
      const t = setTimeout(() => mobileInputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [mobileSearchOpen])

  // ── navigate with explicit values (avoids stale closure) ─────
  const push = useCallback((override: {
    types?: number[]
    beds?: string[]
    price?: [number, number]
    status?: string | null
    furnishing?: string | null
    searchItems?: { id: number; label: string; type: 'name' | 'area' }[]
  }) => {
    const types      = override.types       ?? selectedTypes
    const beds       = override.beds        ?? selectedBedrooms
    const priceVal   = override.price       ?? price
    const status     = 'status'      in override ? override.status      : selectedStatus
    const furnishing = 'furnishing'  in override ? override.furnishing  : selectedFurnishing
    const searchItems = override.searchItems ?? selectedSearch
    const p = new URLSearchParams()
    const view = searchParams.get('view'); if (view) p.set('view', view)
    const sort = searchParams.get('sort'); if (sort) p.set('sort', sort)
    if (types.length > 0)       p.set('propertyTypes', types.join(','))
    if (beds.length > 0)        p.set('beds', beds.join(','))
    if (priceVal[0] !== PRICE_MIN || priceVal[1] !== PRICE_MAX) p.set('price', `${priceVal[0]}-${priceVal[1]}`)
    if (status)                 p.set('status', status)
    if (furnishing)             p.set('furnishing', furnishing)
    if (searchItems.length > 0) p.set('search', searchItems.map(i => i.label).join(','))
    const url = p.toString() ? `/resale?${p.toString()}` : '/resale'
    router.push(url)
  }, [selectedTypes, selectedBedrooms, price, selectedStatus, selectedFurnishing, selectedSearch, router])

  // ── modal helpers ─────────────────────────────────────────────
  const buildParams = useCallback(() => {
    const p = new URLSearchParams()
    const view = searchParams.get('view'); if (view) p.set('view', view)
    const sort = searchParams.get('sort'); if (sort) p.set('sort', sort)
    if (selectedTypes.length > 0)    p.set('propertyTypes', selectedTypes.join(','))
    if (selectedBedrooms.length > 0) p.set('beds', selectedBedrooms.join(','))
    if (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX) p.set('price', `${price[0]}-${price[1]}`)
    if (selectedStatus)              p.set('status', selectedStatus)
    if (selectedFurnishing)          p.set('furnishing', selectedFurnishing)
    if (selectedSearch.length > 0) p.set('search', selectedSearch.map(i => i.label).join(','))
    return p
  }, [selectedTypes, selectedBedrooms, price, selectedStatus, selectedFurnishing, selectedSearch, searchParams])

  const applyFilters = useCallback(() => {
    const qs = buildParams().toString()
    router.push(qs ? `/resale?${qs}` : '/resale')
    setIsModalOpen(false)
  }, [buildParams, router])

  const clearFilters = useCallback(() => {
    setSelectedTypes([])
    setSelectedBedrooms([])
    setSelectedStatus(null)
    setSelectedFurnishing(null)
    setPrice([PRICE_MIN, PRICE_MAX])
    setSelectedSearch([])
    setSearchDraft('')
  }, [])

  const clearAndApply = useCallback(() => {
    clearFilters()
    const view = searchParams.get('view')
    const sort = searchParams.get('sort')
    const p = new URLSearchParams()
    if (view) p.set('view', view)
    if (sort) p.set('sort', sort)
    router.push(p.toString() ? `/resale?${p.toString()}` : '/resale')
    setIsModalOpen(false)
  }, [clearFilters, router, searchParams])

  return (
    <>
      {/* ── Desktop filter bar (dropdowns) ── */}
      <div className={s.desktopBar}>

        {/* Search with autocomplete */}
        <div
          className={`${s.searchFilterWrap} ${selectedSearch.length > 0 ? s.filterItemSelected : ''}`}
          ref={searchWrapRef}
        >
          <input
            className={s.searchFilterInput}
            value={searchDraft}
            placeholder="Search"
            onChange={e => {
              setSearchDraft(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setSearchOpen(false)
                ;(e.target as HTMLInputElement).blur()
              }
            }}
          />
          <Search size={20} strokeWidth={1.5} className={s.searchFilterIcon} />

          {/* Suggestions dropdown */}
          {showDropdown && (
            <div className={s.suggestionsDropdown}>
              {!hasResults ? (
                <div className={s.suggestionsEmpty}>
                  <p className={s.suggestionsEmptyTitle}>Nothing found</p>
                  <p className={s.suggestionsEmptyText}>
                    But maybe it&apos;s just a technical error.<br />
                    Our consultant will definitely help you.
                  </p>
                </div>
              ) : (
                <div className={s.suggestionsList}>
                  {suggestionNames.length > 0 && (
                    <div className={s.suggestionsSection}>
                      <div className={s.suggestionsSectionHeader}>Projects</div>
                      {suggestionNames.map(item => {
                        const isSelected = selectedSearch.some(s => s.type === 'name' && s.id === item.id)
                        return (
                          <button
                            key={item.id}
                            className={`${s.suggestionItem} ${isSelected ? s.suggestionItemSelected : ''}`}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => {
                              const next = isSelected
                                ? selectedSearch.filter(s => !(s.type === 'name' && s.id === item.id))
                                : [...selectedSearch, { id: item.id, label: item.label, type: 'name' as const }]
                              setSelectedSearch(next)
                              push({ searchItems: next })
                            }}
                          >
                            <span className={s.suggestionDot} />
                            <span className={s.suggestionText}>
                              {highlightMatch(item.label, debouncedQuery)}
                            </span>
                            {isSelected && <X size={14} strokeWidth={1.5} className={s.suggestionCheck} />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {suggestionAreas.length > 0 && (
                    <div className={s.suggestionsSection}>
                      <div className={s.suggestionsSectionHeader}>Area</div>
                      {suggestionAreas.map(item => {
                        const isSelected = selectedSearch.some(s => s.type === 'area' && s.label === item.label)
                        return (
                          <button
                            key={item.id}
                            className={`${s.suggestionItem} ${isSelected ? s.suggestionItemSelected : ''}`}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => {
                              const next = isSelected
                                ? selectedSearch.filter(s => !(s.type === 'area' && s.label === item.label))
                                : [...selectedSearch, { id: item.id, label: item.label, type: 'area' as const }]
                              setSelectedSearch(next)
                              push({ searchItems: next })
                            }}
                          >
                            <MapPin size={16} strokeWidth={1.5} className={s.suggestionPinIcon} />
                            <span className={s.suggestionText}>
                              {highlightMatch(item.label, debouncedQuery)}
                            </span>
                            {isSelected && <X size={14} strokeWidth={1.5} className={s.suggestionCheck} />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Property Type */}
        <FilterDropdown
          label="Property Type"
          count={selectedTypes.length}
          isActive={selectedTypes.length > 0}
        >
          {typeOptions.map(opt => (
            <button
              key={opt.id}
              className={`${s.dropdownOption} ${selectedTypes.includes(opt.id) ? s.dropdownOptionActive : ''}`}
              onClick={() => {
                const next = selectedTypes.includes(opt.id)
                  ? selectedTypes.filter(t => t !== opt.id)
                  : [...selectedTypes, opt.id]
                setSelectedTypes(next)
                push({ types: next })
              }}
            >
              <span>{opt.label}</span>
              {selectedTypes.includes(opt.id) && <X size={14} strokeWidth={1.5} />}
            </button>
          ))}
        </FilterDropdown>

        {/* Bedroom */}
        <FilterDropdown
          label="Bedroom"
          count={selectedBedrooms.length}
          isActive={selectedBedrooms.length > 0}
        >
          {bedroomOptions.map(opt => (
            <button
              key={opt.id}
              className={`${s.dropdownOption} ${selectedBedrooms.includes(opt.id) ? s.dropdownOptionActive : ''}`}
              onClick={() => {
                const next = selectedBedrooms.includes(opt.id)
                  ? selectedBedrooms.filter(b => b !== opt.id)
                  : [...selectedBedrooms, opt.id]
                setSelectedBedrooms(next)
                push({ beds: next })
              }}
            >
              <span>{opt.label}</span>
              {selectedBedrooms.includes(opt.id) && <X size={14} strokeWidth={1.5} />}
            </button>
          ))}
        </FilterDropdown>

        {/* Price range — inline (no dropdown) */}
        <InlinePriceSlider
          value={price}
          onChange={setPrice}
          onApply={v => push({ price: v })}
          min={PRICE_MIN}
          max={PRICE_MAX}
        />

        {/* Status */}
        <FilterDropdown
          label="Status"
          count={selectedStatus ? 1 : 0}
          isActive={!!selectedStatus}
        >
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className={`${s.dropdownOption} ${selectedStatus === opt.id ? s.dropdownOptionActive : ''}`}
              onClick={() => {
                const next = selectedStatus === opt.id ? null : opt.id
                setSelectedStatus(next)
                push({ status: next })
              }}
            >
              <span>{opt.label}</span>
              {selectedStatus === opt.id && <X size={14} strokeWidth={1.5} />}
            </button>
          ))}
        </FilterDropdown>

        {/* Furnishing */}
        <FilterDropdown
          label="Furnishing"
          count={selectedFurnishing ? 1 : 0}
          isActive={!!selectedFurnishing}
        >
          {FURNISHING_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className={`${s.dropdownOption} ${selectedFurnishing === opt.id ? s.dropdownOptionActive : ''}`}
              onClick={() => {
                const next = selectedFurnishing === opt.id ? null : opt.id
                setSelectedFurnishing(next)
                push({ furnishing: next })
              }}
            >
              <span>{opt.label}</span>
              {selectedFurnishing === opt.id && <X size={14} strokeWidth={1.5} />}
            </button>
          ))}
        </FilterDropdown>
      </div>

      {/* ── Tablet/Mobile bar ── */}
      <div className={s.mobileBar}>
        <div className={s.searchWrap}>
          <Search size={16} strokeWidth={1.5} className={s.searchIcon} />
          <input
            className={s.searchInput}
            placeholder="Search"
            readOnly
            onClick={() => setMobileSearchOpen(true)}
          />
        </div>
        <button className={s.filtersBtn} onClick={() => setIsModalOpen(true)}>
          {activeCount > 0 && <span className={s.filtersBadge}>{activeCount}</span>}
          Filters
          <SlidersHorizontal size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Active tags ── */}
      <ActiveTags
        selectedTypes={selectedTypes}
        selectedBedrooms={selectedBedrooms}
        selectedStatus={selectedStatus}
        selectedFurnishing={selectedFurnishing}
        search={selectedSearch}
        typeOptions={typeOptions}
        bedroomOptions={bedroomOptions}
        onRemoveType={id => { const next = selectedTypes.filter(t => t !== id); setSelectedTypes(next); push({ types: next }) }}
        onRemoveBed={id => { const next = selectedBedrooms.filter(b => b !== id); setSelectedBedrooms(next); push({ beds: next }) }}
        onRemoveStatus={() => { setSelectedStatus(null); push({ status: null }) }}
        onRemoveFurnishing={() => { setSelectedFurnishing(null); push({ furnishing: null }) }}
        onRemoveSearch={item => { const next = selectedSearch.filter(s => !(s.type === item.type && s.id === item.id)); setSelectedSearch(next); push({ searchItems: next }) }}
        onClear={clearAndApply}
      />

      {/* ── Mobile full-screen search overlay ── */}
      {mobileSearchOpen && (
        <div className={s.mobileSearchOverlay}>
          {/* Search bar */}
          <div className={s.mobileSearchBar}>
            <button
              className={s.mobileSearchBackBtn}
              onClick={() => {
                setMobileSearchOpen(false)
                setSearchDraft('')
                setDebouncedQuery('')
              }}
              aria-label="Back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 19L8 12L15 5" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={s.mobileSearchInputWrap}>
              <input
                ref={mobileInputRef}
                className={s.mobileSearchInputField}
                value={searchDraft}
                placeholder="Search"
                onChange={e => {
                  setSearchDraft(e.target.value)
                }}
              />
              <Search size={20} strokeWidth={1.5} className={s.mobileSearchFieldIcon} />
            </div>
          </div>

          {/* Content */}
          <div className={s.mobileSearchContent}>
            {/* Applied filter tags */}
            {selectedSearch.length > 0 && (
              <div className={s.mobileSearchTags}>
                {selectedSearch.map(item => (
                  <button
                    key={`${item.type}-${item.id}`}
                    className={s.mobileSearchTag}
                    onClick={() => {
                      const next = selectedSearch.filter(s => !(s.type === item.type && s.id === item.id))
                      setSelectedSearch(next)
                      push({ searchItems: next })
                    }}
                  >
                    {item.label} <X size={14} strokeWidth={1.5} />
                  </button>
                ))}
                <button
                  className={s.mobileSearchTagClear}
                  onClick={() => {
                    setSelectedSearch([])
                    push({ searchItems: [] })
                  }}
                >
                  Clear all <X size={14} strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* Results */}
            {debouncedQuery.length > 0 && !suggestionsFetching && (
              <div className={s.mobileSearchResults}>
                {!hasResults ? (
                  <div className={s.suggestionsEmpty}>
                    <p className={s.suggestionsEmptyTitle}>Nothing found</p>
                    <p className={s.suggestionsEmptyText}>
                      But maybe it&apos;s just a technical error.<br />
                      Our consultant will definitely help you.
                    </p>
                  </div>
                ) : (
                  <>
                    {suggestionNames.length > 0 && (
                      <div className={s.mobileResultsSection}>
                        <div className={s.mobileResultsSectionHeader}>Projects</div>
                        {suggestionNames.map(item => {
                          const isSelected = selectedSearch.some(s => s.type === 'name' && s.id === item.id)
                          return (
                            <button
                              key={item.id}
                              className={`${s.mobileResultItem} ${isSelected ? s.mobileResultItemSelected : ''}`}
                              onClick={() => {
                                const next = isSelected
                                  ? selectedSearch.filter(s => !(s.type === 'name' && s.id === item.id))
                                  : [...selectedSearch, { id: item.id, label: item.label, type: 'name' as const }]
                                setSelectedSearch(next)
                                push({ searchItems: next })
                              }}
                            >
                              <span className={s.suggestionDot} />
                              <span className={s.suggestionText}>{highlightMatch(item.label, debouncedQuery)}</span>
                              {isSelected && <X size={14} strokeWidth={1.5} className={s.suggestionCheck} />}
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {suggestionAreas.length > 0 && (
                      <div className={s.mobileResultsSection}>
                        <div className={s.mobileResultsSectionHeader}>Area</div>
                        {suggestionAreas.map(item => {
                          const isSelected = selectedSearch.some(s => s.type === 'area' && s.label === item.label)
                          return (
                            <button
                              key={item.id}
                              className={`${s.mobileResultItem} ${isSelected ? s.mobileResultItemSelected : ''}`}
                              onClick={() => {
                                const next = isSelected
                                  ? selectedSearch.filter(s => !(s.type === 'area' && s.label === item.label))
                                  : [...selectedSearch, { id: item.id, label: item.label, type: 'area' as const }]
                                setSelectedSearch(next)
                                push({ searchItems: next })
                              }}
                            >
                              <MapPin size={16} strokeWidth={1.5} className={s.suggestionPinIcon} />
                              <span className={s.suggestionText}>{highlightMatch(item.label, debouncedQuery)}</span>
                              {isSelected && <X size={14} strokeWidth={1.5} className={s.suggestionCheck} />}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Filter modal (mobile/tablet) ── */}
      {isModalOpen && (
        <div className={s.backdrop} onClick={() => setIsModalOpen(false)} aria-modal="true" role="dialog">
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalBody}>
              <button className={s.closeBtn} onClick={() => setIsModalOpen(false)} aria-label="Close">
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className={s.modalHeader}>
                <h2 className={s.modalTitle}>Filters</h2>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Property Type</p>
                <div className={s.tagList}>
                  {typeOptions.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedTypes.includes(opt.id)}
                      onToggle={() => setSelectedTypes(p => p.includes(opt.id) ? p.filter(t => t !== opt.id) : [...p, opt.id])}
                    />
                  ))}
                </div>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Bedroom</p>
                <div className={s.tagList}>
                  {bedroomOptions.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedBedrooms.includes(opt.id)}
                      onToggle={() => setSelectedBedrooms(p => p.includes(opt.id) ? p.filter(b => b !== opt.id) : [...p, opt.id])}
                    />
                  ))}
                </div>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Price</p>
                <PriceRange value={price} onChange={setPrice} />
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Status</p>
                <div className={s.tagList}>
                  {STATUS_OPTIONS.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedStatus === opt.id}
                      onToggle={() => setSelectedStatus(p => p === opt.id ? null : opt.id)}
                    />
                  ))}
                </div>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Furnishing</p>
                <div className={s.tagList}>
                  {FURNISHING_OPTIONS.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedFurnishing === opt.id}
                      onToggle={() => setSelectedFurnishing(p => p === opt.id ? null : opt.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={s.modalFooter}>
              <button className={s.clearBtn} onClick={clearAndApply}>
                <X size={16} strokeWidth={1.5} />
                <span>Clear filters</span>
              </button>
              <button className={s.applyBtn} onClick={applyFilters}>
                See properties
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
