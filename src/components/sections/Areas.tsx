import Link from 'next/link'
import Container from '@/components/ui/Container'
import s from './Areas.module.scss'

export interface AreaItem {
  name: string
  slug: string
  image: string
}

interface AreasProps {
  areas: AreaItem[]
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
}

function DotIcon() {
  return (
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="12" r="5" fill="#C19962" />
    </svg>
  )
}

function AreaCard({ area }: { area: AreaItem }) {
  return (
    <Link href={`/areas/${area.slug}`} className={s.card}>
      {area.image && <img src={area.image} alt={area.name} className={s.cardImage} />}
      <div className={s.cardLabel}>
        <DotIcon />
        <span className={s.cardName}>{area.name}</span>
      </div>
    </Link>
  )
}

export default function Areas({
  areas,
  sectionTitle = 'Best Areas for Luxury living in Dubai',
  ctaLabel = 'See all Areas',
  ctaHref = '/areas',
}: AreasProps) {
  if (areas.length === 0) return null

  return (
    <section className={s.section}>
      <Container>
        {/* Header */}
        <div className={s.header}>
          <h2 className={s.title}>{sectionTitle}</h2>
          <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnDesktop}`}>
            {ctaLabel}
          </Link>
        </div>

        {/* Desktop: bento grid */}
        <div className={s.grid}>
          {areas.slice(0, 6).map((area, i) => (
            <div key={area.slug} className={`${s.gridItem} ${s[`gridItem${i + 1}`]}`}>
              <AreaCard area={area} />
            </div>
          ))}
        </div>

        {/* Tablet / Mobile: horizontal scroll */}
        <div className={s.scrollTrack}>
          {areas.map(area => (
            <div key={area.slug} className={s.scrollItem}>
              <AreaCard area={area} />
            </div>
          ))}
        </div>

        {/* CTA button for tablet/mobile */}
        <Link href={ctaHref} className={`${s.ctaBtn} ${s.ctaBtnMobile}`}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
