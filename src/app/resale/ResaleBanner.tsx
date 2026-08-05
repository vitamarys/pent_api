import Image from 'next/image'
import s from './ResaleBanner.module.scss'

export interface ResaleBannerProps {
  image: string
  title: string
  description?: string
  buttonText?: string
  buttonHref?: string
  align?: 'left' | 'right'
}

export default function ResaleBanner({
  image,
  title,
  description,
  buttonText = 'Learn more',
  buttonHref = '#',
  align = 'left',
}: ResaleBannerProps) {
  return (
    <div className={`${s.banner} ${align === 'right' ? s.bannerRight : ''}`}>
      <Image src={image} alt={title} fill className={s.bannerImg} sizes="(max-width: 768px) 100vw, 50vw" />

      <div className={s.textPanel}>
        <div className={s.textContent}>
          <p className={s.title}>{title}</p>
          {description && <p className={s.description}>{description}</p>}
        </div>
        <a href={buttonHref} className={s.button}>
          {buttonText}
        </a>
      </div>
    </div>
  )
}
