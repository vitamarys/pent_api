'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { useDisplayFormat } from '@/hooks/useDisplayFormat'
import { useFavorites } from '@/hooks/useFavorites'
import s from './ProjectCard.module.scss'
import 'swiper/css'

export interface ProjectCardItem {
  id?: number
  slug: string
  title: string
  location?: string
  developer?: string
  handover?: string
  priceFrom?: number
  propertyTypes?: string[]
  images?: string[]
}

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

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
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

export default function ProjectCard({ id, slug, title, location, developer, handover, priceFrom, propertyTypes, images = [] }: ProjectCardItem) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { formatPrice } = useDisplayFormat()
  const hasGallery = images.length > 1

  const { isFavorite, toggle } = useFavorites<FavProject>('fav_projects')
  const active = id !== undefined ? isFavorite(id) : false

  function handleFav(e: React.MouseEvent) {
    e.preventDefault()
    if (id === undefined) return
    toggle({ id, slug, title, location, developer, handover, priceFrom, propertyTypes, images })
  }

  return (
    <Link href={`/projects/${slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {images.length > 0 ? (
          <Swiper
            onSwiper={swiper => { swiperRef.current = swiper }}
            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            className={s.swiper}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className={s.slide}>
                <img src={img} alt={title} className={s.cardImg} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className={s.imgPlaceholder} />
        )}

        <div className={s.cardOverlay}>
          <div className={s.topRow}>
            <div className={s.tags}>
              {propertyTypes?.map(type => (
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

          {hasGallery && (
            <>
              <div className={s.galNav}>
                <button
                  className={s.galBtn}
                  onClick={e => { e.preventDefault(); swiperRef.current?.slidePrev() }}
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  className={s.galBtn}
                  onClick={e => { e.preventDefault(); swiperRef.current?.slideNext() }}
                  aria-label="Next image"
                >
                  <ChevronRightIcon />
                </button>
              </div>
              <div className={s.pagination}>
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`${s.paginationBar} ${i === activeIndex ? s.paginationBarActive : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={s.cardCart}>
        <div className={s.cardDetails}>
          <div className={s.cardInfo}>
            <div className={s.titleRow}>
              <span className={s.cardDot} />
              <p className={s.cardTitle}>{title}</p>
            </div>
            {location && (
              <p className={s.cardLocation}>{location}</p>
            )}
          </div>

          {(developer || handover) && (
            <div className={s.cardMeta}>
              {developer && (
                <span className={s.cardMetaText}>{developer}</span>
              )}
              {developer && handover && (
                <span className={s.cardMetaDot} />
              )}
              {handover && (
                <span className={s.cardMetaText}>{handover}</span>
              )}
            </div>
          )}
        </div>

        {priceFrom !== undefined && (
          <div className={s.cardPriceRow}>
            <p className={s.cardPrice}>from {formatPrice(priceFrom)}</p>
          </div>
        )}
      </div>
    </Link>
  )
}
