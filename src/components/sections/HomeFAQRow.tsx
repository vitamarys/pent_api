'use client'

import { useState } from 'react'
import s from './HomeFAQ.module.scss'

interface FAQItem {
  title: string
  answer: string
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={`${s.chevron} ${open ? s.chevronOpen : ''}`}
    >
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FAQRow({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`${s.row} ${open ? s.rowOpen : ''}`}>
      <button className={s.question} onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span>{item.title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className={s.answer}>
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  )
}
