'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useDragScroll } from '@/hooks/useDragScroll'
import ResaleCard, { type ResaleCardProps } from '@/app/resale/ResaleCard'
import Container from '@/components/ui/Container'
import s from './SecondAreas.module.scss'

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
  const trackRef = useRef<HTMLDivElement>(null)
  const SCROLL_STEP = 428 + 16
  const drag = useDragScroll(trackRef)

  const scrollPrev = () => trackRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' })
  const scrollNext = () => trackRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' })

  const showArrows = items.length >= 4

  return (
    <section className={s.section}>
      <Container>
        <div className={s.sliderHeader}>
          <div className={s.titleWrap}>
            {sectionTitle && (
              <h2 className={s.title}>
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
              <button className={s.arrowBtn} onClick={scrollPrev} aria-label="Previous">
                <ChevronLeftIcon />
              </button>
              <button className={s.arrowBtn} onClick={scrollNext} aria-label="Next">
                <ChevronRightIcon />
              </button>
            </div>
          )}
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
          {items.map(item => (
            <div key={item.slug} className={s.sliderCardWrap}>
              <ResaleCard {...item} />
            </div>
          ))}
        </div>

        <Link href="/resale" className={`${s.sliderCta} ${s.sliderCtaBottom}`}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
