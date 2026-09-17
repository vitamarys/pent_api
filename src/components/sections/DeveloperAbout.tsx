import Image from 'next/image'
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
              <div className={s.imageWrap} data-anim="image">
                <Image src={image} alt={sectionTitle} fill className={s.image} sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ) : (
              <>
                <h2 className={s.title} data-anim="heading" suppressHydrationWarning>{sectionTitle}</h2>
                {sectionDescription && (
                  <p className={s.description} data-anim="text" suppressHydrationWarning>{sectionDescription}</p>
                )}
              </>
            )}
          </div>

          {/* Right: title (if image shown) + feature cards */}
          <div className={s.right}>
            {image && (
              <div className={s.rightHeader}>
                <h2 className={s.title} data-anim="heading" suppressHydrationWarning>{sectionTitle}</h2>
                {sectionDescription && (
                  <p className={s.description} data-anim="text" suppressHydrationWarning>{sectionDescription}</p>
                )}
              </div>
            )}

            {features.length > 0 && (
              <div className={s.featuresList} data-anim-stagger="">
                {features.map((item, i) => (
                  <div key={i} className={s.featureCard} data-anim="stagger" suppressHydrationWarning>
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
