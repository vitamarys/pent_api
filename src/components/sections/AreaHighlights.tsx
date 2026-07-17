'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import s from './AreaHighlights.module.scss'

export interface AreaHighlightItem {
  title: string
  description: string
  image: string
}

export interface AreaHighlightsProps {
  sectionTitle?: string
  items: AreaHighlightItem[]
}

export default function AreaHighlights({
  sectionTitle = 'Highlights',
  items = [],
}: AreaHighlightsProps) {
  const [active, setActive] = useState(0)
  const activeItem = items[active]

  if (items.length === 0) return null

  return (
    <section className={s.section}>
      <Container>
      <div className={s.inner}>

        {/* ── Image (tablet/mobile: top, desktop: right) ── */}
        <div className={s.imagePanel}>
          {activeItem?.image && (
            <img
              key={active}
              src={activeItem.image}
              alt={activeItem.title}
              className={s.image}
            />
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className={s.sidebar}>
          <h2 className={s.title}>{sectionTitle}</h2>

          <ul className={s.list}>
            {items.map((item, i) => {
              const isOpen = i === active
              return (
                <li key={i} className={`${s.item} ${isOpen ? s.itemActive : ''}`}>
                  <button
                    className={s.itemHeader}
                    onClick={() => setActive(i)}
                    aria-expanded={isOpen}
                  >
                    <span className={s.itemTitle}>{item.title}</span>
                    <span className={s.icon}>{isOpen ? '×' : '+'}</span>
                  </button>
                  {isOpen && item.description && (
                    <p className={s.itemDesc}>{item.description}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

      </div>
      </Container>
    </section>
  )
}
