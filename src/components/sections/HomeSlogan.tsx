import Container from '@/components/ui/Container'
import s from './HomeSlogan.module.scss'

interface HomeSloganProps {
  header?: string
  description?: string
}

function parseItalic(text: string): React.ReactNode[] {
  const parts = text.split(/(\*[^*]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

export default function HomeSlogan({ header, description }: HomeSloganProps) {
  if (!header && !description) return null

  return (
    <section className={s.section}>
      <Container>
        <div className={s.inner}>
          {header && (
            <h2 className={s.heading} data-anim="heading" suppressHydrationWarning>{parseItalic(header)}</h2>
          )}
          {description && (
            <p className={s.description} data-anim="text" suppressHydrationWarning>{description}</p>
          )}
        </div>
      </Container>
    </section>
  )
}
