'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import s from './SecondaryHero.module.scss'

interface Props {
  subtitle?: string
  images?: { url: string }[]
  breadcrumb?: { label: string; href?: string }[]
  tourUrl?: string
  videoUrl?: string
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 15L12.5 10L7.5 5" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconPhotos() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M0.75 14.75L6.75 8.75M6.75 14.75H0.75V8.75M14.75 0.75L8.75 6.75M8.75 0.75H14.75V6.75" stroke="white" strokeWidth="1.5"/>
    </svg>
  )
}

function IconTour() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.75 0.75H0.75V3.75M15.75 0.75H18.75V3.75M3.75 18.75H0.75V15.75M15.75 18.75H18.75V15.75M5.25 8.25L9.75 10.7495M9.75 10.7495C9.75 10.7495 13.5137 8.6992 14.25 8.25M9.75 10.7495V15.25M10.2645 15.4413L14.2645 13.0413C14.5657 12.8606 14.75 12.5351 14.75 12.1838V8.3162C14.75 7.9649 14.5657 7.63942 14.2645 7.4587L10.2645 5.0587C9.9478 4.86869 9.5522 4.86869 9.2355 5.0587L5.2355 7.4587C4.9343 7.63942 4.75 7.9649 4.75 8.3162V12.1838C4.75 12.5351 4.9343 12.8606 5.2355 13.0413L9.2355 15.4413C9.5522 15.6313 9.9478 15.6313 10.2645 15.4413Z" stroke="white" strokeWidth="1.5"/>
    </svg>
  )
}

function IconPlay() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
      <path d="M8.50193 5.0527C9.09566 5.44852 9.09565 6.32098 8.50191 6.7168L2.30469 10.8482C1.64014 11.2912 0.75 10.8148 0.75 10.0161L0.75 1.75315C0.75 0.954445 1.64016 0.478055 2.30471 0.921103L8.50193 5.0527Z" fill="white" stroke="white" strokeWidth="1.5"/>
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconArrowWhite() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function SecondaryHero({ subtitle, images = [], breadcrumb, tourUrl, videoUrl }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const hasImages = images.length > 0

  function prev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }
  function next() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, closeLightbox])

  return (
    <>
      <section className={s.section}>
        {/* ── Breadcrumb + Title ── */}
        <div className={s.topBar}>
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M17.9994 17.5402C17.9994 17.9369 17.6759 18.2607 17.2795 18.2607H14.8259C14.4295 18.2607 14.1059 17.9369 14.1059 17.5402V14.541C14.1059 13.9994 13.6632 13.5562 13.1221 13.5562H10.8773C10.3362 13.5562 9.89346 13.9994 9.89346 14.541V17.5402C9.89346 17.9369 9.56993 18.2607 9.17355 18.2607H6.71991C6.32352 18.2607 6 17.9369 6 17.5402L6 12.265C6 11.7887 6.16966 11.3787 6.50643 11.0421L10.778 6.766C11.451 6.09232 12.549 6.09232 13.222 6.766L17.4936 11.0416C17.8298 11.3782 18 11.7882 18 12.2645L17.9994 17.5402Z" fill="#1F1F1F" stroke="#1F1F1F" strokeWidth="1.5"/>
              </svg>
            </Link>
            {breadcrumb?.map((item, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <span className={s.breadcrumbSep}><IconChevronRight /></span>
                {item.href
                  ? <Link href={item.href}>{item.label}</Link>
                  : <span className={s.breadcrumbCurrent}>{item.label}</span>
                }
              </span>
            ))}
          </nav>
          {subtitle && <h1 className={s.title}>{subtitle}</h1>}
        </div>

        {/* ── Gallery ── */}
        <div className={s.gallery}>
          {hasImages ? (
            images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={subtitle ?? 'Property photo'}
                className={`${s.galleryImage} ${i === activeIndex ? s.galleryImageActive : ''}`}
              />
            ))
          ) : (
            <div className={s.galleryPlaceholder} />
          )}

          {/* Action buttons — top left */}
          <div className={s.actionBtns}>
            <button className={s.actionBtn} onClick={() => setLightboxOpen(true)} aria-label="View all photos">
              <span className={s.actionBtnIcon}><IconPhotos /></span>
              <span>{images.length} photos</span>
            </button>
            {tourUrl && (
              <a className={s.actionBtn} href={tourUrl} target="_blank" rel="noopener noreferrer" aria-label="3D tour">
                <span className={s.actionBtnIcon}><IconTour /></span>
                <span>3D tour</span>
              </a>
            )}
            {videoUrl && (
              <a className={s.actionBtn} href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Play video">
                <span className={s.actionBtnIcon}><IconPlay /></span>
                <span>Play video</span>
              </a>
            )}
          </div>

          {/* Arrow navigation — sides */}
          {images.length > 1 && (
            <div className={s.galleryArrows}>
              <button className={s.arrowBtn} onClick={prev} aria-label="Previous photo">
                <span className={s.arrowIconFlipped}><IconArrow /></span>
              </button>
              <button className={s.arrowBtn} onClick={next} aria-label="Next photo">
                <IconArrow />
              </button>
            </div>
          )}

          {/* Pagination lines */}
          {images.length > 1 && (
            <div className={s.pagination}>
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`${s.paginationLine} ${i === activeIndex ? s.paginationLineActive : ''}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className={s.lightbox} role="dialog" aria-modal="true">
          <div className={s.lightboxOverlay} onClick={closeLightbox} />
          <button className={s.lightboxClose} onClick={closeLightbox} aria-label="Close">
            <IconClose />
          </button>
          <span className={s.lightboxCounter}>{activeIndex + 1} / {images.length}</span>

          <div className={s.lightboxImg}>
            {hasImages && (
              <img src={images[activeIndex].url} alt={subtitle ?? 'Property photo'} />
            )}
          </div>

          {images.length > 1 && (
            <>
              <button className={`${s.lightboxArrow} ${s.lightboxArrowLeft}`} onClick={prev} aria-label="Previous">
                <span className={s.arrowIconFlipped}><IconArrowWhite /></span>
              </button>
              <button className={`${s.lightboxArrow} ${s.lightboxArrowRight}`} onClick={next} aria-label="Next">
                <IconArrowWhite />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
