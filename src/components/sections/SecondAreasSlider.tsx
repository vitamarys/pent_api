'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import ResaleCard, { type ResaleCardProps } from '@/app/resale/ResaleCard'
import Container from '@/components/ui/Container'
import s from './SecondAreas.module.scss'
import 'swiper/css'

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

interface Props {
  items: ResaleCardProps[]
  sectionTitle?: string
  titleHighlight?: string
  ctaLabel?: string
}

export default function SecondAreasSlider({ items, sectionTitle, titleHighlight, ctaLabel = 'See more' }: Props) {
  const swiperRef = useRef<SwiperType | null>(null)
  const showArrows = items.length >= 4

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

  return (
    <section className={s.section}>
      <Container>
        <div className={s.sliderHeader}>
          <div className={s.titleWrap}>
            {sectionTitle && (
              <h2 className={s.title} data-anim="heading" suppressHydrationWarning>
                {titleHighlight && sectionTitle.includes(titleHighlight)
                  ? <>
                      {sectionTitle.slice(0, sectionTitle.indexOf(titleHighlight))}
                      <span className={s.highlight}>{titleHighlight}</span>
                      {sectionTitle.slice(sectionTitle.indexOf(titleHighlight) + titleHighlight.length)}
                    </>
                  : sectionTitle}
              </h2>
            )}
          </div>

          <Link href="/resale" className={`${s.sliderCta} ${s.sliderCtaDesktop}`}>
            {ctaLabel}
          </Link>

          {showArrows && (
            <div className={s.navArrows}>
              <button className={s.arrowBtn} onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous">
                <ChevronLeftIcon />
              </button>
              <button className={s.arrowBtn} onClick={() => swiperRef.current?.slideNext()} aria-label="Next">
                <ChevronRightIcon />
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
        {items.map(item => (
          <SwiperSlide key={item.slug} className={s.swiperSlide}>
            <ResaleCard {...item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Container>
        <Link href="/resale" className={`${s.sliderCta} ${s.sliderCtaBottom}`}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
