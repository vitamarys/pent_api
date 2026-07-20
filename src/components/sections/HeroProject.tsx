'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import PopConsultation from '@/components/ui/PopConsultation'
import type { AgentInfo } from '@/components/sections/ProjectForm'
import s from './HeroProject.module.scss'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface HeroProjectProps {
  title: string
  location: string
  description: string
  image: string
  startingPrice: string
  handover: string
  numberOfUnits: string | number
  breadcrumb?: BreadcrumbItem[]
  agent?: AgentInfo
}

export default function HeroProject({
  title,
  location,
  description,
  image,
  startingPrice,
  handover,
  numberOfUnits,
  breadcrumb = [],
  agent,
}: HeroProjectProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className={s.hero} style={{ backgroundImage: `url(${image})` }}>

        {/* Image area — controls height per breakpoint */}
        <div className={s.imageArea}>
          <div className={s.imageBg} style={{ backgroundImage: `url(${image})` }} />
          <Container>
            <nav className={s.breadcrumb}>
              <Link href="/"><Home size={16} /></Link>
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

        {/* Panel */}
        <Container>
          <div className={s.panel}>
            <div className={s.panelInner}>

              {/* Left */}
              <div className={s.textContainer}>
                <div className={s.titleGroup}>
                  <h1 className={s.title}>{title}</h1>
                  <div className={s.location}>
                    <span className={s.dot} />
                    <span>{location}</span>
                  </div>
                </div>
                <p className={s.description}>{description}</p>
              </div>

              {/* Right */}
              <div className={s.infoContainer}>
                <div className={s.statsRow}>
                  <div className={s.statDivider} />
                  <div className={s.statItem}>
                    <p className={s.statLabel}>Starting Price</p>
                    <p className={s.statValue}>{startingPrice}</p>
                  </div>
                  <div className={s.statDivider} />
                  <div className={s.statItem}>
                    <p className={s.statLabel}>Handover</p>
                    <p className={s.statValue}>{handover}</p>
                  </div>
                  <div className={s.statDivider} />
                  <div className={s.statItem}>
                    <p className={s.statLabel}>Number of Units</p>
                    <p className={s.statValue}>{numberOfUnits}</p>
                  </div>
                </div>
                <button className={s.cta} onClick={() => setOpen(true)}>Check Availability</button>
              </div>

            </div>
          </div>
        </Container>
      </section>

      <PopConsultation
        open={open}
        onClose={() => setOpen(false)}
        agent={agent}
      />
    </>
  )
}
