'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import s from './Header.module.scss'
import { useSettingsStore, CURRENCIES, METRICS, type Currency, type Metric } from '@/store/settings'
import strapiClient from '@/lib/axios'

const DARK_HEADER_PATHS = ['/developers', '/areas', '/resale', '/projects', '/agents', '/about', '/favorites']

const NAV_LINKS = [
  { label: 'Buy',               href: '/buy' },
  { label: 'Sell',              href: '/sell' },
  { label: 'Off-plan Projects', href: '/projects' },
  { label: 'Developers',        href: '/developers' },
  { label: 'Services',          href: '/services' },
  { label: 'About',             href: '/about' },
]

// ── Search API types ──────────────────────────────────────────
interface SearchProject {
  id: number
  title: string
  handover?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  previewImage?: { url: string } | null
  projectTypes?: Array<{ name: string }>
  area?: { title: string } | null
  developer?: { name: string } | null
  pageUrl?: { url: string } | null
}
interface SearchArea {
  id: number
  title: string
  description?: string | null
  previewImage?: { url: string } | null
  pageUrl?: { url: string } | null
}
interface SearchDeveloper {
  id: number
  name: string
  description?: string | null
  image?: { url: string } | null
  logo?: { url: string } | null
  pageUrl?: { url: string } | null
}
interface SearchAgent {
  id: number
  name: string
  position?: string | null
  cardImage?: { url: string } | null
  pageUrl?: { url: string } | null
}
interface SearchResults {
  projects?:   SearchProject[]
  areas?:      SearchArea[]
  developers?: SearchDeveloper[]
  agents?:     SearchAgent[]
}

function hasAnyResults(r: SearchResults | null): boolean {
  if (!r) return false
  return (r.projects?.length ?? 0) > 0 ||
         (r.areas?.length ?? 0) > 0 ||
         (r.developers?.length ?? 0) > 0 ||
         (r.agents?.length ?? 0) > 0
}

