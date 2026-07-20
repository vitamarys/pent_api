'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import s from './Header.module.scss'

const DARK_HEADER_PATHS = ['/developers', '/areas', '/resale', '/projects']

const NAV_LINKS = [
  { label: 'Buy',               href: '/buy' },
  { label: 'Sell',              href: '/sell' },
  { label: 'Off-plan Projects', href: '/projects' },
  { label: 'Developers',        href: '/developers' },
  { label: 'Services',          href: '/services' },
  { label: 'About',             href: '/about' },
]

const CURRENCIES = ['AED', 'EUR', 'USD'] as const
const METRICS    = ['ft²', 'm²']                as const

type Currency = typeof CURRENCIES[number]
type Metric   = typeof METRICS[number]

function Logo({ dark }: { dark: boolean }) {
  return (
    <Link href="/" className={s.logo}>
      <Image
        src={dark ? '/icons/Logo.svg' : '/icons/Logo-w.svg'}
        alt="Penthouse"
        width={160}
        height={24}
        priority
      />
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

// ── Shared currency/metric selector ──────────────────────────
function CurrencySelector({
  currency,
  metric,
  onCurrency,
  onMetric,
}: {
  currency: Currency
  metric:   Metric
  onCurrency: (c: Currency) => void
  onMetric:   (m: Metric)   => void
}) {
  return (
    <div className={s.selectorWrap}>
      <div className={s.selectorGroup}>
        <p className={s.selectorLabel}>Select currency</p>
        <div className={s.selectorTags}>
          {CURRENCIES.map(c => (
            <button
              key={c}
              className={`${s.selectorTag} ${c === currency ? s.selectorTagActive : ''}`}
              onClick={() => onCurrency(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className={s.selectorGroup}>
        <p className={s.selectorLabel}>Select metric</p>
        <div className={s.selectorTags}>
          {METRICS.map(m => (
            <button
              key={m}
              className={`${s.selectorTag} ${m === metric ? s.selectorTagActive : ''}`}
              onClick={() => onMetric(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [scrolled,      setScrolled]      = useState(false)
  const [hidden,        setHidden]        = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [currency,      setCurrency]      = useState<Currency>('AED')
  const [metric,        setMetric]        = useState<Metric>('ft²')
  const [currencyOpen,  setCurrencyOpen]  = useState(false)
  const currencyRef = useRef<HTMLDivElement>(null)

  // Scroll hide/show
  useEffect(() => {
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

  // Body scroll lock for menu
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close currency dropdown on outside click
  useEffect(() => {
    if (!currencyOpen) return
    const handleClick = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [currencyOpen])

  const forceDark = DARK_HEADER_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  const dark = forceDark || scrolled || menuOpen

  return (
    <>
      <header className={`${s.header} ${dark ? s.scrolled : s.transparent} ${hidden && !menuOpen ? s.hidden : ''}`}>
        <div className={s.inner}>

          {/* Logo */}
          <Logo dark={dark} />

          {/* Desktop nav */}
          <nav className={s.nav}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className={`${s.navLink} ${dark ? s.dark : s.light}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop utilities */}
          <div className={s.utils}>
            <Link href="/favorites" className={`${s.utilBtn} ${dark ? s.dark : s.light}`}>
              <IconHeart dark={dark} />
              <span>Favorites</span>
            </Link>

            <span className={s.divider} />

            {/* Currency / metric dropdown */}
            <div className={s.currencyWrap} ref={currencyRef}>
              <button
                className={`${s.utilBtn} ${dark ? s.dark : s.light}`}
                onClick={() => setCurrencyOpen(v => !v)}
              >
                <span>{currency} / Sq. {metric}</span>
                <IconChevron dark={dark} />
              </button>

              {currencyOpen && (
                <div className={s.currencyPanel}>
                  <CurrencySelector
                    currency={currency}
                    metric={metric}
                    onCurrency={setCurrency}
                    onMetric={setMetric}
                  />
                </div>
              )}
            </div>

            <span className={s.divider} />

            <button className={`${s.utilBtn} ${dark ? s.dark : s.light}`}>
              <IconSearch dark={dark} />
              <span>Search</span>
            </button>
          </div>

          {/* Mobile buttons */}
          <div className={s.mobileRight}>
            <button className={s.iconBtn} aria-label="Search">
              <IconSearch dark={dark} />
            </button>
            <button className={s.iconBtn} aria-label="Favorites">
              <IconHeart dark={dark} />
            </button>
            <button className={s.iconBtn} aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <IconMenu dark={dark} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={s.drawer}>
          <div className={s.drawerHeader}>
            <Logo dark />
            <button className={s.iconBtn} onClick={() => setMenuOpen(false)}>
              <IconClose />
            </button>
          </div>

          <div className={s.drawerBody}>
            <nav className={s.drawerNav}>
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={s.drawerLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className={s.drawerSelectors}>
              <CurrencySelector
                currency={currency}
                metric={metric}
                onCurrency={setCurrency}
                onMetric={setMetric}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
