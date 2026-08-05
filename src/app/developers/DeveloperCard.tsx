'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getStrapiImageUrl } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'
import s from './page.module.scss'

interface FavDeveloper {
  id: number
  slug: string
  name: string
  description?: string
  imageBg?: { url: string }
  logo?: { url: string }
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 3 15.5 3 9C3 6.2 5.2 4 8 4C9.8 4 11.4 4.9 12 6.3C12.6 4.9 14.2 4 16 4C18.8 4 21 6.2 21 9C21 15.5 12 21 12 21Z"
        fill={active ? 'white' : 'none'}
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DeveloperCard({
  id,
  name,
  slug,
  description,
  logo,
  imageBg,
}: {
  id: number
  name: string
  slug: string
  description?: string
  logo?: { url: string }
  imageBg?: { url: string }
}) {
  const bgSrc = imageBg ? getStrapiImageUrl(imageBg.url) : ''
  const logoSrc = logo ? getStrapiImageUrl(logo.url) : ''

  const { isFavorite, toggle } = useFavorites<FavDeveloper>('fav_developers')
  const active = isFavorite(id)

  function handleFav(e: React.MouseEvent) {
    e.preventDefault()
    toggle({
      id,
      slug,
      name,
      description,
      imageBg: bgSrc ? { url: bgSrc } : undefined,
      logo: logoSrc ? { url: logoSrc } : undefined,
    })
  }

  return (
    <Link href={`/developers/${slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {bgSrc && <Image src={bgSrc} alt={name} fill className={s.cardBg} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />}
        <div className={s.cardOverlay}>
          <div className={s.cardTopRow}>
            <div className={s.logoPanel}>
              {logoSrc && (
                <Image src={logoSrc} alt={`${name} logo`} fill className={s.logoImg} />
              )}
            </div>
            <button
              className={s.favBtn}
              onClick={handleFav}
              aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon active={active} />
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
