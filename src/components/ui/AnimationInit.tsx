'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Initialises scroll-triggered animations on every page navigation.
 *
 * Uses IntersectionObserver (threshold 0.15) + MutationObserver to catch
 * elements added after the initial render (lazy components, Suspense, etc.).
 * Adds `.is-in-view` class to trigger CSS transitions in _animations.scss.
 */
export default function AnimationInit() {
  const pathname = usePathname()

  useEffect(() => {
    const observed = new WeakSet<Element>()

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    const observeElement = (el: Element) => {
      if (observed.has(el)) return
      observed.add(el)
      io.observe(el)
    }

    const initEl = (el: Element) => {
      // stagger items are controlled by their container
      if (el.getAttribute('data-anim') === 'stagger') return
      observeElement(el)
    }

    const initStagger = (container: Element) => {
      if (observed.has(container)) return
      const step = parseInt((container as HTMLElement).dataset.staggerStep ?? '100')
      container.querySelectorAll<HTMLElement>('[data-anim="stagger"]').forEach((item, i) => {
        item.style.setProperty('--stagger-delay', `${i * step}ms`)
      })
      observeElement(container)
    }

    const scanNode = (root: Element | Document) => {
      root.querySelectorAll('[data-anim]:not([data-anim="stagger"])').forEach(initEl)
      root.querySelectorAll('[data-anim-stagger]').forEach(initStagger)
    }

    // MutationObserver: catches elements added after initial render
    // (client components, Suspense boundaries, lazy data fetching)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return
          const el = node as Element

          if (el.matches('[data-anim]:not([data-anim="stagger"])')) initEl(el)
          if (el.matches('[data-anim-stagger]')) initStagger(el)

          // also scan descendants of the added node
          scanNode(el)
        })
      })
    })

    // Double rAF: waits for React hydration to complete before any observation.
    // MutationObserver starts only after the initial scan to avoid adding
    // `is-in-view` during hydration (which would cause a server/client mismatch).
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scanNode(document)
        mo.observe(document.body, { childList: true, subtree: true })
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      mo.disconnect()
      // Remove is-in-view so the next render starts with a clean DOM
      document.querySelectorAll<Element>('[data-anim].is-in-view, [data-anim-stagger].is-in-view')
        .forEach(el => el.classList.remove('is-in-view'))
    }
  }, [pathname])

  return null
}
