'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronDown } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import Container from '@/components/ui/Container';
import { useCatalogOptions, useCatalogCount, useAvailableBedrooms, type CatalogCountParams } from '@/hooks/useCatalogSearch';
import s from './HeroHome.module.scss';

interface HeroHomeProps {
  bgImage?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  priceMin?: number;
  priceMax?: number;
  priceInitial?: [number, number];
}

const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 99_999_999;


function formatPrice(val: number) {
  return val.toLocaleString('en-US').replace(/,/g, ' ');
}

// ── Dropdown component ────────────────────────────────────────
function DropdownFilter<T extends string | number>({
  label,
  options,
  selected,
  onToggle,
  disabledIds,
}: {
  label: string;
  options: { id: T; label: string }[];
  selected: T[];
  onToggle: (id: T) => void;
  disabledIds?: Set<T>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selectedLabels = options.filter(o => selected.includes(o.id)).map(o => o.label);
  const displayLabel = selectedLabels.length > 0 ? selectedLabels.join(', ') : label;

  return (
    <div className={s.dropdownWrap} ref={ref}>
      <button
        className={`${s.filterItem} ${open ? s.filterItemOpen : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className={selected.length > 0 ? s.filterItemActive : ''}>{displayLabel}</span>
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          className={`${s.chevron} ${open ? s.chevronOpen : ''}`}
        />
      </button>

      {open && (
        <div className={s.dropdown}>
          {options.map(opt => {
            const isDisabled = disabledIds != null && !disabledIds.has(opt.id)
            return (
              <button
                key={opt.id}
                className={`${s.dropdownOption} ${selected.includes(opt.id) ? s.dropdownOptionActive : ''} ${isDisabled ? s.dropdownOptionDisabled : ''}`}
                onClick={() => !isDisabled && onToggle(opt.id)}
                disabled={isDisabled}
              >
                <span>{opt.label}</span>
                {selected.includes(opt.id) && <X size={14} strokeWidth={1.5} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}

// ── Editable price input ──────────────────────────────────────
function PriceInput({
  value,
  onCommit,
  min,
  max,
  showCurrency,
}: {
  value: number;
  onCommit: (n: number) => void;
  min: number;
  max: number;
  showCurrency?: boolean;
}) {
  const [draft, setDraft] = useState(formatPrice(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(formatPrice(value));
  }, [value]);

  return (
    <div className={s.priceValWrap}>
      <input
        className={s.priceInput}
        value={draft}
        onFocus={() => {
          focused.current = true;
          setDraft(String(value));
        }}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => {
          focused.current = false;
          const parsed = parseInt(draft.replace(/\D/g, ''), 10);
          if (!isNaN(parsed)) {
            const clamped = Math.min(Math.max(parsed, min), max);
            onCommit(clamped);
            setDraft(formatPrice(clamped));
          } else {
            setDraft(formatPrice(value));
          }
        }}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
      />
      {showCurrency && <span className={s.priceCurrency}>AED</span>}
    </div>
  );
}

// ── Price slider component ────────────────────────────────────
function PriceSlider({
  value,
  onChange,
  min,
  max,
  variant = 'desktop',
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min: number;
  max: number;
  variant?: 'desktop' | 'mobile';
}) {
  return (
    <div className={`${s.priceBox} ${variant === 'mobile' ? s.priceBoxMobile : s.priceBoxDesktop}`}>
      <div className={s.priceRow}>
        <PriceInput
          value={value[0]}
          onCommit={n => onChange([Math.min(n, value[1] - 50_000), value[1]])}
          min={min}
          max={value[1] - 50_000}
        />
        <span className={s.priceSep} />
        <PriceInput
          value={value[1]}
          onCommit={n => onChange([value[0], Math.max(n, value[0] + 50_000)])}
          min={value[0] + 50_000}
          max={max}
          showCurrency
        />
      </div>
      <Slider.Root
        className={s.sliderRoot}
        min={min}
        max={max}
        step={50_000}
        value={value}
        onValueChange={v => onChange(v as [number, number])}
      >
        <Slider.Track className={s.sliderTrack}>
          <Slider.Range className={s.sliderRange} />
        </Slider.Track>
        <Slider.Thumb className={s.sliderThumb} aria-label="Minimum price" />
        <Slider.Thumb className={s.sliderThumb} aria-label="Maximum price" />
      </Slider.Root>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function HeroHome({
  bgImage,
  title = 'All luxury properties of Dubai in one place',
  subtitle = "Tailored access to Dubai's prime real estate, curated for your lifestyle by the most exclusive Agency with full cycle real estate services",
  ctaText = 'See Properties',
  priceMin = DEFAULT_PRICE_MIN,
  priceMax = DEFAULT_PRICE_MAX,
  priceInitial = [0, 99_000_000],
}: HeroHomeProps) {
  const router = useRouter()

  // ── filter state ──────────────────────────────────────────
  const [activeTab,        setActiveTab]        = useState<'off-plan' | 'secondary'>('off-plan');
  const [selectedTypes,    setSelectedTypes]    = useState<number[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [price,            setPrice]            = useState<[number, number]>(priceInitial);
  const [isModalOpen,      setIsModalOpen]      = useState(false);

  // reset type selection on tab change
  useEffect(() => { setSelectedTypes([]) }, [activeTab])

  // body scroll lock for modal
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // ── debounced params for count query ──────────────────────
  const [debouncedParams, setDebouncedParams] = useState<CatalogCountParams>({
    activeTab, selectedTypes, selectedBedrooms, price, priceMin, priceMax,
  })
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedParams({ activeTab, selectedTypes, selectedBedrooms, price, priceMin, priceMax })
    }, 400)
    return () => clearTimeout(t)
  }, [activeTab, selectedTypes, selectedBedrooms, price, priceMin, priceMax])

  // ── react-query ───────────────────────────────────────────
  const { data: options } = useCatalogOptions(activeTab)
  const { data: resultCount } = useCatalogCount(debouncedParams)
  const { data: availableBeds } = useAvailableBedrooms(activeTab, selectedTypes)

  const propertyTypeOptions = options?.propertyTypeOptions ?? []
  const bedroomOptions      = options?.bedroomOptions      ?? []

  // Знімаємо вибір bedroom якщо він став недоступним після зміни типу
  useEffect(() => {
    if (availableBeds == null) return
    const invalid = selectedBedrooms.filter(b => !availableBeds.has(b))
    if (invalid.length > 0) {
      setSelectedBedrooms(prev => prev.filter(b => availableBeds.has(b)))
    }
  }, [availableBeds])

  // ── handlers ──────────────────────────────────────────────
  const toggleType = useCallback((id: number) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }, []);

  const toggleBedroom = useCallback((bed: string) => {
    setSelectedBedrooms(prev => prev.includes(bed) ? prev.filter(b => b !== bed) : [...prev, bed]);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTypes([]);
    setSelectedBedrooms([]);
    setPrice(priceInitial);
  }, [priceInitial]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedTypes.length > 0)    params.set('propertyTypes', selectedTypes.join(','))
    if (selectedBedrooms.length > 0) params.set('beds', selectedBedrooms.join(','))
    if (price[0] !== priceMin || price[1] !== priceMax) params.set('price', `${price[0]}-${price[1]}`)
    const base = activeTab === 'off-plan' ? '/projects' : '/resale'
    const qs = params.toString()
    router.push(qs ? `${base}?${qs}` : base)
  }, [activeTab, selectedTypes, selectedBedrooms, price, priceMin, priceMax, router]);

  const ctaLabel = resultCount != null ? `See ${resultCount} properties` : ctaText

  return (
    <>
      <section
        className={s.hero}
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
      >
        <div className={s.overlay} />

        <Container className={s.containerFull}>
          <div className={s.content}>
            {/* Text block */}
            <div className={s.textBlock}>
              <h1 className={s.title}>{title}</h1>
              <p className={s.subtitle}>{subtitle}</p>
              <button className={s.searchBtn} onClick={() => setIsModalOpen(true)} aria-label="Search properties">
                <Search size={20} strokeWidth={1.5} />
                <span>Search Property</span>
              </button>
            </div>

            {/* Desktop search bar */}
            <div className={s.searchBar}>
              <div className={s.tabs}>
                <button className={`${s.tab} ${activeTab === 'off-plan' ? s.tabActive : ''}`} onClick={() => setActiveTab('off-plan')}>Off-plan</button>
                <button className={`${s.tab} ${activeTab === 'secondary' ? s.tabActive : ''}`} onClick={() => setActiveTab('secondary')}>Secondary</button>
              </div>

              <DropdownFilter label="Property Type" options={propertyTypeOptions} selected={selectedTypes} onToggle={toggleType} />
              <DropdownFilter label="Bedroom"        options={bedroomOptions}      selected={selectedBedrooms} onToggle={toggleBedroom} disabledIds={availableBeds ?? undefined} />

              <PriceSlider value={price} onChange={setPrice} min={priceMin} max={priceMax} variant="desktop" />

              <button className={s.cta} onClick={handleSearch}>{ctaLabel}</button>
            </div>
          </div>
        </Container>
      </section>

      {/* Filter modal (tablet / mobile) */}
      {isModalOpen && (
        <div className={s.modalBackdrop} onClick={() => setIsModalOpen(false)} aria-modal="true" role="dialog">
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalBody}>
              <button className={s.closeBtn} onClick={() => setIsModalOpen(false)} aria-label="Close">
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className={s.modalHeader}>
                <h2 className={s.modalTitle}>Search Filters</h2>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Completion status</p>
                <div className={s.tabs}>
                  <button className={`${s.tab} ${activeTab === 'off-plan' ? s.tabActive : ''}`} onClick={() => setActiveTab('off-plan')}>Off-plan</button>
                  <button className={`${s.tab} ${activeTab === 'secondary' ? s.tabActive : ''}`} onClick={() => setActiveTab('secondary')}>Secondary</button>
                </div>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Property Type</p>
                <div className={s.tagList}>
                  {propertyTypeOptions.map(opt => (
                    <button key={opt.id} className={`${s.tag} ${selectedTypes.includes(opt.id) ? s.tagActive : ''}`} onClick={() => toggleType(opt.id)}>
                      <span>{opt.label}</span>
                      {selectedTypes.includes(opt.id) && <X size={16} strokeWidth={1.5} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Bedroom</p>
                <div className={s.tagList}>
                  {bedroomOptions.map(opt => {
                    const isDisabled = availableBeds != null && !availableBeds.has(opt.id)
                    return (
                      <button
                        key={opt.id}
                        className={`${s.tag} ${selectedBedrooms.includes(opt.id) ? s.tagActive : ''} ${isDisabled ? s.tagDisabled : ''}`}
                        onClick={() => !isDisabled && toggleBedroom(opt.id)}
                        disabled={isDisabled}
                      >
                        <span>{opt.label}</span>
                        {selectedBedrooms.includes(opt.id) && <X size={16} strokeWidth={1.5} />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Price</p>
                <PriceSlider value={price} onChange={setPrice} min={priceMin} max={priceMax} variant="mobile" />
              </div>
            </div>

            <div className={s.modalFooter}>
              <button className={s.clearBtn} onClick={clearFilters}>
                <X size={16} strokeWidth={1.5} />
                <span>Clear filters</span>
              </button>
              <button className={s.ctaMobile} onClick={handleSearch}>{ctaLabel}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
