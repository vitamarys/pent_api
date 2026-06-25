'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import Container from '@/components/ui/Container';
import s from './HeroHome.module.scss';

interface HeroHomeProps {
  bgImage?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  propertyTypes?: string[];
  bedroomOptions?: string[];
  priceMin?: number;
  priceMax?: number;
  priceInitial?: [number, number];
}

const DEFAULT_PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Duplex', 'Full floor'];
const DEFAULT_BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5+'];
const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 99_999_999;

function formatPrice(val: number) {
  return val.toLocaleString('en-US').replace(/,/g, ' ');
}

// ── Dropdown component ────────────────────────────────────────
function DropdownFilter({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
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

  const displayLabel = selected.length > 0 ? selected.join(', ') : label;

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
          {options.map(opt => (
            <button
              key={opt}
              className={`${s.dropdownOption} ${selected.includes(opt) ? s.dropdownOptionActive : ''}`}
              onClick={() => onToggle(opt)}
            >
              <span>{opt}</span>
              {selected.includes(opt) && <X size={14} strokeWidth={1.5} />}
            </button>
          ))}
        </div>
      )}
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
        <div className={s.priceValWrap}>
          <span className={s.priceVal}>{formatPrice(value[0])}</span>
        </div>
        <span className={s.priceSep} />
        <div className={s.priceValWrap}>
          <span className={s.priceVal}>{formatPrice(value[1])}</span>
          <span className={s.priceCurrency}>AED</span>
        </div>
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
  ctaText = 'See 45 Properties',
  propertyTypes = DEFAULT_PROPERTY_TYPES,
  bedroomOptions = DEFAULT_BEDROOM_OPTIONS,
  priceMin = DEFAULT_PRICE_MIN,
  priceMax = DEFAULT_PRICE_MAX,
  priceInitial = [1_000_000, 99_000_000],
}: HeroHomeProps) {
  const [activeTab, setActiveTab] = useState<'off-plan' | 'secondary'>('off-plan');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>(priceInitial);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  const toggleBedroom = useCallback((bed: string) => {
    setSelectedBedrooms(prev =>
      prev.includes(bed) ? prev.filter(b => b !== bed) : [...prev, bed]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTypes([]);
    setSelectedBedrooms([]);
    setPrice(priceInitial);
  }, [priceInitial]);

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
              {/* Tabs */}
              <div className={s.tabs}>
                <button
                  className={`${s.tab} ${activeTab === 'off-plan' ? s.tabActive : ''}`}
                  onClick={() => setActiveTab('off-plan')}
                >Off-plan</button>
                <button
                  className={`${s.tab} ${activeTab === 'secondary' ? s.tabActive : ''}`}
                  onClick={() => setActiveTab('secondary')}
                >Secondary</button>
              </div>

              {/* Property Type dropdown */}
              <DropdownFilter
                label="Property Type"
                options={propertyTypes}
                selected={selectedTypes}
                onToggle={toggleType}
              />

              {/* Bedroom dropdown */}
              <DropdownFilter
                label="Bedroom"
                options={bedroomOptions}
                selected={selectedBedrooms}
                onToggle={toggleBedroom}
              />

              {/* Price Range */}
              <PriceSlider value={price} onChange={setPrice} min={priceMin} max={priceMax} variant="desktop" />

              {/* CTA */}
              <button className={s.cta}>{ctaText}</button>
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
                  {propertyTypes.map((type: string) => (
                    <button key={type} className={`${s.tag} ${selectedTypes.includes(type) ? s.tagActive : ''}`} onClick={() => toggleType(type)}>
                      <span>{type}</span>
                      {selectedTypes.includes(type) && <X size={16} strokeWidth={1.5} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.filterGroup}>
                <p className={s.filterLabel}>Bedroom</p>
                <div className={s.tagList}>
                  {bedroomOptions.map((bed: string) => (
                    <button key={bed} className={`${s.tag} ${selectedBedrooms.includes(bed) ? s.tagActive : ''}`} onClick={() => toggleBedroom(bed)}>
                      <span>{bed}</span>
                      {selectedBedrooms.includes(bed) && <X size={16} strokeWidth={1.5} />}
                    </button>
                  ))}
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
              <button className={s.ctaMobile}>See 125 project</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
