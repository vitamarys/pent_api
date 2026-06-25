'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './Header.module.scss'

const DARK_HEADER_PATHS = ['/developers', '/areas']

const NAV_LINKS = [
  { label: 'Buy',               href: '/buy' },
  { label: 'Sell',              href: '/sell' },
  { label: 'Off-plan Projects', href: '/projects' },
  { label: 'Developers',        href: '/developers' },
  { label: 'Services',          href: '/services' },
  { label: 'About',             href: '/about' },
]

function Logo({ dark }: { dark: boolean }) {
  return (
    <Link href="/" className={s.logo}>
      <svg width="161" height="24" viewBox="0 0 161 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ellipse / dot */}
        <ellipse cx="8.4" cy="13.6" rx="8.4" ry="8.4" fill="#C19962"/>
        {/* Wordmark */}
        <text
          x="25"
          y="19"
          fontFamily="var(--font-inter), SF Pro Display, sans-serif"
          fontSize="16"
          fontWeight="400"
          fill={dark ? '#1f1f1f' : '#ffffff'}
          letterSpacing="0.5"
        >
          penthouse.ae
        </text>
      </svg>
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

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const forceDark = DARK_HEADER_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const dark = forceDark || scrolled || menuOpen

  return (
    <>
      <header className={`${s.header} ${dark ? s.scrolled : s.transparent}`}>
        <div className={s.inner}>

          {/* Logo */}
          <Logo dark={dark} />

          {/* Desktop nav */}
          <nav className={s.nav}>
            {NAV_LINKS.map((link) => (
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

            <button className={`${s.utilBtn} ${dark ? s.dark : s.light}`}>
              <span>AED / Sq. Ft</span>
              <IconChevron dark={dark} />
            </button>

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
          <nav className={s.drawerNav}>
            {NAV_LINKS.map((link) => (
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
          <div className={s.drawerUtils}>
            <button className={s.drawerUtilBtn}>AED / Sq. Ft <IconChevron dark /></button>
          </div>
        </div>
      )}
    </>
  )
}
