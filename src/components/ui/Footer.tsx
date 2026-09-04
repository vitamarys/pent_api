'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import s from './Footer.module.scss'

const NAV_COLS = [
  [
    { label: 'Off-plan Projects', href: '/projects' },
    { label: 'Buy',               href: '/buy' },
    { label: 'Sell',              href: '/sell' },
  ],
  [
    { label: 'Developers', href: '/developers' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us',   href: '/about-us' },
  ],
  [
    { label: 'Blog',           href: '/blog' },
    { label: 'Our Specialists', href: '/agents' },
  ],
]

const NAV_LINKS_FLAT = NAV_COLS.flat()

const SOCIAL_LINKS = [
  { label: 'Facebook',  href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube',   href: '#' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const year = new Date().getFullYear()

  return (
    <footer className={s.footer}>
      <Container>
        <div className={s.inner}>

          {/* ── Top ──────────────────────────────────────── */}
          <div className={s.top}>

            <Link href="/" className={s.logoLink} aria-label="Home">
              <Image src="/icons/logo-footer.svg" alt="Penthouse" width={643} height={95} className={s.logoSvg} />
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
              Copyright © 2010-{year}<br />
              Penthouse.ae All rights reserved.
            </p>
          </div>

        </div>
      </Container>
    </footer>
  )
}
