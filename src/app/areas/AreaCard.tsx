'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useFavorites } from '@/hooks/useFavorites'
import s from './page.module.scss'

interface FavArea {
  id: number
  slug: string
  name: string
  description?: string
  image?: string
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

export default function AreaCard({
  id,
  name,
  slug,
  description,
  image,
}: {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
}) {
  const { isFavorite, toggle } = useFavorites<FavArea>('fav_areas')
  const active = isFavorite(id)

  return (
    <Link href={`/areas/${slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {image && <Image src={image} alt={name} fill className={s.cardBg} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />}
        <div className={s.cardOverlay}>
          <button
            className={s.favBtn}
            onClick={(e) => {
              e.preventDefault()
              toggle({ id, slug, name, description, image })
            }}
            aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon active={active} />
          </button>
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