function fmtPrice(n?: number | null): string {
  if (!n) return ''
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${+(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

// ── Icons ──────────────────────────────────────────────────────
function Logo({ dark }: { dark: boolean }) {
  return (
    <Link href="/" className={s.logo}>
      <Image src={dark ? '/icons/Logo.svg' : '/icons/Logo-w.svg'} alt="Penthouse" width={160} height={24} priority />
    </Link>
  )
}

function IconSearch({ dark }: { dark: boolean }) {
  const c = dark ? '#1f1f1f' : '#ffffff'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.5"/>
      <path d="M20 20L16.65 16.65" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconHeart({ dark }: { dark: boolean }) {
  const c = dark ? '#1f1f1f' : '#ffffff'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.24 5 10.91 6.01 12 7.08C13.09 6.01 14.76 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function IconChevron({ dark }: { dark: boolean }) {
  const c = dark ? '#1f1f1f' : '#ffffff'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconMenu({ dark }: { dark: boolean }) {
  const c = dark ? '#1f1f1f' : '#ffffff'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 6H20M4 12H20M4 18H20" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10 2C7.24 2 5 4.24 5 7c0 4 5 11 5 11s5-7 5-11c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 10 5a1.5 1.5 0 0 1 0 3.5z" fill="rgba(31,31,31,0.4)"/>
    </svg>
  )
}

function IconHeartOutline() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.24 5 10.91 6.01 12 7.08C13.09 6.01 14.76 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Currency selector ─────────────────────────────────────────
function CurrencySelector({ currency, metric, onCurrency, onMetric }: {
  currency: Currency; metric: Metric
  onCurrency: (c: Currency) => void; onMetric: (m: Metric) => void
}) {
  return (
    <div className={s.selectorWrap}>
      <div className={s.selectorGroup}>
        <p className={s.selectorLabel}>Select currency</p>
        <div className={s.selectorTags}>
          {CURRENCIES.map(c => (
            <button key={c} className={`${s.selectorTag} ${c === currency ? s.selectorTagActive : ''}`} onClick={() => onCurrency(c)}>{c}</button>
          ))}
        </div>
      </div>
      <div className={s.selectorGroup}>
        <p className={s.selectorLabel}>Select metric</p>
        <div className={s.selectorTags}>
          {METRICS.map(m => (
            <button key={m} className={`${s.selectorTag} ${m === metric ? s.selectorTagActive : ''}`} onClick={() => onMetric(m)}>{m}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Popup cards ───────────────────────────────────────────────
function ProjectCard({ p, onClose }: { p: SearchProject; onClose: () => void }) {
  const price = p.minPrice || p.maxPrice
    ? `AED ${fmtPrice(p.minPrice)}${p.maxPrice && p.maxPrice !== p.minPrice ? `–${fmtPrice(p.maxPrice)}` : ''}`
    : ''

  return (
    <Link href={p.pageUrl?.url ?? '#'} className={s.popupCard} onClick={onClose}>
      <div className={s.popupCardImg}>
        {p.previewImage?.url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={p.previewImage.url} alt={p.title} className={s.popupCardImgEl} />
          : <div className={s.popupCardImgPlaceholder} />
        }
        {(p.projectTypes?.length ?? 0) > 0 && (
          <div className={s.popupCardTags}>
            {p.projectTypes!.map(t => <span key={t.name} className={s.popupCardTag}>{t.name}</span>)}
          </div>
        )}
        <button className={s.popupCardHeart} onClick={e => e.preventDefault()} aria-label="Favorite">
          <IconHeartOutline />
        </button>
      </div>
      <div className={s.popupCardBody}>
        <p className={s.popupCardTitle}>
          <span className={s.popupCardDot} />
          {p.title}
        </p>
        {p.area?.title && <p className={s.popupCardSub}>{p.area.title}</p>}
        {(p.developer?.name || p.handover) && (
          <p className={s.popupCardMeta}>
            {[p.developer?.name, p.handover].filter(Boolean).join(' • ')}
          </p>
        )}
        {price && <p className={s.popupCardPrice}>{price}</p>}
      </div>
    </Link>
  )
}

function AreaCard({ a, onClose }: { a: SearchArea; onClose: () => void }) {
  return (
    <Link href={a.pageUrl?.url ?? '#'} className={s.popupCard} onClick={onClose}>
      <div className={s.popupCardImg}>
        {a.previewImage?.url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={a.previewImage.url} alt={a.title} className={s.popupCardImgEl} />
          : <div className={s.popupCardImgPlaceholder} />
        }
        <button className={s.popupCardHeart} onClick={e => e.preventDefault()} aria-label="Favorite">
          <IconHeartOutline />
        </button>
      </div>
      <div className={s.popupCardBody}>
        <p className={`${s.popupCardTitle} ${s.popupCardTitleLg}`}>
          <span className={s.popupCardDot} />
          {a.title}
        </p>
        {a.description && <p className={s.popupCardDesc}>{a.description}</p>}
      </div>
    </Link>
  )
}

function DeveloperCard({ d, onClose }: { d: SearchDeveloper; onClose: () => void }) {
  return (
    <Link href={d.pageUrl?.url ?? '#'} className={s.popupCard} onClick={onClose}>
      <div className={s.popupCardImg}>
        {d.image?.url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={d.image.url} alt={d.name} className={s.popupCardImgEl} />
          : <div className={s.popupCardImgPlaceholder} />
        }
        {d.logo?.url && (
          <div className={s.popupCardLogoOverlay}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.logo.url} alt={d.name} className={s.popupCardLogoImg} />
          </div>
        )}
        <button className={s.popupCardHeart} onClick={e => e.preventDefault()} aria-label="Favorite">
          <IconHeartOutline />
        </button>
      </div>
      <div className={s.popupCardBody}>
        <p className={`${s.popupCardTitle} ${s.popupCardTitleLg}`}>
          <span className={s.popupCardDot} />
          {d.name}
        </p>
        {d.description && <p className={s.popupCardDesc}>{d.description}</p>}
      </div>
    </Link>
  )
}

// ── Main component ─────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname()
  const router   = useRouter()

  const [mounted,      setMounted]      = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [hidden,       setHidden]       = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const currencyRef = useRef<HTMLDivElement>(null)

  const { currency, metric, setCurrency, setMetric } = useSettingsStore()

  // ── Search + Popup state ───────────────────────────────────
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [popupOpen,     setPopupOpen]     = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const popupInputRef  = useRef<HTMLInputElement>(null)
  const searchTimer    = useRef<ReturnType<typeof setTimeout>>(null)

  function handleCurrency(c: Currency) { setCurrency(c); router.refresh() }
  function handleMetric(m: Metric)     { setMetric(m);   router.refresh() }

  // Scroll hide/show
  useEffect(() => {
    setMounted(true)
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      if (y > lastY && y > 80) setHidden(true)
      else if (y < lastY)       setHidden(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock
  useEffect(() => {
    const locked = menuOpen || popupOpen
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, popupOpen])

  // Close currency on outside click
  useEffect(() => {
    if (!currencyOpen) return
    const fn = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setCurrencyOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [currencyOpen])

  // ── Debounced search ───────────────────────────────────────
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)

    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null)
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const { data } = await strapiClient.get<SearchResults>(
          '/api/catalog/search',
          { params: { q: searchQuery } },
        )
        setSearchResults(data)
      } catch {
        setSearchResults({})
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [searchQuery])

  // Escape closes everything
  useEffect(() => {
    if (!searchOpen && !popupOpen) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen, popupOpen])

  function openSearch() {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 60)
  }

  function openPopup() {
    setPopupOpen(true)
    setTimeout(() => popupInputRef.current?.focus(), 60)
  }

  function closeAll() {
    setSearchOpen(false)
    setPopupOpen(false)
    setSearchQuery('')
    setSearchResults(null)
    setSearchLoading(false)
  }

  const forceDark = DARK_HEADER_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  const dark = forceDark || (mounted && scrolled) || menuOpen || searchOpen || popupOpen

  const showDropdown = searchOpen && !popupOpen && searchQuery.length >= 2

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════ */}
      <header className={`${s.header} ${dark ? s.scrolled : s.transparent} ${mounted && hidden && !menuOpen && !searchOpen && !popupOpen ? s.hidden : ''}`}>
        <div className={s.inner}>

          {/* Normal content */}
          <div className={`${s.headerMain} ${searchOpen || popupOpen ? s.headerMainHidden : ''}`}>
            <Logo dark={dark} />

            <nav className={s.nav}>
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className={`${s.navLink} ${dark ? s.dark : s.light}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className={s.utils}>
              <Link href="/favorites" className={`${s.utilBtn} ${dark ? s.dark : s.light}`}>
                <IconHeart dark={dark} />
                <span>Favorites</span>
              </Link>
              <span className={s.divider} />
              <div className={s.currencyWrap} ref={currencyRef}>
                <button className={`${s.utilBtn} ${dark ? s.dark : s.light}`} onClick={() => setCurrencyOpen(v => !v)}>
                  <span>{currency} / Sq. {metric}</span>
                  <IconChevron dark={dark} />
                </button>
                {currencyOpen && (
                  <div className={s.currencyPanel}>
                    <CurrencySelector currency={currency} metric={metric} onCurrency={handleCurrency} onMetric={handleMetric} />
                  </div>
                )}
              </div>
              <span className={s.divider} />
              <button className={`${s.utilBtn} ${dark ? s.dark : s.light}`} onClick={openSearch}>
                <IconSearch dark={dark} />
                <span>Search</span>
              </button>
            </div>

            <div className={s.mobileRight}>
              <button className={s.iconBtn} aria-label="Search" onClick={openSearch}>
                <IconSearch dark={dark} />
              </button>
              <Link href="/favorites" className={s.iconBtn} aria-label="Favorites">
                <IconHeart dark={dark} />
              </Link>
              <button className={s.iconBtn} aria-label="Menu" onClick={() => setMenuOpen(true)}>
                <IconMenu dark={dark} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className={`${s.searchBar} ${(searchOpen || popupOpen) ? s.searchBarVisible : ''}`}>
            <span className={s.searchLogo}><Logo dark /></span>
            <input
              ref={searchInputRef}
              className={s.searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects, areas, developers…"
              aria-label="Search"
            />
            <div className={s.searchBarRight}>
              <span className={s.searchBarSearchIcon}><IconSearch dark /></span>
              <span className={s.searchBarDivider} />
              <button className={s.searchCloseBtn} onClick={closeAll} aria-label="Close search">
                <IconClose />
                <span className={s.searchCloseBtnLabel}>Close</span>
              </button>
            </div>
          </div>

          {/* Dropdown (only when popup is NOT open) — inside .inner for correct positioning */}
          <div className={`${s.searchPanel} ${showDropdown ? s.searchPanelVisible : ''}`}>

          {searchLoading && (
            <div className={s.searchLoading}>
              <span className={s.searchLoadingDot} />
              <span className={s.searchLoadingDot} />
              <span className={s.searchLoadingDot} />
            </div>
          )}

          {!searchLoading && searchResults !== null && (
            <>
              {!hasAnyResults(searchResults) ? (
                <div className={s.searchEmpty}>
                  <p className={s.searchEmptyTitle}>Nothing found</p>
                  <p className={s.searchEmptyText}>
                    But maybe it&apos;s just a technical error.{' '}
                    Our consultant will definitely help you.
                  </p>
                </div>
              ) : (
                <div className={s.searchResultsList}>

                  {(searchResults.projects?.length ?? 0) > 0 && (
                    <div className={s.searchSection}>
                      <p className={s.searchSectionLabel}>Projects</p>
                      {searchResults.projects!.map(p => (
                        <Link key={p.id} href={p.pageUrl?.url ?? '#'} className={s.searchItem} onClick={closeAll}>
                          <span className={s.searchItemThumb} style={p.previewImage?.url ? { backgroundImage: `url(${p.previewImage.url})` } : undefined} />
                          <span className={s.searchItemText}>{p.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {(searchResults.areas?.length ?? 0) > 0 && (
                    <div className={s.searchSection}>
                      <p className={s.searchSectionLabel}>Areas</p>
                      {searchResults.areas!.map(a => (
                        <Link key={a.id} href={a.pageUrl?.url ?? '#'} className={s.searchItem} onClick={closeAll}>
                          <IconPin />
                          <span className={s.searchItemText}>{a.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {(searchResults.developers?.length ?? 0) > 0 && (
                    <div className={s.searchSection}>
                      <p className={s.searchSectionLabel}>Developers</p>
                      {searchResults.developers!.map(d => (
                        <Link key={d.id} href={d.pageUrl?.url ?? '#'} className={s.searchItem} onClick={closeAll}>
                          <span className={s.searchItemLogoWrap}>
                            {d.logo?.url && <img src={d.logo.url} alt={d.name} className={s.searchItemLogo} />}
                          </span>
                          <span className={s.searchItemText}>{d.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {hasAnyResults(searchResults) && (
                <button className={s.searchSeeAllBtn} onClick={openPopup}>
                  See all
                </button>
              )}
            </>
          )}
          </div>
          {/* ↑ end .searchPanel — end .inner ↓ */}

        </div>

      </header>

      {/* Backdrop (behind dropdown, above page) */}
      {searchOpen && !popupOpen && (
        <div className={s.searchBackdrop} onClick={closeAll} />
      )}

      {/* ══════════════════════════════════════════════════════
          FULL-SCREEN SEARCH POPUP
      ══════════════════════════════════════════════════════ */}
      {popupOpen && (
        <div className={s.searchPopup}>

          {/* Popup header bar */}
          <div className={s.searchPopupBarOuter}>
            <div className={s.searchPopupBar}>
              <span className={s.searchPopupLogo}><Logo dark /></span>
              <input
                ref={popupInputRef}
                className={s.searchPopupInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects, areas, developers…"
                aria-label="Search"
              />
              <div className={s.searchPopupActions}>
                <span className={s.searchBarSearchIcon}><IconSearch dark /></span>
                <span className={s.searchBarDivider} />
                <button className={s.searchCloseBtn} onClick={closeAll} aria-label="Close">
                  <IconClose />
                  <span className={s.searchCloseBtnLabel}>Close</span>
                </button>
              </div>
            </div>
          </div>

          {/* Popup body */}
          <div className={s.searchPopupBody}>
            <div className={s.searchPopupInner}>

              {/* Loading */}
              {searchLoading && (
                <div className={s.popupLoading}>
                  <span className={s.searchLoadingDot} />
                  <span className={s.searchLoadingDot} />
                  <span className={s.searchLoadingDot} />
                </div>
              )}

              {/* Results */}
              {!searchLoading && searchResults !== null && (
                <>
                  {!hasAnyResults(searchResults) ? (
                    <div className={s.popupEmpty}>
                      <p className={s.searchEmptyTitle}>Nothing found</p>
                      <p className={s.searchEmptyText}>
                        But maybe it&apos;s just a technical error.{' '}
                        Our consultant will definitely help you.
                      </p>
                    </div>
                  ) : (
                    <>
                      {(searchResults.projects?.length ?? 0) > 0 && (
                        <section className={s.popupSection}>
                          <h2 className={s.popupSectionTitle}>Projects</h2>
                          <div className={s.popupGrid}>
                            {searchResults.projects!.map(p => (
                              <ProjectCard key={p.id} p={p} onClose={closeAll} />
                            ))}
                          </div>
                        </section>
                      )}

                      {(searchResults.areas?.length ?? 0) > 0 && (
                        <section className={s.popupSection}>
                          <h2 className={s.popupSectionTitle}>Areas</h2>
                          <div className={s.popupGrid}>
                            {searchResults.areas!.map(a => (
                              <AreaCard key={a.id} a={a} onClose={closeAll} />
                            ))}
                          </div>
                        </section>
                      )}

                      {(searchResults.developers?.length ?? 0) > 0 && (
                        <section className={s.popupSection}>
                          <h2 className={s.popupSectionTitle}>Developers</h2>
                          <div className={s.popupGrid}>
                            {searchResults.developers!.map(d => (
                              <DeveloperCard key={d.id} d={d} onClose={closeAll} />
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Empty while typing */}
              {!searchLoading && searchResults === null && (
                <div className={s.popupEmpty}>
                  <p className={s.searchEmptyText}>Start typing to search…</p>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={s.drawer}>
          <div className={s.drawerHeader}>
            <Logo dark />
            <button className={s.iconBtn} onClick={() => setMenuOpen(false)}><IconClose /></button>
          </div>
          <div className={s.drawerBody}>
            <nav className={s.drawerNav}>
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className={s.drawerLink} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className={s.drawerSelectors}>
              <CurrencySelector currency={currency} metric={metric} onCurrency={setCurrency} onMetric={setMetric} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
