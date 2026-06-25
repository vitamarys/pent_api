import React from 'react'
import Container from '@/components/ui/Container'
import s from './ProjectBanner.module.scss'

interface Props {
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  image?: { url: string }
}

export default function ProjectBanner({
  title,
  description,
  ctaLabel,
  ctaHref = '#',
  image,
}: Props) {
  return (
    <section className={s.section}>
      <Container>
        <div className={s.banner}>
          {image && (
            <div className={s.bgWrap}>
              <img src={image.url} alt={title ?? ''} className={s.bgImage} />
              <div className={s.overlay} />
            </div>
          )}

          <div className={s.content}>
            {title && <h2 className={s.title}>{title}</h2>}
            {description && <p className={s.description}>{description}</p>}
            {ctaLabel && (
              <a href={ctaHref} className={s.ctaBtn}>
                {ctaLabel}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
