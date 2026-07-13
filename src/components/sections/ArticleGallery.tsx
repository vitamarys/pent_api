'use client'

import { useState } from 'react'
import s from './ArticleGallery.module.scss'

interface GalleryImage {
  url: string
  caption?: string
}

interface ArticleGalleryProps {
  images: GalleryImage[]
}

export default function ArticleGallery({ images }: ArticleGalleryProps) {
  const [current, setCurrent] = useState(0)

  if (!images.length) return null

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)
  const next = () => setCurrent((c) => (c + 1) % images.length)

  return (
    <div className={s.gallery}>
      <div className={s.imageWrap}>
        <img
          src={images[current].url}
          alt={images[current].caption || ''}
          className={s.image}
        />
        <div className={s.controls}>
          <button className={s.arrow} onClick={prev} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={s.arrow} onClick={next} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={s.pagination}>
          {images.map((_, i) => (
            <button
              key={i}
              className={[s.page, i === current ? s.pageActive : ''].join(' ')}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
