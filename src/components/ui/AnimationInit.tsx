'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Initialises scroll-triggered animations on every page navigation.
 *
 * Watches [data-anim] and [data-anim-stagger] elements via IntersectionObserver
 * (threshold 0.15, fires once) and adds the `.is-in-view` class to trigger
 * CSS transitions defined in src/styles/_animations.scss.
 *
 * Include once in the root layout — it renders nothing to the DOM.
 */
export default function AnimationInit() {
  const pathname = usePathname()

  useEffect(() => {
    let observer: IntersectionObserver

    const init = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in-view')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.15 },
      )

      // Observe individual elements (skip stagger children — managed by container)
      document
        .querySelectorAll('[data-anim]:not([data-anim="stagger"])')
        .forEach((el) => observer.observe(el))

      // Stagger containers: set per-child delay, then observe the container
      document.querySelectorAll('[data-anim-stagger]').forEach((container) => {
        const step = parseInt(
          (container as HTMLElement).dataset.staggerStep ?? '100',
        )
        container
          .querySelectorAll<HTMLElement>('[data-anim="stagger"]')
          .forEach((item, i) => {
            item.style.setProperty('--stagger-delay', `${i * step}ms`)
          })
        observer.observe(container)
      })
    }

    // rAF ensures Next.js has flushed new page content into the DOM
    const raf = requestAnimationFrame(init)

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
