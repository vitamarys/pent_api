'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getStrapiImageUrl } from '@/lib/utils'
import s from './page.module.scss'

export default function AgentCard({
  name,
  slug,
  position,
  image,
  languages,
}: {
  name: string
  slug: string
  position?: string
  image?: { url: string }
  languages?: Array<{ name?: string } | string>
}) {
  const imgSrc = image ? getStrapiImageUrl(image.url) : ''

  const langTags = (languages ?? []).map((l) =>
    typeof l === 'string' ? l : (l.name ?? '')
  ).filter(Boolean)

  return (
    <Link href={`/agents/${slug}`} className={s.card}>
      <div className={s.cardMedia}>
        {imgSrc && <Image src={imgSrc} alt={name} fill className={s.cardBg} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />}
        <div className={s.cardOverlay} />
      </div>

      <div className={s.cardCart}>
        <div className={s.cardInfo}>
          <div className={s.cardTitleRow}>
            <span className={s.cardDot} />
            <span className={s.cardName}>{name}</span>
          </div>
          {position && <p className={s.cardPosition}>{position}</p>}
        </div>

        {langTags.length > 0 && (
          <div className={s.cardTags}>
            {langTags.map((lang) => (
              <span key={lang} className={s.cardTag}>{lang}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
