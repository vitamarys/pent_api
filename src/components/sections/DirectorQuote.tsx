import Image from 'next/image'
import s from './DirectorQuote.module.scss'

export interface DirectorQuoteProps {
  quote: string
  name: string
  position?: string
  imageUrl?: string
  imageAlt?: string
}

export default function DirectorQuote({
  quote,
  name,
  position,
  imageUrl,
  imageAlt,
}: DirectorQuoteProps) {
  return (
    <section className={s.section}>

      {/* Photo */}
      <div className={s.photo}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className={s.photoImg}
          />
        ) : (
          <div className={s.photoPlaceholder} />
        )}
      </div>

      {/* Quote panel */}
      <div className={s.panel}>
        <div className={s.ellipse} aria-hidden />

        <div className={s.content}>
          <blockquote className={s.quote}>{quote}</blockquote>

          <div className={s.agent}>
            <p className={s.name}>{name}</p>
            {position && <p className={s.position}>{position}</p>}
          </div>
        </div>
      </div>

    </section>
  )
}
