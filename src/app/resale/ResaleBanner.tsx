'use client'

import { useState } from 'react'
import Image from 'next/image'
import PopConsultation from '@/components/ui/PopConsultation'
import s from './ResaleBanner.module.scss'

export interface ResaleBannerProps {
  image: string
  title: string
  description?: string
  buttonText?: string
  align?: 'left' | 'right'
}

export default function ResaleBanner({
  image,
  title,
  description,
  buttonText = 'Learn more',
  align = 'left',
}: ResaleBannerProps) {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <div className={`${s.banner} ${align === 'right' ? s.bannerRight : ''}`}>
        <Image src={image} alt={title} fill className={s.bannerImg} sizes="(max-width: 768px) 100vw, 50vw" />

        <div className={s.textPanel}>
          <div className={s.textContent}>
            <p className={s.title}>{title}</p>
            {description && <p className={s.description}>{description}</p>}
          </div>
          <button type="button" className={s.button} onClick={() => setPopupOpen(true)}>
            {buttonText}
          </button>
        </div>
      </div>

      <PopConsultation open={popupOpen} onClose={() => setPopupOpen(false)} />
    </>
  )
}
