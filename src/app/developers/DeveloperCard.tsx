'use client'

import Link from 'next/link'
import { getStrapiImageUrl } from '@/lib/utils'
import s from './page.module.scss'

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 3 15.5 3 9C3 6.2 5.2 4 8 4C9.8 4 11.4 4.9 12 6.3C12.6 4.9 14.2 4 16 4C18.8 4 21 6.2 21 9C21 15.5 12 21 12 21Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DeveloperCard({
  name,
  slug,
  description,
  logo,
  imageBg,
}: {
  name: string
  slug: string
  description?: string
  logo?: { url: string }
  imageBg?: { url: string }
}) {
  const bgSrc = imageBg ? getStrapiImageUrl(imageBg.url) : ''
  const logoSrc = logo ? getStrapiImageUrl(logo.url) : ''

  return (
    <Link href={`/developer/${slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {bgSrc && <img src={bgSrc} alt={name} className={s.cardBg} />}
        <div className={s.cardOverlay}>
          <div className={s.cardTopRow}>
            <div className={s.logoPanel}>
              {logoSrc && (
                <img src={logoSrc} alt={`${name} logo`} className={s.logoImg} />
              )}
            </div>
            <button
              className={s.favBtn}
              onClick={(e) => e.preventDefault()}
              aria-label="Add to favorites"
            >
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>

      <div className={s.cardCart}>
        <div className={s.cardTitleRow}>
          <span className={s.cardDot} />
          <span className={s.cardName}>{name}</span>
        </div>
        {description && <p className={s.cardDesc}>{description}</p>}
      </div>
    </Link>
  )
}
