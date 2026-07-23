'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { useDragScroll } from '@/hooks/useDragScroll'
import { getStrapiImageUrl } from '@/lib/utils'
import s from './AgentSlider.module.scss'

export interface AgentSliderItem {
  id: number
  name: string
  position?: string
  cardImage?: { url: string } | null
  whatsapp?: string
  phoneNumber?: string
}

export interface AgentSliderProps {
  agents: AgentSliderItem[]
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

function AgentCard({ agent }: { agent: AgentSliderItem }) {
  const imageSrc = agent.cardImage?.url ? getStrapiImageUrl(agent.cardImage.url) : null

  return (
    <div className={s.card}>
      <div className={s.cardMedia}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={agent.name}
            fill
            sizes="(max-width: 767px) calc(100vw - 32px), 448px"
            className={s.cardImg}
          />
        ) : (
          <div className={s.cardImgPlaceholder} />
        )}
      </div>

      <div className={s.cardCart}>
        <div className={s.cardInfo}>
          <div className={s.cardTitleRow}>
            <span className={s.cardDot} aria-hidden />
            <span className={s.cardName}>{agent.name}</span>
          </div>
          {agent.position && (
            <p className={s.cardPosition}>{agent.position}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AgentSlider({
  agents,
  sectionTitle = 'Our Team',
  ctaLabel = 'See all employees',
  ctaHref = '/agents',
}: AgentSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const CARD_WIDTH = 448 + 16
  const drag = useDragScroll(trackRef)

  const scrollPrev = () =>
    trackRef.current?.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' })
  const scrollNext = () =>
    trackRef.current?.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' })

  if (agents.length === 0) return null

  return (
    <section className={s.section}>
      <div className={s.ellipse} aria-hidden />

      <Container>
        <div className={s.header}>
          <div className={s.titleWrap}>
            <h2 className={s.title}>{sectionTitle}</h2>
          </div>

          <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
            {ctaLabel}
          </Link>

          <div className={s.navArrows}>
            <button className={s.arrowBtn} onClick={scrollPrev} aria-label="Previous agents">
              <ChevronLeft />
            </button>
            <button className={s.arrowBtn} onClick={scrollNext} aria-label="Next agents">
              <ChevronRight />
            </button>
          </div>
        </div>
      </Container>

      <Container>
        <div
          className={s.scrollTrack}
          ref={trackRef}
          onMouseDown={drag.onMouseDown}
          onClickCapture={drag.onClickCapture}
        >
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </Container>

      <Container>
        <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnBottom}`}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
