'use client'

import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { useDisplayFormat } from '@/hooks/useDisplayFormat'
import { useFavorites } from '@/hooks/useFavorites'
import type { SimilarProjectItem } from '@/components/sections/SimilarProjects'
import s from './AgentProperties.module.scss'

interface FavProject {
  id: number
  slug: string
  title: string
  location?: string
  developer?: string
  handover?: string
  priceFrom?: number
  propertyTypes?: string[]
  images?: string[]
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

function PropertyCard({ item }: { item: SimilarProjectItem }) {
  const { formatPrice } = useDisplayFormat()
  const img = item.images?.[0]

  const { isFavorite, toggle } = useFavorites<FavProject>('fav_projects')
  const active = item.id !== undefined ? isFavorite(item.id) : false

  function handleFav(e: React.MouseEvent) {
    e.preventDefault()
    if (item.id === undefined) return
    toggle({
      id: item.id,
      slug: item.slug,
      title: item.title,
      location: item.location,
      developer: item.developer,
      handover: item.handover,
      priceFrom: item.priceFrom,
      propertyTypes: item.propertyTypes,
      images: item.images,
    })
  }

  return (
    <Link href={item.href ?? `/projects/${item.slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {img
          ? <Image src={img} alt={item.title} fill className={s.cardImg} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          : <div className={s.imgPlaceholder} />
        }
        <div className={s.cardOverlay}>
          <div className={s.topRow}>
            <div className={s.tags}>
              {item.propertyTypes?.map(type => (
                <span key={type} className={s.tag}>{type}</span>
              ))}
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
        <div className={s.cardDetails}>
          <div className={s.cardInfo}>
            <div className={s.titleRow}>
              <span className={s.cardDot} />
              <p className={s.cardTitle}>{item.title}</p>
            </div>
            {item.location && (
              <p className={s.cardLocation}>{item.location}</p>
            )}
          </div>

          {(item.developer || item.handover) && (
            <div className={s.cardMeta}>
              {item.developer && (
                <span className={s.cardMetaText}>{item.developer}</span>
              )}
              {item.developer && item.handover && (
                <span className={s.cardMetaDot} />
              )}
              {item.handover && (
                <span className={s.cardMetaText}>{item.handover}</span>
              )}
            </div>
          )}
        </div>

        {item.priceFrom !== undefined && (
          <div className={s.cardPriceRow}>
            <p className={s.cardPrice}>from {formatPrice(item.priceFrom)}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

interface AgentPropertiesProps {
  items: SimilarProjectItem[]
  title: string
}

export default function AgentProperties({ items, title }: AgentPropertiesProps) {
  if (items.length === 0) return null

  return (
    <section className={s.section}>
      <Container>
        <h2 className={s.title}>{title}</h2>
        <div className={s.grid}>
          {items.map(item => (
            <PropertyCard key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </section>
  )
}
