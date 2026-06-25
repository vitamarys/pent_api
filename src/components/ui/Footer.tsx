'use client'

import { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import s from './Footer.module.scss'

const NAV_COLS = [
  [
    { label: 'Buy',               href: '/buy' },
    { label: 'Sell',              href: '/sell' },
    { label: 'Off-plan Projects', href: '/projects' },
  ],
  [
    { label: 'Developers', href: '/developers' },
    { label: 'Services',   href: '/services' },
    { label: 'About Us',   href: '/about' },
  ],
  [
    { label: 'Blog',           href: '/blog' },
    { label: 'Our Specialists', href: '/specialists' },
  ],
]

const NAV_LINKS_FLAT = NAV_COLS.flat()

const SOCIAL_LINKS = [
  { label: 'Facebook',  href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube',   href: '#' },
]

function LogoSvg() {
  return (
    <svg viewBox="0 0 161 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={s.logoSvg}>
      <ellipse cx="8.4" cy="13.6" rx="8.4" ry="8.4" fill="#C19962" />
      <text
        x="25"
        y="19"
        fontFamily="var(--font-inter), SF Pro Display, sans-serif"
        fontSize="16"
        fontWeight="400"
        fill="#ffffff"
        letterSpacing="0.5"
      >
        penthouse.ae
      </text>
    </svg>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className={s.footer}>
      <Container>
        <div className={s.inner}>

          {/* ── Top ──────────────────────────────────────── */}
          <div className={s.top}>

            <Link href="/" className={s.logoLink} aria-label="Home">
              <LogoSvg />
            </Link>

            <div className={s.body}>

              {/* Social + Address */}
              <div className={s.socialSection}>
                {SOCIAL_LINKS.map((link) => (
                  <a key={link.label} href={link.href} className={s.socialLink}>
                    {link.label}
                  </a>
                ))}
                <p className={s.address}>
                  Palm View Tower 1, Ground Floor, R02, Dubai, UAE
                </p>
              </div>

              {/* Nav + Newsletter */}
              <div className={s.navSection}>

                {/* Desktop / Tablet: 3-column grid */}
                <div className={s.navGrid}>
                  {NAV_COLS.map((col, ci) => (
                    <div key={ci} className={s.navCol}>
                      {col.map((link) => (
                        <Link key={link.href} href={link.href} className={s.navLink}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Mobile: flat list */}
                <nav className={s.mobileNav}>
                  {NAV_LINKS_FLAT.map((link) => (
                    <Link key={link.href} href={link.href} className={s.navLink}>
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Newsletter */}
                <div className={s.newsletter}>
                  <span className={s.newsletterLabel}>Newsletter</span>
                  <div className={s.newsletterForm}>
                    <input
                      className={s.newsletterInput}
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className={s.newsletterBtn} type="button">
                      Subscribe
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Bottom ───────────────────────────────────── */}
          <div className={s.bottom}>
            <div className={s.legalLinks}>
              <Link href="/privacy" className={s.legalLink}>Privacy Policy</Link>
              <Link href="/terms"   className={s.legalLink}>Terms of Use</Link>
            </div>
            <p className={s.copyright}>
              Copyright © 2010-2024<br />
              Penthouse.ae All rights reserved.
            </p>
          </div>

        </div>
      </Container>
    </footer>
  )
}
