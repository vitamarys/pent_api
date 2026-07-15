import Container from '@/components/ui/Container'
import s from './HomeWhoWeAre.module.scss'

interface StatItem {
  title: string
  value: string
}

interface HomeWhoWeAreProps {
  title?: string
  description?: string
  buttonText?: string
  stats?: StatItem[]
  image?: { url: string }
}

export default function HomeWhoWeAre({
  title,
  description,
  buttonText,
  stats = [],
  image,
}: HomeWhoWeAreProps) {
  if (!title && !description && !image) return null

  return (
    <section className={s.section}>
      <Container>
        <div className={s.inner}>
          <div className={s.left}>
            {title && <h2 className={s.title}>{title}</h2>}
            {description && <p className={s.description}>{description}</p>}

            {stats.length > 0 && (
              <div className={s.statsGrid}>
                {stats.map((stat, i) => (
                  <div key={i} className={s.statItem}>
                    <span className={s.statValue}>{stat.value}</span>
                    <span className={s.statLabel}>{stat.title}</span>
                  </div>
                ))}
              </div>
            )}

            {buttonText && (
              <a href="/contact" className={s.ctaBtn}>
                {buttonText}
              </a>
            )}
          </div>

          {image?.url && (
            <div className={s.right}>
              <img src={image.url} alt={title ?? 'Who we are'} className={s.image} />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
