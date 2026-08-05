'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { AccordionItem } from './ProjectAccordion'
import s from './ProjectAccordion.module.scss'

export function AccordionList({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <div className={s.list}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className={`${s.item} ${isOpen ? s.itemOpen : ''}`}>
            <button className={s.trigger} onClick={() => toggle(i)} aria-expanded={isOpen}>
              <span className={s.question}>{item.title}</span>
              <span className={s.icon}>
                {isOpen ? <X size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
              </span>
            </button>
            <div className={`${s.body} ${isOpen ? s.bodyOpen : ''}`}>
              <p className={s.answer}>{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
