'use client'

import { useState } from 'react'
import s from './SecondaryDetails.module.scss'

interface Props {
  html: string
  readMoreText: string
  readLessText: string
}

export function DescriptionExpander({ html, readMoreText, readLessText }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={s.descBlock}>
      <div className={`${s.desc} ${expanded ? s.descExpanded : ''}`}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {!expanded && <div className={s.descFade} />}
      <button className={s.toggleBtn} onClick={() => setExpanded((v) => !v)}>
        {expanded ? readLessText : readMoreText}
        <span className={s.toggleIcon}>{expanded ? '−' : '+'}</span>
      </button>
    </div>
  )
}
