import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import { getProjects } from '@/api/listings'
import { getProperty } from '@/api/listings'
import { formatCompactPrice } from '@/lib/utils'
import s from './OurProperties.module.scss'

export interface OurPropertiesCard {
  id?: number
  title?: string
  priceValue?: number | null
  currency?: string | null
  url?: string | null
  imageFile?: {
    url: string
    alternativeText?: string | null
  } | null
}

export interface OurPropertiesProps {
  title?: string
  description?: string
  cards?: OurPropertiesCard[]
}

const FALLBACK_HREFS = ['/projects', '/resale']

async function fetchCounts(): Promise<{ projects: number; resale: number }> {
  const [projectsRes, propertyRes] = await Promise.allSettled([
    getProjects({ pageSize: 1 }),
    getProperty({ pageSize: 1 }),
  ])

  return {
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.result.meta.total : 0,
    resale: propertyRes.status === 'fulfilled' ? propertyRes.value.result.meta.total : 0,
  }
}

export default async function OurProperties({
  title = 'Our properties',
  description,
  cards = [],
}: OurPropertiesProps) {
  const { projects, resale } = await fetchCounts()
  const counts = [projects, resale]

  return (
    <section className={s.section}>
      <div className={s.ellipse} aria-hidden />

      <Container>
        <div className={s.inner}>

          {/* Header */}
          <div className={s.header}>
            <h2 className={s.title}>{title}</h2>
            {description && <p className={s.description}>{description}</p>}
          </div>

          {/* Cards */}
          <div className={s.cards}>
            {cards.map((card, i) => {
              const href = card.url ?? FALLBACK_HREFS[i] ?? '/projects'
              const count = counts[i] ?? 0
              const price = card.priceValue
                ? formatCompactPrice(card.priceValue, card.currency ?? 'AED')
                : null

              return (
                <Link key={card.id ?? i} href={href} className={s.card}>
                  {card.imageFile?.url && (
                    <Image
                      src={card.imageFile.url}
                      alt={card.imageFile.alternativeText ?? card.title ?? ''}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 100vw, 50vw"
                      className={s.cardImage}
                    />
                  )}
                  <div className={s.cardContent}>
                    <div className={s.cardHeader}>
                      <p className={s.cardTitle}>
                        {card.title}
                        {count > 0 && <span className={s.count}> {count}</span>}
                      </p>
                      <span className={s.arrow} aria-hidden>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    {price && (
                      <div className={s.priceBox}>
                        <span className={s.priceLabel}>Starting Price</span>
                        <span className={s.priceValue}>{price}</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </Container>
    </section>
  )
}
