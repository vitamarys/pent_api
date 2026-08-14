'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Container from '@/components/ui/Container'
import s from './ProjectBanner.module.scss'
const PopConsultation = dynamic(() => import('@/components/ui/PopConsultation'))

interface Props {
  title?: string
  description?: string
  ctaLabel?: string
  image?: { url: string }
  agentId?: string
}

export default function ProjectBanner({
  title,
  description,
  ctaLabel,
  image,
  agentId,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
    <section className={s.section}>
      <Container>
        <div className={s.banner}>
          {image && (
            <div className={s.bgWrap}>
              <Image src={image.url} alt={title ?? ''} fill className={s.bgImage} sizes="100vw" />
              <div className={s.overlay} />
            </div>
          )}

          <div className={s.content}>
            {title && <h2 className={s.title}>{title}</h2>}
            {description && <p className={s.description}>{description}</p>}
            {ctaLabel && (
              <button className={s.ctaBtn} onClick={() => setOpen(true)}>
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
    <PopConsultation open={open} onClose={() => setOpen(false)} agentId={agentId} />
    </>
  )
}
