'use client'

import { useState, useRef, useEffect } from 'react'
import s from './SecondaryDetails.module.scss'

interface Props {
  html: string
  readMoreText: string
  readLessText: string
}

const COLLAPSED_HEIGHT = Math.round(1.4 * 16 * 8) // 8 lines at 16px font

export function DescriptionExpander({ html, readMoreText, readLessText }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [fullHeight, setFullHeight] = useState(0)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (innerRef.current) {
      setFullHeight(innerRef.current.scrollHeight)
    }
  }, [html])

  const needsToggle = fullHeight > COLLAPSED_HEIGHT

  return (
    <div className={s.descBlock}>
      <div
        className={s.desc}
        style={{
          maxHeight: !needsToggle
            ? undefined
            : expanded
              ? `${fullHeight}px`
              : `${COLLAPSED_HEIGHT}px`,
        }}
      >
        <div ref={innerRef} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {needsToggle && !expanded && <div className={s.descFade} />}
      {needsToggle && (
        <button className={s.toggleBtn} onClick={() => setExpanded((v) => !v)}>
          {expanded ? readLessText : readMoreText}
          <span className={s.toggleIcon}>{expanded ? '−' : '+'}</span>
        </button>
      )}
    </div>
  )
}
