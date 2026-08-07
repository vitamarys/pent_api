import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getStrapiImageUrl } from '@/lib/utils'
import strapiClient from '@/lib/axios'
import Container from '@/components/ui/Container'
import AgentCard from './AgentCard'
import AgentSearch from './AgentSearch'
import s from './page.module.scss'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our Team — PentTest',
  description:
    'Meet our professional real estate agents — experts dedicated to helping you find the perfect property in Dubai.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/agents`,
  },
}

interface AgentItem {
  id: number
  name: string
  position?: string
  languages?: Array<{ name?: string } | string>
  imageFile?: { url: string } | null
  image?: { url: string } | null
  pageUrl?: { url: string } | null
}

interface AgentsResponse {
  data: AgentItem[]
  meta: { page: number; pageSize: number; total: number; pageCount: number }
}

async function getAgents(params: { pageSize?: number; search?: string } = {}): Promise<AgentsResponse> {
  try {
    const { data } = await strapiClient.get<AgentsResponse>('/api/catalog/agents', { params })
    return data
  } catch {
    return { data: [], meta: { page: 1, pageSize: 0, total: 0, pageCount: 0 } }
  }
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

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const { data: agents } = await getAgents({ pageSize: 100, search })

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
            <span className={s.breadcrumbCurrent}>Agents</span>
          </nav>

          <div className={s.headerContent}>
            <h1 className={s.title}>
              Our team{' '}
              <span className={s.titleCount}>{agents.length}</span>
            </h1>
            <p className={s.description}>
              Meet our team of experienced real estate professionals — dedicated to finding
              you the perfect property in Dubai.
            </p>
          </div>

          <Suspense>
            <AgentSearch defaultValue={search ?? ''} />
          </Suspense>
        </Container>
      </section>

      {/* ── Grid ── */}
      <section className={s.listing}>
        <Container>
          <div className={s.grid}>
            {agents.map((agent) => {
              const slug = agent.pageUrl?.url?.replace(/^\/agents\//, '').replace(/\/$/, '') ?? String(agent.id)
              const image = agent.imageFile ?? agent.image ?? undefined
              return (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  slug={slug}
                  position={agent.position}
                  image={image ?? undefined}
                  languages={agent.languages}
                />
              )
            })}
          </div>
        </Container>
      </section>
    </main>
  )
}
