import Link from 'next/link'
import type { Metadata } from 'next'
import { MOCK_DEVELOPERS } from '@/data/mock'
import Container from '@/components/ui/Container'
import DeveloperCard from './DeveloperCard'
import s from './page.module.scss'

export const metadata: Metadata = {
  title: 'Top Developers — OPR Real Estate',
  description:
    'Explore our curated list of trusted developers — offering exceptional real estate projects, premium standards, and long-term reliability.',
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

export default function DevelopersPage() {
  const developers = MOCK_DEVELOPERS

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
            <span className={s.breadcrumbCurrent}>Developers</span>
          </nav>

          <div className={s.headerContent}>
            <h1 className={s.title}>
              Top Developers{' '}
              <span className={s.titleCount}>{developers.length}</span>
            </h1>
            <p className={s.description}>
              Explore our curated list of trusted developers — offering exceptional real estate
              projects, premium standards, and long-term reliability
            </p>
          </div>
        </Container>
      </section>

      {/* ── Grid ── */}
      <section className={s.listing}>
        <Container>
          <div className={s.grid}>
            {developers.map((dev) => (
              <DeveloperCard
                key={dev.slug}
                name={dev.name}
                slug={dev.slug}
                description={dev.description}
                logo={dev.logo}
                imageBg={dev.imageBg}
              />
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
