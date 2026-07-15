'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import s from './HomeFAQ.module.scss'

interface FAQItem {
  title: string
  answer: string
}

interface HomeFAQProps {
  title?: string
  questions?: FAQItem[]
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

function FAQRow({ item }: { item: FAQItem }) {
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

export default function HomeFAQ({ title, questions = [] }: HomeFAQProps) {
  const items = questions.filter(q => q.title && q.answer)
  if (!items.length && !title) return null

  return (
    <section className={s.section}>
      <Container>
        {title && <h2 className={s.title}>{title}</h2>}
        <div className={s.list}>
          {items.map((item, i) => (
            <FAQRow key={i} item={item} />
          ))}
        </div>
      </Container>
    </section>
  )
}
