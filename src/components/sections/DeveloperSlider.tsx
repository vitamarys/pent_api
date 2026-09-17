'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import Container from '@/components/ui/Container'
import { getStrapiImageUrl } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'
import s from './DeveloperSlider.module.scss'
import 'swiper/css'

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
  const swiperRef = useRef<SwiperType | null>(null)

  const PAGE_WIDTH = 1440
  const GAP_LARGE = 32
  const GAP_SMALL = 16
  const MOBILE_BP = 767

  const [offsetBefore, setOffsetBefore] = useState(GAP_LARGE)

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth
      if (vw <= MOBILE_BP) {
        setOffsetBefore(GAP_SMALL)
      } else {
        setOffsetBefore(vw > PAGE_WIDTH ? Math.floor((vw - PAGE_WIDTH) / 2) + GAP_LARGE : GAP_LARGE)
      }
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  if (developers.length === 0) return null

  const title = sectionTitle || 'Other Developers'
  const label = ctaLabel || 'See all Developers'
  const href = ctaHref || '/developers'
  const showArrows = developers.length >= 3

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <div className={s.titleWrap}>
            <h2 className={s.title} data-anim="heading" suppressHydrationWarning>{title}</h2>
          </div>

          <a href={href} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
            {label}
          </a>

          {showArrows && (
            <div className={s.navArrows}>
              <button className={s.arrowBtn} onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous developers">
                <ChevronLeft />
              </button>
              <button className={s.arrowBtn} onClick={() => swiperRef.current?.slideNext()} aria-label="Next developers">
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </Container>

      <Swiper
        onSwiper={swiper => { swiperRef.current = swiper }}
        slidesPerView="auto"
        spaceBetween={16}
        slidesOffsetBefore={offsetBefore}
        slidesOffsetAfter={offsetBefore}
        className={s.swiper}
      >
        {developers.map((dev, i) => (
          <SwiperSlide key={dev.id ?? `${dev.slug}-${i}`} className={s.slide}>
            <DeveloperCard developer={dev} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Container>
        <a href={href} className={`${s.ctaBtn} ${s.ctaBtnBottom}`}>
          {label}
        </a>
      </Container>
    </section>
  )
}
