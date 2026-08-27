import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getDevelopers } from '@/api/developers'
import Container from '@/components/ui/Container'
import DeveloperCard from './DeveloperCard'
import DeveloperSearch from './DeveloperSearch'
import s from './page.module.scss'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Top Developers — PentTest',
  description:
    'Explore our curated list of trusted developers — offering exceptional real estate projects, premium standards, and long-term reliability.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/developers`,
  },
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

const PAGE_SIZE = 21

export default async function DevelopersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const { data: developers, meta } = await getDevelopers({ pageSize: PAGE_SIZE, page, search })
  const pageCount = meta?.pageCount ?? 1
  const total = meta?.total ?? developers.length

  function pageHref(p: number) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/developers${qs ? `?${qs}` : ''}`
  }

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
              <span className={s.titleCount}>{total}</span>
            </h1>
            <p className={s.description}>
              Explore our curated list of trusted developers — offering exceptional real estate
              projects, premium standards, and long-term reliability
            </p>
          </div>

          <Suspense>
            <DeveloperSearch defaultValue={search ?? ''} />
          </Suspense>
        </Container>
      </section>

      {/* ── Grid ── */}
      <section className={s.listing}>
        <Container>
          <div className={s.grid}>
            {developers.map((dev) => {
              const slug = dev.pageUrl?.url?.replace(/^\/developers\//, '').replace(/\/$/, '') ?? String(dev.id)
              return (
                <DeveloperCard
                  key={dev.id}
                  id={dev.id}
                  name={dev.name}
                  slug={slug}
                  imageBg={dev.imageFile ?? dev.image ?? undefined}
                  logo={dev.logo ?? dev.logoFile ?? undefined}
                  description={dev.description ?? ''}
                />
              )
            })}
          </div>

          {/* ── Pagination ── */}
          {pageCount > 1 && (
            <nav className={s.pagination} aria-label="Pagination">
              <Link
                href={pageHref(page - 1)}
                className={`${s.pageBtn} ${page <= 1 ? s.pageBtnDisabled : ''}`}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
              </Link>

              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className={`${s.pageBtn} ${p === page ? s.pageBtnActive : ''}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={pageHref(page + 1)}
                className={`${s.pageBtn} ${page >= pageCount ? s.pageBtnDisabled : ''}`}
                aria-disabled={page >= pageCount}
                tabIndex={page >= pageCount ? -1 : undefined}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                </svg>
              </Link>
            </nav>
          )}
        </Container>
      </section>
    </main>
  )
}
