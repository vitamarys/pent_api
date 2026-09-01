'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import Container from '@/components/ui/Container'
import { useDisplayFormat } from '@/hooks/useDisplayFormat'
import { useDragScroll } from '@/hooks/useDragScroll'
import { useFavorites } from '@/hooks/useFavorites'
import s from './SimilarProjects.module.scss'
import 'swiper/css'

export interface SimilarProjectItem {
  id?: number
  slug: string
  title: string
  location?: string
  developer?: string
  handover?: string
  priceFrom?: number
  propertyTypes?: string[]
  images?: string[]
  href?: string
}

interface SimilarProjectsProps {
  projects: SimilarProjectItem[]
  sectionTitle?: string
  titleHighlight?: string
  ctaLabel?: string
  ctaHref?: string
}

interface FavProject {
  id: number
  slug: string
  title: string
  location?: string
  developer?: string
  handover?: string
  priceFrom?: number
  propertyTypes?: string[]
  images?: string[]
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

function ProjectCard({ project }: { project: SimilarProjectItem }) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { formatPrice } = useDisplayFormat()
  const images = project.images ?? []
  const hasGallery = images.length > 1

  const { isFavorite, toggle } = useFavorites<FavProject>('fav_projects')
  const active = project.id !== undefined ? isFavorite(project.id) : false

  function handleFav(e: React.MouseEvent) {
    e.preventDefault()
    if (project.id === undefined) return
    toggle({
      id: project.id,
      slug: project.slug,
      title: project.title,
      location: project.location,
      developer: project.developer,
      handover: project.handover,
      priceFrom: project.priceFrom,
      propertyTypes: project.propertyTypes,
      images,
    })
  }

  return (
    <Link href={project.href ?? `/projects/${project.slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {images.length > 0 ? (
          <Swiper
            onSwiper={swiper => { swiperRef.current = swiper }}
            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            className={s.swiper}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i} className={s.slide}>
                <Image src={img} alt={project.title} fill className={s.cardImg} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 428px" />
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
              onClick={handleFav}
              aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon active={active} />
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
            <p className={s.cardPrice}>from {formatPrice(project.priceFrom)}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function SimilarProjects({
  projects,
  sectionTitle = 'Similar Projects',
  titleHighlight,
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
            <h2 className={s.title}>
              {titleHighlight && sectionTitle?.includes(titleHighlight)
                ? <>
                    {sectionTitle.slice(0, sectionTitle.indexOf(titleHighlight))}
                    <span style={{ color: '#C19962' }}>{titleHighlight}</span>
                    {sectionTitle.slice(sectionTitle.indexOf(titleHighlight) + titleHighlight.length)}
                  </>
                : sectionTitle}
            </h2>
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
