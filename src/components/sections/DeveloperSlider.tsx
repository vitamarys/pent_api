'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { getStrapiImageUrl } from '@/lib/utils'
import s from './DeveloperSlider.module.scss'

export interface DeveloperSliderItem {
  name: string
  slug: string
  description?: string
  logo?: { url: string }
  imageBg?: { url: string }
}

interface DeveloperSliderProps {
  developers: DeveloperSliderItem[]
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
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

function DeveloperCard({ developer }: { developer: DeveloperSliderItem }) {
  const bgSrc = developer.imageBg ? getStrapiImageUrl(developer.imageBg.url) : ''
  const logoSrc = developer.logo ? getStrapiImageUrl(developer.logo.url) : ''

  return (
    <Link href={`/developer/${developer.slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {bgSrc && (
          <img src={bgSrc} alt={developer.name} className={s.cardBg} />
        )}
        <div className={s.cardOverlay}>
          <div className={s.topRow}>
            <div className={s.logoPanel}>
              {logoSrc && (
                <img src={logoSrc} alt={`${developer.name} logo`} className={s.logoImg} />
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

  const scrollPrev = () =>
    trackRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' })
  const scrollNext = () =>
    trackRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' })
console.log(developers)
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
        <div className={s.scrollTrack} ref={trackRef}>
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
