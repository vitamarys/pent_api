import Container from '@/components/ui/Container'
import s from './HomeAwards.module.scss'

interface AwardItem {
  title: string
  description: string
  image?: { url: string }
}

interface HomeAwardsProps {
  title?: string
  award?: AwardItem[]
}

export default function HomeAwards({ title, award = [] }: HomeAwardsProps) {
  if (!award.length && !title) return null

  return (
    <section className={s.section}>
      <Container>
        {title && <h2 className={s.title}>{title}</h2>}
        <div className={s.track}>
          {award.map((item, i) => (
            <div key={i} className={s.card}>
              {item.image?.url && (
                <div className={s.cardImageWrap}>
                  <img src={item.image.url} alt={item.title} className={s.cardImage} />
                </div>
              )}
              <div className={s.cardBody}>
                <p className={s.cardTitle}>{item.title}</p>
                {item.description && (
                  <p className={s.cardDescription}>{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
