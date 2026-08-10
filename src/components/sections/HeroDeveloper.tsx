'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import Container from '@/components/ui/Container'
import s from './HeroDeveloper.module.scss'

const PopConsultation = dynamic(() => import('@/components/ui/PopConsultation'))

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface HeroDeveloperStatItem {
  label: string
  value: string
}

export interface HeroDeveloperProps {
  name: string
  description: string
  bgImage: string
  logo?: string
  stats?: HeroDeveloperStatItem[]
  ctaLabel?: string
  ctaHref?: string
  breadcrumb?: BreadcrumbItem[]
}

export default function HeroDeveloper({
  name,
  description,
  bgImage,
  logo,
  stats = [],
  ctaLabel = 'Get Consultation',
  ctaHref = '#',
  breadcrumb = [],
}: HeroDeveloperProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
    <section className={s.hero}>
      {/* Full-bleed bg — desktop only */}
      <div className={s.bg} style={{ backgroundImage: `url(${bgImage})` }} />

      {/* Image area: stacked img (tablet/mobile) + gradient + breadcrumbs */}
      <div className={s.imageArea}>
        {bgImage && <Image src={bgImage} alt="" fill className={s.bgImg} sizes="100vw" priority />}
        <div className={s.overlayTop} />
        <div className={s.gradient} />
        <Container>
          <nav className={s.breadcrumb}>
            <Link href="/"><Image src="/icons/icon-home-w.svg" alt="Home" width={24} height={24} /></Link>
            {breadcrumb.map((item, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <span className={s.separator}><ChevronRight size={16} /></span>
                {item.href
                  ? <Link href={item.href}>{item.label}</Link>
                  : <span className={s.current}>{item.label}</span>
                }
              </span>
            ))}
          </nav>
        </Container>
      </div>

      {/* Card area */}
      <Container>
        <div className={s.contentArea}>
          <div className={s.card}>
            {logo && (
              <div className={s.logoWrap}>
                <Image src={logo} alt={name} width={136} height={88} className={s.logo} />
              </div>
            )}

            <div className={s.infoContainer}>
              <div className={s.textContent}>
                <h1 className={s.name}>{name}</h1>
                <p className={s.description}>{description}</p>
              </div>

              {stats.length > 0 && (
                <div className={s.statsRow}>
                  {stats.map((stat, i) => (
                    <React.Fragment key={i}>
                      <div className={s.statItem}>
                        <span className={s.statLabel}>{stat.label}</span>
                        <span className={s.statValue}>{stat.value}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}

              <button className={s.ctaBtn} onClick={() => setOpen(true)}>{ctaLabel}</button>
            </div>
          </div>
        </div>
      </Container>
    </section>
      <PopConsultation open={open} onClose={() => setOpen(false)} />
    </>
  )
}
