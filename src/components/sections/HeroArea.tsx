'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Container from '@/components/ui/Container'
import s from './HeroArea.module.scss'

const PopConsultation = dynamic(() => import('@/components/ui/PopConsultation'))

export interface HeroAreaProps {
  title: string
  description: string
  image: string
  breadcrumb?: { label: string; href?: string }[]
  ctaLabel?: string
  ctaHref?: string
}

export default function HeroArea({
  title,
  description,
  image,
  breadcrumb = [],
  ctaLabel = 'Get Consultation',
}: HeroAreaProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className={s.section}>
        {/* Background */}
        {image && (
          <Image src={image} alt={title} fill className={s.bgImage} sizes="100vw" priority />
        )}

        {/* Top gradient overlay */}
        <div className={s.gradient} />

        {/* Content */}
        <div className={s.content}>
          <Container className={s.contentInner}>

            {/* Breadcrumbs */}
            <nav className={s.breadcrumb} aria-label="Breadcrumb">
              <Link href="/" className={s.breadcrumbLink}>
                <Image src="/icons/icon-home-w.svg" alt="Home" width={24} height={24} />
              </Link>
              {breadcrumb.map((item, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  <ChevronRight size={16} className={s.breadcrumbChevron} strokeWidth={1.5} />
                  {item.href ? (
                    <Link href={item.href} className={s.breadcrumbLink}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className={s.breadcrumbCurrent}>{item.label}</span>
                  )}
                </span>
              ))}
            </nav>

            {/* Info card */}
            <div className={s.card}>
              <div className={s.cardText}>
                <h1 className={s.title}>{title}</h1>
                <p className={s.description}>{description}</p>
              </div>
              <button className={s.ctaBtn} onClick={() => setOpen(true)}>
                {ctaLabel}
              </button>
            </div>

          </Container>
        </div>
      </section>
      <PopConsultation open={open} onClose={() => setOpen(false)} />
    </>
  )
}
