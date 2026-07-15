'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import s from './SecondaryAmenities.module.scss'

interface Props {
  title?: string
  seeMoreButton?: string
  image?: { url: string } | null
  features?: Array<{ value: string }>
}

export default function SecondaryAmenities({
  title = 'Amenities',
  seeMoreButton = 'See more',
  image,
  features = [],
}: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!features.length && !title) return null

  const imgSrc = image?.url || '/images/Image.png'
  const VISIBLE = 7
  const visibleFeatures = features.slice(0, VISIBLE)

  return (
    <>
      <section className={s.section}>
        {title && <h2 className={s.title}>{title}</h2>}

        <div className={s.body}>
          {/* Left: list + button */}
          <div className={s.listCol}>
            {visibleFeatures.length > 0 && (
              <ul className={s.list}>
                {visibleFeatures.map((feat, i) => (
                  <li
                    key={i}
                    className={`${s.item} ${i === visibleFeatures.length - 1 ? s.itemLast : ''}`}
                  >
                    <span className={s.dot} aria-hidden="true" />
                    <span className={s.itemText}>{feat.value}</span>
                  </li>
                ))}
              </ul>
            )}

            {features.length > VISIBLE && (
              <button className={s.seeMoreBtn} onClick={() => setOpen(true)}>
                {seeMoreButton}
              </button>
            )}
          </div>

          {/* Right: image */}
          <div className={s.imageCol}>
            <img src={imgSrc} alt={title} className={s.image} />
          </div>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div className={s.modalOverlay} onClick={() => setOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalTitleArea}>
              <h3 className={s.modalTitle}>{title}</h3>
            </div>
            <button className={s.modalClose} onClick={() => setOpen(false)} aria-label="Close">
              <X size={24} />
            </button>
            <div className={s.modalList}>
              {features.map((feat, i) => (
                <div key={i} className={s.modalItem}>
                  <span className={s.modalItemLabel}>{feat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
