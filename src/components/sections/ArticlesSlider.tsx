'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import s from './ArticlesSlider.module.scss'

export interface ArticleCardItem {
  id: number
  title: string
  summary?: string
  category?: string
  date?: string
  timeToRead?: string
  image?: string
  href?: string
}

interface ArticlesSliderProps {
  articles: ArticleCardItem[]
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

function ArticleCard({ item }: { item: ArticleCardItem }) {
  return (
    <Link href={item.href ?? '#'} className={s.card}>
      <div className={s.cardImage}>
        {item.image ? (
          <img src={item.image} alt={item.title} className={s.cardImg} />
        ) : (
          <div className={s.cardImgPlaceholder} />
        )}
        {item.category && (
          <span className={s.cardTag}>{item.category}</span>
        )}
      </div>
      <div className={s.cardBody}>
        <p className={s.cardTitle}>{item.title}</p>
        <div className={s.cardMeta}>
          {item.summary && (
            <p className={s.cardSummary}>{item.summary}</p>
          )}
          <div className={s.cardInfo}>
            {item.date && <span>{formatDate(item.date)}</span>}
            {item.date && item.timeToRead && (
              <span className={s.dot} aria-hidden="true" />
            )}
            {item.timeToRead && <span>{item.timeToRead}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function ArticlesSlider({
  articles,
  sectionTitle = 'Latest news',
  ctaLabel = 'See all news',
  ctaHref = '/articles',
}: ArticlesSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'prev' | 'next') => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector(`.${s.card}`) as HTMLElement | null
    const step = card ? card.offsetWidth + 16 : 444
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' })
  }

  if (!articles.length) return null

  const showNav = articles.length >= 3

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <h2 className={s.title}>{sectionTitle}</h2>
          <div className={s.headerActions}>
            <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
              {ctaLabel}
            </Link>
            {showNav && (
              <div className={s.navBtns}>
                <button className={s.navBtn} onClick={() => scroll('prev')} aria-label="Previous">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className={s.navBtn} onClick={() => scroll('next')} aria-label="Next">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      <Container className={s.trackContainer}>
        <div className={s.track} ref={trackRef}>
          {articles.map((item) => (
            <ArticleCard key={item.id} item={item} />
          ))}
        </div>
      </Container>

      <Container>
        <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnMobile}`}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
