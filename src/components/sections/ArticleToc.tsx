'use client'

import s from './ArticleBody.module.scss'

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface ArticleTocProps {
  headings: TocHeading[]
}

export default function ArticleToc({ headings }: ArticleTocProps) {
  if (!headings.length) return null

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Build numbered TOC: h2 = top-level, h3 = sub-item
  const items: Array<{ heading: TocHeading; h2Index: number; h3Index: number }> = []
  let h2Count = 0
  let h3Count = 0

  for (const heading of headings) {
    if (heading.level === 2) {
      h2Count++
      h3Count = 0
      items.push({ heading, h2Index: h2Count, h3Index: 0 })
    } else if (heading.level === 3) {
      h3Count++
      items.push({ heading, h2Index: h2Count, h3Index: h3Count })
    }
  }

  return (
    <div className={s.toc}>
      <p className={s.tocTitle}>Page content</p>
      <nav className={s.tocNav}>
        {items.map(({ heading, h2Index, h3Index }, i) => {
          const label =
            h3Index > 0
              ? `${h2Index}.${h3Index}`
              : `${h2Index}.`
          const isSub = h3Index > 0

          return (
            <button
              key={i}
              className={[s.tocItem, isSub ? s.tocItemSub : ''].join(' ')}
              onClick={() => scrollTo(heading.id)}
            >
              <span className={s.tocNum}>{label}</span>
              <span className={s.tocText}>{heading.text}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
