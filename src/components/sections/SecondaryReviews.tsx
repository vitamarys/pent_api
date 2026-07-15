'use client'

import Container from '@/components/ui/Container'
import s from './SecondaryReviews.module.scss'

interface Props {
  title?: string
}

export default function SecondaryReviews({ title }: Props) {
  if (!title) return null

  return (
    <section className={s.section}>
      <Container>
        <h2 className={s.title}>{title}</h2>
      </Container>
    </section>
  )
}
