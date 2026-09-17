'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import Container from '@/components/ui/Container'
import s from './Areas.module.scss'
import 'swiper/css'

export interface AreaItem {
  name: string
  slug: string
  image: string
}

interface AreasProps {
  areas: AreaItem[]
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
}

function DotIcon() {
  return (
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="12" r="5" fill="#C19962" />
    </svg>
  )
}

function AreaCard({ area }: { area: AreaItem }) {
  return (
    <Link href={`/areas/${area.slug}`} className={s.card}>
      {area.image && <Image src={area.image} alt={area.name} fill className={s.cardImage} sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw" />}
      <div className={s.cardLabel}>
        <DotIcon />
        <span className={s.cardName}>{area.name}</span>
      </div>
    </Link>
  )
}

export default function Areas({
  areas,
  sectionTitle = 'Best Areas for Luxury living in Dubai',
  ctaLabel = 'See all Areas',
  ctaHref = '/areas',
}: AreasProps) {
  if (areas.length === 0) return null

  return (
    <section className={s.section}>
      <Container>
        {/* Header */}
        <div className={s.header}>
          <h2 className={s.title} data-anim="heading" suppressHydrationWarning>{sectionTitle}</h2>
          <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
            {ctaLabel}
          </Link>
        </div>

        {/* Desktop: bento grid */}
        <div className={s.grid}>
          {areas.slice(0, 6).map((area, i) => (
            <div key={area.slug} className={`${s.gridItem} ${s[`gridItem${i + 1}`]}`}>
              <AreaCard area={area} />
            </div>
          ))}
        </div>
      </Container>

      {/* Tablet / Mobile: Swiper */}
      <div className={s.swiperWrap}>
        <Swiper
          slidesPerView="auto"
          spaceBetween={12}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          className={s.swiper}
        >
          {areas.map(area => (
            <SwiperSlide key={area.slug} className={s.swiperSlide}>
              <AreaCard area={area} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Container>
        {/* CTA button for tablet/mobile */}
        <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnMobile}`}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
