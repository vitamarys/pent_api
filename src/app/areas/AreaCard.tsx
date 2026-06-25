'use client'

import Link from 'next/link'
import s from './page.module.scss'

export default function AreaCard({
  name,
  slug,
  city,
  description,
  image,
}: {
  name: string
  slug: string
  city?: string
  description?: string
  image?: string
}) {
  return (
    <Link href={`/areas/${slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {image && <img src={image} alt={name} className={s.cardBg} />}
        <div className={s.cardOverlay}>
          {city && <span className={s.cityBadge}>{city}</span>}
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
