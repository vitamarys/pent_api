import Container from '@/components/ui/Container'
import { AccordionList } from './AccordionList'
import s from './ProjectAccordion.module.scss'

export interface AccordionItem {
  title: string
  answer: string
}

export interface ProjectAccordionProps {
  sectionTitle?: string
  items: AccordionItem[]
}

export default function ProjectAccordion({
  sectionTitle = 'Frequently Asked Questions',
  items,
}: ProjectAccordionProps) {
  return (
    <section className={s.section}>
      <Container>
        <div className={s.inner}>
          <h2 className={s.sectionTitle}>{sectionTitle}</h2>
          <AccordionList items={items} />
        </div>
      </Container>
    </section>
  )
}
