'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useDisplayFormat } from '@/hooks/useDisplayFormat'
import s from './ArticleProjectCard.module.scss'

interface ArticleProjectCardProps {
  slug: string
  title: string
  imageUrl?: string
  location?: string
  developer?: string
  handover?: string
  priceFrom?: number
  propertyTypes?: string[]
}

export default function ArticleProjectCard({
  slug,
  title,
  imageUrl,
  location,
  developer,
  handover,
  priceFrom,
  propertyTypes,
}: ArticleProjectCardProps) {
  const { formatPrice } = useDisplayFormat()

  return (
    <Link href={`/projects/${slug}`} className={s.card}>
      {/* Image */}
      <div className={s.media}>
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className={s.img} sizes="(max-width: 640px) 100vw, 50vw" />
        ) : (
          <div className={s.imgPlaceholder} />
        )}
        {propertyTypes && propertyTypes.length > 0 && (
          <div className={s.tags}>
            {propertyTypes.map((type) => (
              <span key={type} className={s.tag}>{type}</span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={s.cart}>
        <div className={s.details}>
          <div className={s.propDetails}>
            <div className={s.propInfo}>
              <div className={s.titleRow}>
                <span className={s.dot} />
                <p className={s.title}>{title}</p>
              </div>
              {location && <p className={s.location}>{location}</p>}
            </div>

            {(developer || handover) && (
              <div className={s.specs}>
                {developer && <span className={s.specsText}>{developer}</span>}
                {developer && handover && <span className={s.specsDot} />}
                {handover && <span className={s.specsText}>{handover}</span>}
              </div>
            )}
          </div>

          {priceFrom !== undefined && (
            <div className={s.priceRow}>
              <p className={s.price}>from {formatPrice(priceFrom)}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
