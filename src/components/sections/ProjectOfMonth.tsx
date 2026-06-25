'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import Container from '@/components/ui/Container'
import s from './ProjectOfMonth.module.scss'
import 'swiper/css'

export interface ProjectOfMonthItem {
  slug: string
  title: string
  location?: string
  description?: string
  priceRange?: string
  handover?: string
  numberOfUnits?: number
  images?: string[]
}

interface ProjectOfMonthProps {
  projects: ProjectOfMonthItem[]
  sectionTitle?: string
  ctaLabel?: string
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

function CardStats({ project, mobile }: { project: ProjectOfMonthItem; mobile?: boolean }) {
  return (
    <div className={mobile ? s.statsMobile : s.statsRow}>
      {project.priceRange && (
        <div className={mobile ? s.statRowItem : s.stat}>
          <span className={s.statLabel}>Price range</span>
          <span className={s.statValue}>{project.priceRange}</span>
        </div>
      )}
      {project.handover && (
        <div className={mobile ? s.statRowItem : s.stat}>
          <span className={s.statLabel}>Handover</span>
          <span className={s.statValue}>{project.handover}</span>
        </div>
      )}
      {project.numberOfUnits !== undefined && (
        <div className={mobile ? s.statRowItem : s.stat}>
          <span className={s.statLabel}>Number of Units</span>
          <span className={s.statValue}>{project.numberOfUnits}</span>
        </div>
      )}
    </div>
  )
}

/* ── Image slider for desktop featured card ── */
function ImageSlider({ images, title }: { images: string[]; title: string }) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const hasMany = images.length > 1

  return (
    <div className={s.imageWrap}>
      <Swiper
        onSwiper={sw => { swiperRef.current = sw }}
        onSlideChange={sw => setActiveImg(sw.activeIndex)}
        className={s.swiper}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i} className={s.swiperSlide}>
            <img src={src} alt={title} className={s.image} />
          </SwiperSlide>
        ))}
      </Swiper>

      {hasMany && (
        <>
          <button
            className={`${s.imgArrow} ${s.imgArrowPrev}`}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
          <button
            className={`${s.imgArrow} ${s.imgArrowNext}`}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>

          <div className={s.imgPagination}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${s.imgDot} ${i === activeImg ? s.imgDotActive : ''}`}
                onClick={() => swiperRef.current?.slideTo(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function ProjectOfMonth({
  projects,
  sectionTitle = 'Project of the month',
  ctaLabel = 'Learn more',
}: ProjectOfMonthProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (projects.length === 0) return null

  const current = projects[activeIndex]
  const showNav = projects.length > 1

  const goPrev = () => setActiveIndex(i => (i - 1 + projects.length) % projects.length)
  const goNext = () => setActiveIndex(i => (i + 1) % projects.length)

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <h2 className={s.title}>{sectionTitle}</h2>

          {showNav && (
            <div className={s.navGroup}>
              <button className={s.arrowBtn} onClick={goPrev} aria-label="Previous project">
                <ChevronLeftIcon />
              </button>
              <button className={s.arrowBtn} onClick={goNext} aria-label="Next project">
                <ChevronRightIcon />
              </button>
            </div>
          )}
        </div>

        {/* ── Desktop: featured side-by-side ── */}
        <div className={s.featured}>
          <ImageSlider images={current.images ?? []} title={current.title} />

          <div className={s.panel}>
            <div className={s.panelTop}>
              <p className={s.projectTitle}>{current.title}</p>
              {current.location && <p className={s.location}>{current.location}</p>}
              {current.description && <p className={s.description}>{current.description}</p>}
            </div>
            <div className={s.panelBottom}>
              <CardStats project={current} />
              <Link href={`/project/${current.slug}`} className={s.ctaBtn}>{ctaLabel}</Link>
            </div>
          </div>
        </div>

        {/* ── Tablet / Mobile: vertical cards scroll track ── */}
        <div className={s.scrollTrack}>
          {projects.map(project => (
            <Link key={project.slug} href={`/project/${project.slug}`} className={s.scrollCard}>
              <div className={s.scrollCardImage}>
                {project.images?.[0] ? (
                  <img src={project.images[0]} alt={project.title} className={s.scrollCardImg} />
                ) : (
                  <div className={s.imgPlaceholder} />
                )}
              </div>
              <div className={s.scrollCardPanel}>
                <div className={s.scrollCardTop}>
                  <p className={s.projectTitle}>{project.title}</p>
                  {project.location && <p className={s.location}>{project.location}</p>}
                  {project.description && <p className={s.description}>{project.description}</p>}
                </div>
                <div className={s.scrollCardBottom}>
                  <div className={s.statsDivider} />
                  <CardStats project={project} mobile />
                  <div className={s.ctaBtn}>{ctaLabel}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
