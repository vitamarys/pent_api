import Link from 'next/link'
import type { Metadata } from 'next'
import { MOCK_AREAS_FULL } from '@/data/mock'
import { getStrapiImageUrl } from '@/lib/utils'
import Container from '@/components/ui/Container'
import AreaCard from './AreaCard'
import s from './page.module.scss'

export const metadata: Metadata = {
  title: 'Top Areas in Dubai — PentTest',
  description:
    'Explore the best areas in Dubai — from waterfront communities to iconic urban districts. Find the perfect neighbourhood for your lifestyle.',
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        stroke="#1f1f1f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="rgba(31,31,31,0.7)" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

export default function AreasPage() {
  const areas = MOCK_AREAS_FULL

  return (
    <main>
      {/* ── Header ── */}
      <section className={s.header}>
        <Container>
          <nav className={s.breadcrumb}>
            <Link href="/" className={s.breadcrumbHome} aria-label="Home">
              <HomeIcon />
            </Link>
            <ChevronIcon />
            <span className={s.breadcrumbCurrent}>Areas</span>
          </nav>

          <div className={s.headerContent}>
            <h1 className={s.title}>
              Top Areas{' '}
              <span className={s.titleCount}>{areas.length}</span>
            </h1>
            <p className={s.description}>
              Explore the best neighbourhoods in Dubai — from iconic waterfront communities
              to vibrant urban districts. Find the perfect area for your lifestyle and investment goals.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Grid ── */}
      <section className={s.listing}>
        <Container>
          <div className={s.grid}>
            {areas.map((area) => (
              <AreaCard
                key={area.slug}
                name={area.name}
                slug={area.slug}
                city={area.city}
                description={area.description}
                image={area.heroImage ? getStrapiImageUrl(area.heroImage.url) : undefined}
              />
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
