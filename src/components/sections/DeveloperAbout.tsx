import Container from '@/components/ui/Container'
import s from './DeveloperAbout.module.scss'

export interface FeatureItem {
  title: string
  description: string
}

export interface DeveloperAboutProps {
  sectionTitle?: string
  sectionDescription?: string
  image?: string
  features?: FeatureItem[]
}

export default function DeveloperAbout({
  sectionTitle = 'What the Developer Is Known For',
  sectionDescription,
  image,
  features = [],
}: DeveloperAboutProps) {
  return (
    <section className={s.section}>
      <Container>
        <div className={s.inner}>

          {/* Left: image OR title + description */}
          <div className={s.left}>
            {image ? (
              <div className={s.imageWrap}>
                <img src={image} alt={sectionTitle} className={s.image} />
              </div>
            ) : (
              <>
                <h2 className={s.title}>{sectionTitle}</h2>
                {sectionDescription && (
                  <p className={s.description}>{sectionDescription}</p>
                )}
              </>
            )}
          </div>

          {/* Right: title (if image shown) + feature cards */}
          <div className={s.right}>
            {image && (
              <div className={s.rightHeader}>
                <h2 className={s.title}>{sectionTitle}</h2>
                {sectionDescription && (
                  <p className={s.description}>{sectionDescription}</p>
                )}
              </div>
            )}

            {features.length > 0 && (
              <div className={s.featuresList}>
                {features.map((item, i) => (
                  <div key={i} className={s.featureCard}>
                    <div className={s.cardTop}>
                      <span className={s.dot} />
                      <p className={s.featureTitle}>{item.title}</p>
                    </div>
                    <p className={s.featureDesc}>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </Container>
    </section>
  )
}
