import Container from '@/components/ui/Container'
import s from './AboutArea.module.scss'

export interface AboutAreaFeature {
  title: string
  description: string
}

export interface AboutAreaProps {
  sectionTitle?: string
  description: string
  features?: AboutAreaFeature[]
}

export default function AboutArea({
  sectionTitle = 'About the district',
  description,
  features = [],
}: AboutAreaProps) {
  return (
    <section className={s.section}>
      <div className={s.ellipse} aria-hidden />

      <Container>
        <div className={s.inner}>

          {/* Left — title + description */}
          <div className={s.leftCol}>
            <h2 className={s.title}>{sectionTitle}</h2>
            <p className={s.description}>{description}</p>
          </div>

          {/* Right — feature cards */}
          {features.length > 0 && (
            <div className={s.rightCol}>
              {features.map((feature, i) => (
                <div key={i} className={s.card}>
                  <div className={s.cardHeader}>
                    <span className={s.dot} aria-hidden />
                    <h3 className={s.cardTitle}>{feature.title}</h3>
                  </div>
                  <p className={s.cardDesc}>{feature.description}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </Container>
    </section>
  )
}
