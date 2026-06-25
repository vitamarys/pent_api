'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { getStrapiImageUrl, formatCompactPrice } from '@/lib/utils'
import s from './DeveloperProjects.module.scss'

export interface DeveloperProjectItem {
  title: string
  slug: string
  location: string
  developerName: string
  handover?: string
  priceFrom?: number
  images: { url: string }[]
  propertyTypes?: string[]
}

interface DeveloperProjectsProps {
  developerName: string
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
  projects: DeveloperProjectItem[]
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

function ProjectCard({ project }: { project: DeveloperProjectItem }) {
  const [imgIdx, setImgIdx] = useState(0)
  const images = project.images.length > 0 ? project.images : []
  const total = images.length

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault()
    setImgIdx(i => (i - 1 + total) % total)
  }
  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault()
    setImgIdx(i => (i + 1) % total)
  }

  const imgSrc = images[imgIdx] ? getStrapiImageUrl(images[imgIdx].url) : ''

  return (
    <Link href={`/project/${project.slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {imgSrc && (
          <img src={imgSrc} alt={project.title} className={s.cardImage} />
        )}
        <div className={s.cardOverlay}>
          <div className={s.topRow}>
            <div className={s.tags}>
              {project.propertyTypes?.map((pt, i) => (
                <span key={i} className={s.tag}>{pt}</span>
              ))}
            </div>
            <button className={s.favBtn} onClick={e => e.preventDefault()} aria-label="Add to favorites">
              <HeartIcon />
            </button>
          </div>
          {total > 1 && (
            <div className={s.imageNavRow}>
              <button className={s.imageNavBtn} onClick={prevImg} aria-label="Previous image">
                <ChevronLeft />
              </button>
              <button className={s.imageNavBtn} onClick={nextImg} aria-label="Next image">
                <ChevronRight />
              </button>
            </div>
          )}
          {total > 1 && (
            <div className={s.paginationRow}>
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`${s.paginationDot} ${i === imgIdx ? s.activeDot : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={s.cardCart}>
        <div className={s.cardDetails}>
          <div className={s.propertyDetails}>
            <div className={s.propertyInfo}>
              <div className={s.cardTitleRow}>
                <div className={s.cardDot} />
                <span className={s.cardTitle}>{project.title}</span>
              </div>
              <p className={s.cardLocation}>{project.location}</p>
            </div>
            <div className={s.specs}>
              <span className={s.specText}>{project.developerName}</span>
              {project.handover && (
                <>
                  <div className={s.specSep} />
                  <span className={s.specText}>{project.handover}</span>
                </>
              )}
            </div>
          </div>
          <div className={s.priceRow}>
            <span className={s.price}>
              {project.priceFrom ? `from ${formatCompactPrice(project.priceFrom)}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function DeveloperProjects({
  developerName,
  sectionTitle,
  ctaLabel,
  ctaHref,
  projects,
}: DeveloperProjectsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const SCROLL_STEP = 428 + 16

  const scrollPrev = () =>
    trackRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' })
  const scrollNext = () =>
    trackRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' })

  const label = ctaLabel || 'See all projects'
  const href = ctaHref || '#'

  return (
    <section className={s.section}>
      <Container>
        <div className={s.header}>
          <div className={s.titleWrap}>
            <h2 className={s.title}>
              {sectionTitle ?? (
                <>{'Projects by '}<span className={s.titleHighlight}>{developerName.toUpperCase()}</span></>
              )}
            </h2>
          </div>

          <a href={href} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
            {label}
          </a>

          <div className={s.navArrows}>
            <button className={s.arrowBtn} onClick={scrollPrev} aria-label="Previous projects">
              <ChevronLeft />
            </button>
            <button className={s.arrowBtn} onClick={scrollNext} aria-label="Next projects">
              <ChevronRight />
            </button>
          </div>
        </div>
      </Container>

      <Container>
        <div className={s.scrollTrack} ref={trackRef}>
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>

      <Container>
        <a href={href} className={`${s.ctaBtn} ${s.ctaBtnBottom}`}>
          {label}
        </a>
      </Container>
    </section>
  )
}
