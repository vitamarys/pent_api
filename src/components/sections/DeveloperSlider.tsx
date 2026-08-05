'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { getStrapiImageUrl } from '@/lib/utils'
import { useDragScroll } from '@/hooks/useDragScroll'
import { useFavorites } from '@/hooks/useFavorites'
import s from './DeveloperSlider.module.scss'

export interface DeveloperSliderImageItem {
  url: string
  urlMd?: string
  urlXl?: string
  alternativeText?: string | null
}

export interface DeveloperSliderItem {
  id?: number
  name: string
  slug: string
  description?: string
  logo?: DeveloperSliderImageItem | null
  logoFile?: { url: string } | null
  image?: DeveloperSliderImageItem | null
  imageBg?: { url: string } | null
  imageFile?: { url: string } | null
}

interface DeveloperSliderProps {
  developers: DeveloperSliderItem[]
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
}

interface FavDeveloper {
  id: number
  slug: string
  name: string
  description?: string
  imageBg?: { url: string }
  logo?: { url: string }
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
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

function DeveloperCard({ developer }: { developer: DeveloperSliderItem }) {
  const bgUrl = developer.image?.url ?? developer.imageBg?.url ?? developer.imageFile?.url ?? ''
  const logoUrl = developer.logo?.url ?? developer.logoFile?.url ?? ''
  const bgSrc = bgUrl ? getStrapiImageUrl(bgUrl) : ''
  const logoSrc = logoUrl ? getStrapiImageUrl(logoUrl) : ''

  const { isFavorite, toggle } = useFavorites<FavDeveloper>('fav_developers')
  const active = developer.id !== undefined ? isFavorite(developer.id) : false

  function handleFav(e: React.MouseEvent) {
    e.preventDefault()
    if (developer.id === undefined) return
    toggle({
      id: developer.id,
      slug: developer.slug,
      name: developer.name,
      description: developer.description,
      imageBg: bgSrc ? { url: bgSrc } : undefined,
      logo: logoSrc ? { url: logoSrc } : undefined,
    })
  }

  return (
    <Link href={`/developers/${developer.slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {bgSrc && (
          <Image src={bgSrc} alt={developer.name} fill className={s.cardBg} sizes="(max-width: 768px) 100vw, 428px" />
        )}
        <div className={s.cardOverlay}>
          <div className={s.topRow}>
            <div className={s.logoPanel}>
              {logoSrc && (
                <Image src={logoSrc} alt={`${developer.name} logo`} width={90} height={90} className={s.logoImg} style={{ height: 'auto' }} />
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
          <div className={s.cardDot} />
          <span className={s.cardTitle}>{developer.name}</span>
        </div>
        {developer.description && (
          <p className={s.cardDesc}>{developer.description}</p>
        )}
      </div>
    </Link>
  )
}

export default function DeveloperSlider({
  developers,
  sectionTitle,
  ctaLabel,
  ctaHref,
}: DeveloperSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const SCROLL_STEP = 428 + 16
  const drag = useDragScroll(trackRef)

  const scrollPrev = () =>
    trackRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' })
  const scrollNext = () =>
    trackRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' })
  if (developers.length === 0) return null

  const title = sectionTitle || 'Other Developers'
  const label = ctaLabel || 'See all Developers'
  const href = ctaHref || '/developers'

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <div className={s.titleWrap}>
            <h2 className={s.title}>{title}</h2>
          </div>

          <a href={href} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
            {label}
          </a>

          <div className={s.navArrows}>
            <button className={s.arrowBtn} onClick={scrollPrev} aria-label="Previous developers">
              <ChevronLeft />
            </button>
            <button className={s.arrowBtn} onClick={scrollNext} aria-label="Next developers">
              <ChevronRight />
            </button>
          </div>
        </div>
      </Container>

      <Container>
        <div
          className={s.scrollTrack}
          ref={trackRef}
          style={{ cursor: 'grab' }}
          onMouseDown={drag.onMouseDown}
          onClickCapture={drag.onClickCapture}
        >
          {developers.map((dev) => (
            <DeveloperCard key={dev.slug} developer={dev} />
          ))}
        </div>
      </Container>

      <Container>
        <a href={href} className={`${s.ctaBtn} ${s.ctaBtnBottom}`}>
          {label}
        </a>
      </Container>
    </section>
  )
}
