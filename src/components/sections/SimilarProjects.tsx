'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import Container from '@/components/ui/Container'
import { formatCompactPrice } from '@/lib/utils'
import { useDragScroll } from '@/hooks/useDragScroll'
import s from './SimilarProjects.module.scss'
import 'swiper/css'

export interface SimilarProjectItem {
  slug: string
  title: string
  location?: string
  developer?: string
  handover?: string
  priceFrom?: number
  propertyTypes?: string[]
  images?: string[]
}

interface SimilarProjectsProps {
  projects: SimilarProjectItem[]
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
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

function ProjectCard({ project }: { project: SimilarProjectItem }) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const images = project.images ?? []
  const hasGallery = images.length > 1

  return (
    <Link href={`/projects/${project.slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {images.length > 0 ? (
          <Swiper
            onSwiper={swiper => { swiperRef.current = swiper }}
            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            className={s.swiper}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className={s.slide}>
                <img src={img} alt={project.title} className={s.cardImg} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className={s.imgPlaceholder} />
        )}

        <div className={s.cardOverlay}>
          <div className={s.topRow}>
            <div className={s.tags}>
              {project.propertyTypes?.map(type => (
                <span key={type} className={s.tag}>{type}</span>
              ))}
            </div>
            <button
              className={s.favBtn}
              onClick={e => e.preventDefault()}
              aria-label="Add to favorites"
            >
              <HeartIcon />
            </button>
          </div>

          {hasGallery && (
            <>
              <div className={s.galNav}>
                <button
                  className={s.galBtn}
                  onClick={e => { e.preventDefault(); swiperRef.current?.slidePrev() }}
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  className={s.galBtn}
                  onClick={e => { e.preventDefault(); swiperRef.current?.slideNext() }}
                  aria-label="Next image"
                >
                  <ChevronRightIcon />
                </button>
              </div>
              <div className={s.pagination}>
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`${s.paginationBar} ${i === activeIndex ? s.paginationBarActive : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={s.cardCart}>
        <div className={s.cardDetails}>
          <div className={s.cardInfo}>
            <div className={s.titleRow}>
              <span className={s.cardDot} />
              <p className={s.cardTitle}>{project.title}</p>
            </div>
            {project.location && (
              <p className={s.cardLocation}>{project.location}</p>
            )}
          </div>

          {(project.developer || project.handover) && (
            <div className={s.cardMeta}>
              {project.developer && (
                <span className={s.cardMetaText}>{project.developer}</span>
              )}
              {project.developer && project.handover && (
                <span className={s.cardMetaDot} />
              )}
              {project.handover && (
                <span className={s.cardMetaText}>{project.handover}</span>
              )}
            </div>
          )}
        </div>

        {project.priceFrom !== undefined && (
          <div className={s.cardPriceRow}>
            <p className={s.cardPrice}>from {formatCompactPrice(project.priceFrom)}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function SimilarProjects({
  projects,
  sectionTitle = 'Similar Projects',
  ctaLabel = 'See all projects',
  ctaHref = '/projects',
}: SimilarProjectsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const SCROLL_STEP = 428 + 16
  const drag = useDragScroll(trackRef)

  const scrollPrev = () => trackRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' })
  const scrollNext = () => trackRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' })

  if (projects.length === 0) return null

  const showArrows = projects.length >= 4

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <div className={s.titleWrap}>
            <h2 className={s.title}>{sectionTitle}</h2>
          </div>

          <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
            {ctaLabel}
          </Link>

          {showArrows && (
            <div className={s.navArrows}>
              <button className={s.arrowBtn} onClick={scrollPrev} aria-label="Previous projects">
                <ChevronLeftIcon />
              </button>
              <button className={s.arrowBtn} onClick={scrollNext} aria-label="Next projects">
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
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnBottom}`}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
