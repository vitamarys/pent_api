'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, SlidersHorizontal, ChevronDown, Search } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { useSettingsStore } from '@/store/settings'
import s from './ProjectFilters.module.scss'

const PRICE_MIN = 0
const PRICE_MAX = 99_999_999

const CURRENCY_RATES: Record<string, number> = {
  USD: 0.2723,
  EUR: 0.2506,
}

function formatPrice(val: number) {
  return Math.round(val).toLocaleString('en-US').replace(/,/g, ' ')
}

export interface FilterOption {
  id: number | string
  label: string
  disabled?: boolean
}

interface ProjectFiltersProps {
  areaOptions: FilterOption[]
  typeOptions: FilterOption[]
  bedroomOptions: FilterOption[]
  developerOptions: FilterOption[]
  handoverOptions: FilterOption[]
  categoryOptions: FilterOption[]
}

// ── Editable price input ──────────────────────────────────────
function PriceInput({ value, onCommit, onApply, min, max, showCurrency }: {
  value: number
  onCommit: (n: number) => void
  onApply: (committed: number) => void
  min: number
  max: number
  showCurrency?: boolean
}) {
  const { currency } = useSettingsStore()
  const rate = currency === 'AED' ? 1 : (CURRENCY_RATES[currency] ?? 1)

  const toDisplay = (aed: number) => Math.round(aed * rate)
  const toAED = (displayed: number) => Math.round(displayed / rate)

  const [draft, setDraft] = useState(formatPrice(toDisplay(value)))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(formatPrice(toDisplay(value)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, rate])

  return (
    <div className={s.inlinePriceValWrap}>
      <input
        className={s.inlinePriceInput}
        value={draft}
        onFocus={() => { focused.current = true; setDraft(String(toDisplay(value))) }}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false
          const parsed = parseInt(draft.replace(/\D/g, ''), 10)
          if (!isNaN(parsed)) {
            const aedValue = toAED(parsed)
            const clamped = Math.min(Math.max(aedValue, min), max)
            onCommit(clamped)
            setDraft(formatPrice(toDisplay(clamped)))
            onApply(clamped)
          } else {
            setDraft(formatPrice(toDisplay(value)))
          }
        }}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
      />
      {showCurrency && <span className={s.inlinePriceCurrency}>{currency}</span>}
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
function FilterDropdown({ label, count, isActive, searchable, children }: {
  label: string
  count?: number
  isActive: boolean
  searchable?: { value: string; onChange: (q: string) => void; placeholder?: string }
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    if (searchable) searchable.onChange('')
  }, [searchable])

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, close])

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 0)
    }
  }, [open, searchable])

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
        <div className={`${s.filterDropdown} ${searchable ? s.filterDropdownSearchable : ''}`}>
          {searchable && (
            <div className={s.dropdownSearchWrap}>
              <div className={s.dropdownSearch}>
                <input
                  ref={searchRef}
                  className={s.dropdownSearchInput}
                  value={searchable.value}
                  onChange={e => searchable.onChange(e.target.value)}
                  placeholder={searchable.placeholder ?? 'Search…'}
                  onKeyDown={e => e.key === 'Escape' && close()}
                />
                {searchable.value ? (
                  <button className={s.dropdownSearchClear} onClick={() => searchable.onChange('')}>
                    <X size={16} strokeWidth={1.5} />
                  </button>
                ) : (
                  <Search size={20} strokeWidth={1.5} className={s.dropdownSearchIcon} />
                )}
              </div>
            </div>
          )}
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
      className={`${s.tag} ${active ? s.tagActive : ''} ${disabled && !active ? s.tagDisabled : ''}`}
      onClick={disabled && !active ? undefined : onToggle}
      disabled={disabled && !active}
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
  const { currency } = useSettingsStore()
  const rate = currency === 'AED' ? 1 : (CURRENCY_RATES[currency] ?? 1)
  const toDisplay = (aed: number) => Math.round(aed * rate)

  return (
    <div className={s.priceBox}>
      <div className={s.priceRow}>
        <span className={s.priceVal}>{formatPrice(toDisplay(value[0]))}</span>
        <span className={s.priceSep} />
        <span className={s.priceVal}>{formatPrice(toDisplay(value[1]))}</span>
        <span className={s.priceCur}>{currency}</span>
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

// ── Main component ────────────────────────────────────────────
export default function ProjectFilters({
  areaOptions,
  typeOptions,
  bedroomOptions,
  developerOptions,
  handoverOptions,
  categoryOptions,
}: ProjectFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedLocation, setSelectedLocation] = useState<number[]>(() =>
    (searchParams.get('location') ?? '').split(',').map(Number).filter(Boolean)
  )
  const [selectedTypes, setSelectedTypes] = useState<number[]>(() =>
    (searchParams.get('propertyTypes') ?? '').split(',').map(Number).filter(Boolean)
  )
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>(() =>
    (searchParams.get('beds') ?? '').split(',').filter(Boolean)
  )
  const [price, setPrice] = useState<[number, number]>(() => {
    const p = searchParams.get('price')
    if (p) {
      const [min, max] = p.split('-').map(Number)
      if (min && max) return [min, max]
    }
    return [PRICE_MIN, PRICE_MAX]
  })
  const [selectedHandover, setSelectedHandover] = useState<string[]>(() =>
    (searchParams.get('handover') ?? '').split(',').filter(Boolean)
  )
  const [selectedDeveloper, setSelectedDeveloper] = useState<number | null>(() => {
    const v = (searchParams.get('developers') ?? '').split(',').map(Number).filter(Boolean)
    return v[0] ?? null
  })
  const [selectedDetails, setSelectedDetails] = useState<string[]>(() =>
    (searchParams.get('details') ?? '').split(',').filter(Boolean)
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [locationSearch, setLocationSearch] = useState('')

  const filteredAreaOptions = useMemo(() =>
    locationSearch.trim()
      ? areaOptions.filter(o => o.label.toLowerCase().includes(locationSearch.toLowerCase()))
      : areaOptions,
    [areaOptions, locationSearch]
  )

  const activeCount =
    selectedLocation.length +
    selectedTypes.length +
    selectedBedrooms.length +
    selectedHandover.length +
    (selectedDeveloper ? 1 : 0) +
    selectedDetails.length

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isModalOpen])

  // ── push URL — preserves ALL existing params (view, sort…), only mutates filters ──
  function buildUrl(override: {
    location?: number[]
    types?: number[]
    beds?: string[]
    price?: [number, number]
    handover?: string[]
    developer?: number | null
    details?: string[]
  }): string {
    const location  = override.location  ?? selectedLocation
    const types     = override.types     ?? selectedTypes
    const beds      = override.beds      ?? selectedBedrooms
    const priceVal  = override.price     ?? price
    const handover  = override.handover  ?? selectedHandover
    const developer = 'developer' in override ? override.developer : selectedDeveloper
    const details   = override.details   ?? selectedDetails

    const p = new URLSearchParams(window.location.search)
    p.delete('page')

    if (location.length > 0)  p.set('location', location.join(','))
    else                       p.delete('location')
    if (types.length > 0)     p.set('propertyTypes', types.join(','))
    else                       p.delete('propertyTypes')
    if (beds.length > 0)      p.set('beds', beds.join(','))
    else                       p.delete('beds')
    if (priceVal[0] !== PRICE_MIN || priceVal[1] !== PRICE_MAX) p.set('price', `${priceVal[0]}-${priceVal[1]}`)
    else                       p.delete('price')
    if (handover.length > 0)  p.set('handover', handover.join(','))
    else                       p.delete('handover')
    if (developer)             p.set('developers', String(developer))
    else                       p.delete('developers')
    if (details.length > 0)   p.set('details', details.join(','))
    else                       p.delete('details')

    return p.toString() ? `/projects?${p.toString()}` : '/projects'
  }

  function push(override: Parameters<typeof buildUrl>[0]) {
    router.push(buildUrl(override))
  }

  // ── modal apply / clear ───────────────────────────────────────
  function applyFilters() {
    router.push(buildUrl({}))
    setIsModalOpen(false)
  }

  const clearFilters = useCallback(() => {
    setSelectedLocation([])
    setSelectedTypes([])
    setSelectedBedrooms([])
    setSelectedHandover([])
    setSelectedDeveloper(null)
    setSelectedDetails([])
    setPrice([PRICE_MIN, PRICE_MAX])
  }, [])

  function clearAndApply() {
    clearFilters()
    const p = new URLSearchParams(window.location.search)
    p.delete('page')
    p.delete('location')
    p.delete('propertyTypes')
    p.delete('beds')
    p.delete('price')
    p.delete('handover')
    p.delete('developers')
    p.delete('details')
    router.push(p.toString() ? `/projects?${p.toString()}` : '/projects')
    setIsModalOpen(false)
  }

  const hasActiveTags =
    selectedLocation.length > 0 ||
    selectedTypes.length > 0 ||
    selectedBedrooms.length > 0 ||
    selectedHandover.length > 0 ||
    selectedDeveloper !== null ||
    selectedDetails.length > 0

  return (
    <>
      {/* ── Desktop filter bar ── */}
      <div className={s.desktopBar}>

        {/* Location */}
        <FilterDropdown
          label="Location"
          count={selectedLocation.length}
          isActive={selectedLocation.length > 0}
          searchable={{ value: locationSearch, onChange: setLocationSearch, placeholder: 'Search location…' }}
        >
          {selectedLocation.length > 0 && (
            <div className={s.dropdownSelectedTags}>
              {selectedLocation.map(id => {
                const label = areaOptions.find(o => Number(o.id) === id)?.label ?? String(id)
                return (
                  <button key={id} className={s.dropdownSelectedTag} onClick={() => {
                    const next = selectedLocation.filter(t => t !== id)
                    setSelectedLocation(next)
                    push({ location: next })
                  }}>
                    {label} <X size={12} strokeWidth={2} />
                  </button>
                )
              })}
              <button className={s.dropdownSelectedTagClear} onClick={() => {
                setSelectedLocation([])
                push({ location: [] })
              }}>
                Clear all <X size={12} strokeWidth={2} />
              </button>
            </div>
          )}
          {filteredAreaOptions.length === 0 ? (
            <div className={s.dropdownEmpty}>
              <span className={s.dropdownEmptyTitle}>Nothing found</span>
              <span className={s.dropdownEmptySubtitle}>Try a different search term</span>
            </div>
          ) : (
            filteredAreaOptions.map(opt => {
              const isActive = selectedLocation.includes(opt.id as number)
              const isDisabled = !!opt.disabled && !isActive
              return (
                <button
                  key={opt.id}
                  className={`${s.dropdownOption} ${isActive ? s.dropdownOptionActive : ''} ${isDisabled ? s.dropdownOptionDisabled : ''}`}
                  disabled={isDisabled}
                  onClick={() => {
                    const next = isActive
                      ? selectedLocation.filter(t => t !== opt.id)
                      : [...selectedLocation, opt.id as number]
                    setSelectedLocation(next)
                    push({ location: next })
                  }}
                >
                  <span>{opt.label}</span>
                  {isActive && <X size={14} strokeWidth={1.5} />}
                </button>
              )
            })
          )}
        </FilterDropdown>

        {/* Property Type */}
        <FilterDropdown
          label="Property Type"
          count={selectedTypes.length}
          isActive={selectedTypes.length > 0}
        >
          {typeOptions.map(opt => {
            const isActive = selectedTypes.includes(opt.id as number)
            const isDisabled = !!opt.disabled && !isActive
            return (
              <button
                key={opt.id}
                className={`${s.dropdownOption} ${isActive ? s.dropdownOptionActive : ''} ${isDisabled ? s.dropdownOptionDisabled : ''}`}
                disabled={isDisabled}
                onClick={() => {
                  const next = isActive
                    ? selectedTypes.filter(t => t !== opt.id)
                    : [...selectedTypes, opt.id as number]
                  setSelectedTypes(next)
                  push({ types: next })
                }}
              >
                <span>{opt.label}</span>
                {isActive && <X size={14} strokeWidth={1.5} />}
              </button>
            )
          })}
        </FilterDropdown>

        {/* Bedroom */}
        <FilterDropdown
          label="Bedroom"
          count={selectedBedrooms.length}
          isActive={selectedBedrooms.length > 0}
        >
          {bedroomOptions.map(opt => {
            const isActive = selectedBedrooms.includes(opt.id as string)
            const isDisabled = !!opt.disabled && !isActive
            return (
              <button
                key={opt.id}
                className={`${s.dropdownOption} ${isActive ? s.dropdownOptionActive : ''} ${isDisabled ? s.dropdownOptionDisabled : ''}`}
                disabled={isDisabled}
                onClick={() => {
                  const next = isActive
                    ? selectedBedrooms.filter(b => b !== opt.id)
                    : [...selectedBedrooms, opt.id as string]
                  setSelectedBedrooms(next)
                  push({ beds: next })
                }}
              >
                <span>{opt.label}</span>
                {isActive && <X size={14} strokeWidth={1.5} />}
              </button>
            )
          })}
        </FilterDropdown>

        {/* Price range */}
        <InlinePriceSlider
          value={price}
          onChange={setPrice}
          onApply={v => push({ price: v })}
          min={PRICE_MIN}
          max={PRICE_MAX}
        />

        {/* Handover */}
        <FilterDropdown
          label="Handover"
          count={selectedHandover.length}
          isActive={selectedHandover.length > 0}
        >
          {handoverOptions.map(opt => {
            const isActive = selectedHandover.includes(opt.id as string)
            const isDisabled = !!opt.disabled && !isActive
            return (
              <button
                key={opt.id}
                className={`${s.dropdownOption} ${isActive ? s.dropdownOptionActive : ''} ${isDisabled ? s.dropdownOptionDisabled : ''}`}
                disabled={isDisabled}
                onClick={() => {
                  const next = isActive
                    ? selectedHandover.filter(h => h !== opt.id)
                    : [...selectedHandover, opt.id as string]
                  setSelectedHandover(next)
                  push({ handover: next })
                }}
              >
                <span>{opt.label}</span>
                {isActive && <X size={14} strokeWidth={1.5} />}
              </button>
            )
          })}
        </FilterDropdown>

        {/* Developer */}
        <FilterDropdown
          label={developerOptions.find(o => o.id === selectedDeveloper)?.label ?? 'Developer'}
          count={selectedDeveloper ? 1 : 0}
          isActive={selectedDeveloper !== null}
        >
          {developerOptions.map(opt => {
            const isActive = selectedDeveloper === opt.id
            const isDisabled = !!opt.disabled && !isActive
            return (
              <button
                key={opt.id}
                className={`${s.dropdownOption} ${isActive ? s.dropdownOptionActive : ''} ${isDisabled ? s.dropdownOptionDisabled : ''}`}
                disabled={isDisabled}
                onClick={() => {
                  const next = isActive ? null : opt.id as number
                  setSelectedDeveloper(next)
                  push({ developer: next })
                }}
              >
                <span>{opt.label}</span>
                {isActive && <X size={14} strokeWidth={1.5} />}
              </button>
            )
          })}
        </FilterDropdown>

        {/* Additional details — тимчасово приховано */}
        {false && (
          <FilterDropdown
            label="Additional details"
            count={selectedDetails.length}
            isActive={selectedDetails.length > 0}
          >
            {categoryOptions.map(opt => (
              <button
                key={opt.id}
                className={`${s.dropdownOption} ${selectedDetails.includes(opt.id as string) ? s.dropdownOptionActive : ''}`}
                onClick={() => {
                  const next = selectedDetails.includes(opt.id as string)
                    ? selectedDetails.filter(d => d !== opt.id)
                    : [...selectedDetails, opt.id as string]
                  setSelectedDetails(next)
                  push({ details: next })
                }}
              >
                <span>{opt.label}</span>
                {selectedDetails.includes(opt.id as string) && <X size={14} strokeWidth={1.5} />}
              </button>
            ))}
          </FilterDropdown>
        )}
      </div>

      {/* ── Tablet/Mobile bar ── */}
      <div className={s.mobileBar}>
        <button className={s.filtersBtn} onClick={() => setIsModalOpen(true)}>
          {activeCount > 0 && <span className={s.filtersBadge}>{activeCount}</span>}
          Filters
          <SlidersHorizontal size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Active tags ── */}
      {hasActiveTags && (
        <div className={s.activeTags}>
          {selectedLocation.map(id => {
            const label = areaOptions.find(o => Number(o.id) === id)?.label ?? String(id)
            return (
              <button key={id} className={s.activeTag} onClick={() => {
                const next = selectedLocation.filter(t => t !== id)
                setSelectedLocation(next)
                push({ location: next })
              }}>
                {label} <X size={12} strokeWidth={2} />
              </button>
            )
          })}
          {selectedTypes.map(id => {
            const label = typeOptions.find(o => Number(o.id) === id)?.label ?? String(id)
            return (
              <button key={id} className={s.activeTag} onClick={() => {
                const next = selectedTypes.filter(t => t !== id)
                setSelectedTypes(next)
                push({ types: next })
              }}>
                {label} <X size={12} strokeWidth={2} />
              </button>
            )
          })}
          {selectedBedrooms.map(id => {
            const label = bedroomOptions.find(o => o.id === id)?.label ?? id
            return (
              <button key={id} className={s.activeTag} onClick={() => {
                const next = selectedBedrooms.filter(b => b !== id)
                setSelectedBedrooms(next)
                push({ beds: next })
              }}>
                {label} <X size={12} strokeWidth={2} />
              </button>
            )
          })}
          {selectedHandover.map(id => (
            <button key={id} className={s.activeTag} onClick={() => {
              const next = selectedHandover.filter(h => h !== id)
              setSelectedHandover(next)
              push({ handover: next })
            }}>
              {id} <X size={12} strokeWidth={2} />
            </button>
          ))}
          {selectedDeveloper !== null && (
            <button className={s.activeTag} onClick={() => {
              setSelectedDeveloper(null)
              push({ developer: null })
            }}>
              {developerOptions.find(o => o.id === selectedDeveloper)?.label ?? 'Developer'} <X size={12} strokeWidth={2} />
            </button>
          )}
          {selectedDetails.map(id => {
            const label = categoryOptions.find(o => o.id === id)?.label ?? id
            return (
              <button key={id} className={s.activeTag} onClick={() => {
                const next = selectedDetails.filter(d => d !== id)
                setSelectedDetails(next)
                push({ details: next })
              }}>
                {label} <X size={12} strokeWidth={2} />
              </button>
            )
          })}
          <button className={s.clearAll} onClick={clearAndApply}>Clear all</button>
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

              {/* Location */}
              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Location</p>
                <div className={s.tagList}>
                  {areaOptions.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedLocation.includes(opt.id as number)}
                      disabled={opt.disabled}
                      onToggle={() => setSelectedLocation(p =>
                        p.includes(opt.id as number) ? p.filter(t => t !== opt.id) : [...p, opt.id as number]
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Property Type</p>
                <div className={s.tagList}>
                  {typeOptions.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedTypes.includes(opt.id as number)}
                      disabled={opt.disabled}
                      onToggle={() => setSelectedTypes(p =>
                        p.includes(opt.id as number) ? p.filter(t => t !== opt.id) : [...p, opt.id as number]
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Bedroom */}
              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Bedroom</p>
                <div className={s.tagList}>
                  {bedroomOptions.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedBedrooms.includes(opt.id as string)}
                      disabled={opt.disabled}
                      onToggle={() => setSelectedBedrooms(p =>
                        p.includes(opt.id as string) ? p.filter(b => b !== opt.id) : [...p, opt.id as string]
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Price</p>
                <PriceRange value={price} onChange={setPrice} />
              </div>

              {/* Handover */}
              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Handover</p>
                <div className={s.tagList}>
                  {handoverOptions.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedHandover.includes(opt.id as string)}
                      disabled={opt.disabled}
                      onToggle={() => setSelectedHandover(p =>
                        p.includes(opt.id as string) ? p.filter(h => h !== opt.id) : [...p, opt.id as string]
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Developer */}
              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Developer</p>
                <div className={s.tagList}>
                  {developerOptions.map(opt => (
                    <Tag
                      key={opt.id}
                      label={opt.label}
                      active={selectedDeveloper === opt.id}
                      disabled={opt.disabled}
                      onToggle={() => setSelectedDeveloper(p => p === opt.id ? null : opt.id as number)}
                    />
                  ))}
                </div>
              </div>

              {/* Additional details — тимчасово приховано */}
              {false && (
                <div className={s.filterGroup}>
                  <p className={s.filterLabel}>Additional details</p>
                  <div className={s.tagList}>
                    {categoryOptions.map(opt => (
                      <Tag
                        key={opt.id}
                        label={opt.label}
                        active={selectedDetails.includes(opt.id as string)}
                        onToggle={() => setSelectedDetails(p =>
                          p.includes(opt.id as string) ? p.filter(d => d !== opt.id) : [...p, opt.id as string]
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={s.modalFooter}>
              <button className={s.clearBtn} onClick={clearAndApply}>
                <X size={16} strokeWidth={1.5} />
                <span>Clear filters</span>
              </button>
              <button className={s.applyBtn} onClick={applyFilters}>
                See projects
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
