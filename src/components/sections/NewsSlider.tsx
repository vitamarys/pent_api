'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import s from './NewsSlider.module.scss'

export interface NewsItem {
  slug: string
  title: string
  excerpt: string
  tag: string
  date: string
  readTime: string
  image: string
  href?: string
}

interface NewsSliderProps {
  news: NewsItem[]
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href ?? `/news/${item.slug}`} className={s.card}>
      <div className={s.cardImage}>
        <img src={item.image} alt={item.title} className={s.cardImg} />
        <div className={s.cardTag}>{item.tag}</div>
      </div>
      <div className={s.cardBody}>
        <p className={s.cardTitle}>{item.title}</p>
        <div className={s.cardMeta}>
          <p className={s.cardExcerpt}>{item.excerpt}</p>
          <div className={s.cardInfo}>
            <span>{item.date}</span>
            <span className={s.dot} aria-hidden="true" />
            <span>{item.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function NewsSlider({
  news,
  sectionTitle = 'Latest news',
  ctaLabel = 'See all news',
  ctaHref = '/news',
}: NewsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'prev' | 'next') => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector(`.${s.card}`) as HTMLElement | null
    const step = card ? card.offsetWidth + 16 : 444
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' })
  }

  if (news.length === 0) return null

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <h2 className={s.title}>{sectionTitle}</h2>
          <div className={s.headerRight}>
            <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
              {ctaLabel}
            </Link>
            <div className={s.navBtns}>
              <button className={s.navBtn} onClick={() => scroll('prev')} aria-label="Previous">
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button className={s.navBtn} onClick={() => scroll('next')} aria-label="Next">
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </Container>

      <Container className={s.trackContainer}>
        <div className={s.track} ref={trackRef}>
          {news.map(item => (
            <NewsCard key={item.slug} item={item} />
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
