import Image from 'next/image'
import Container from '@/components/ui/Container'
import s from './HomeServices.module.scss'

interface ServiceSlide {
  title: string
  description?: string
  imageFile?: { url: string }
}

interface HomeServicesProps {
  title?: string
  slides?: ServiceSlide[]
}

export default function HomeServices({ title, slides = [] }: HomeServicesProps) {
  if (!slides.length && !title) return null

  return (
    <section className={s.section}>
      <Container>
        {title && <h2 className={s.title}>{title}</h2>}
        <div className={s.track}>
          {slides.map((slide, i) => (
            <div key={i} className={s.card}>
              {slide.imageFile?.url && (
                <div className={s.cardImageWrap}>
                  <Image src={slide.imageFile.url} alt={slide.title} fill className={s.cardImage} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              )}
              <div className={s.cardBody}>
                <p className={s.cardTitle}>{slide.title}</p>
                {slide.description && (
                  <p className={s.cardDescription}>{slide.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
