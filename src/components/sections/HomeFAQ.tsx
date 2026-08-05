import Container from '@/components/ui/Container'
import { FAQRow } from './HomeFAQRow'
import s from './HomeFAQ.module.scss'

interface FAQItem {
  title: string
  answer: string
}

interface HomeFAQProps {
  title?: string
  questions?: FAQItem[]
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
