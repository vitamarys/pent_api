'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/ui/Container'
import s from './ProjectAnchorNav.module.scss'

export interface AnchorNavItem {
  label: string
  id: string
}

interface Props {
  items: AnchorNavItem[]
}

export default function ProjectAnchorNav({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
  const [hidden,   setHidden]   = useState(false)

  // Mirror header scroll hide/show logic
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y > lastY && y > 80) setHidden(true)
      else if (y < lastY)      setHidden(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section via IntersectionObserver
  useEffect(() => {
    if (!items.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  if (!items.length) return null

  return (
    <nav className={`${s.nav} ${hidden ? s.hidden : ''}`}>
      <div className={s.bar}>
        <Container>
          <div className={s.inner}>
            {items.map((item) => (
              <button
                key={item.id}
                className={`${s.item} ${activeId === item.id ? s.active : ''}`}
                onClick={() => handleClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Container>
      </div>
    </nav>
  )
}
