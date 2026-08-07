import type React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProperty } from '@/api/listings'
import Container from '@/components/ui/Container'
import ResaleCard from './ResaleCard'
import ResaleBanner from './ResaleBanner'
import ResalePagination from './ResalePagination'
import ResaleFilters from './ResaleFilters'
import ResaleToolbar from './ResaleToolbar'
import ResaleMapView from './ResaleMapView'
import type { MapProperty } from './ResaleMapView'
import s from './page.module.scss'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Resale Properties in Dubai — PentTest',
  description:
    'Browse resale apartments, villas, and penthouses in Dubai. Find your perfect secondary market property with PentTest.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/resale`,
  },
}

const PAGE_SIZE = 18

// Banner config — insert after every N cards (0-indexed positions within the page)
const BANNERS: Array<{ afterIndex: number; image: string; title: string; description: string; buttonText: string; buttonHref: string; align?: 'left' | 'right' }> = [
  {
    afterIndex: 5,
    image: '/images/baner1.png',
    title: 'Get professional property guidance',
    description: 'Leave your details, and an advisor will help you choose the right property and navigate the purchase process.',
    buttonText: 'Learn more',
    buttonHref: '#',
  },
  {
    afterIndex: 13,
    image: '/images/baner2.png',
    title: 'Get professional property guidance',
    description: 'Leave your details, and an advisor will help you choose the right property and navigate the purchase process.',
    buttonText: 'Learn more',
    buttonHref: '#',
    align: 'right' as const,
  },
]

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9994 17.5402C17.9994 17.9369 17.6759 18.2607 17.2795 18.2607H14.8259C14.4295 18.2607 14.1059 17.9369 14.1059 17.5402V14.541C14.1059 13.9994 13.6632 13.5562 13.1221 13.5562H10.8773C10.3362 13.5562 9.89346 13.9994 9.89346 14.541V17.5402C9.89346 17.9369 9.56993 18.2607 9.17355 18.2607H6.71991C6.32352 18.2607 6 17.9369 6 17.5402L6 12.265C6 11.7887 6.16966 11.3787 6.50643 11.0421L10.778 6.766C11.451 6.09232 12.549 6.09232 13.222 6.766L17.4936 11.0416C17.8298 11.3782 18 11.7882 18 12.2645L17.9994 17.5402Z"
        fill="#1F1F1F"
        stroke="#1F1F1F"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 12L10 8L6 4" stroke="rgba(31,31,31,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default async function ResalePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; beds?: string; price?: string; propertyTypes?: string; status?: string; furnishing?: string; search?: string; view?: string; sort?: string }>
}) {
  const { page: pageParam, beds: bedsParam, price: priceParam, propertyTypes: typesParam, status: statusParam, furnishing: furnishingParam, search: searchParam, view: viewParam, sort: sortParam } = await searchParams
  const view = viewParam ?? 'card'
  const sort = sortParam ?? ''
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const filters: Record<string, unknown> = {}
  if (bedsParam)       filters.beds = bedsParam.split(',').filter(Boolean)
  if (typesParam)      filters.propertyTypes = typesParam.split(',').map(Number).filter(Boolean)
  if (statusParam)     filters.completion = statusParam
  if (furnishingParam) filters.furnished = furnishingParam
  if (searchParam)     filters.search = searchParam
  if (priceParam) {
    const [min, max] = priceParam.split('-').map(Number)
    if (min && max) filters.price = [min, max] as [number, number]
  }

  let properties: Array<Record<string, unknown>> = []
  let total = 0

  try {
    const validSort = ['newest', 'oldest', 'price_asc', 'price_desc'].includes(sort) ? sort as 'newest' | 'oldest' | 'price_asc' | 'price_desc' : undefined
    const res = await getProperty({ page: currentPage, pageSize: PAGE_SIZE, filters, sort: validSort })
    properties = (res.result?.data ?? []) as Array<Record<string, unknown>>
    total = res.result?.meta?.total ?? properties.length
  } catch {
    // show empty state on error
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Build map properties array
  const mapProperties: MapProperty[] = properties.map((item) => {
    const rawUrl = (item.pageUrl as { url?: string } | null)?.url ?? ''
    const slug = rawUrl.replace(/^\/resale\//, '').replace(/\/$/, '') || String(item.id)
    const images = ((item.images ?? []) as Array<{ url: string }>).map((img) => img.url)
    const lat = parseFloat(item.latitude as string) || undefined
    const lng = parseFloat(item.longitude as string) || undefined
    return {
      id: String(item.id),
      slug,
      title: (item.propertyTitle as string | null) ?? (item.title as string | null) ?? '',
      price: (item.price as number | null) ?? undefined,
      area: (item.unitBuiltupArea as number | null) ?? undefined,
      bedrooms: (item.bedrooms as string | null) ?? undefined,
      bathrooms: (item.noOfBathroom as number | null) ?? undefined,
      unitType: ((item.propertyType as { name?: string } | null)?.name) ?? (item.unitType as string | null) ?? undefined,
      location: [item.subCommunity, item.community].filter(Boolean).join(', ') || undefined,
      image: images[0] ?? undefined,
      lat,
      lng,
    }
  })

  // Build grid items: cards + banners interleaved
  const gridItems: React.ReactNode[] = []

  properties.forEach((item, i) => {
    const rawUrl = (item.pageUrl as { url?: string } | null)?.url ?? ''
    const slug = rawUrl.replace(/^\/resale\//, '').replace(/\/$/, '') || String(item.id)
    const images = ((item.images ?? []) as Array<{ url: string }>).map((img) => img.url)

    gridItems.push(
      <ResaleCard
        key={String(item.id)}
        id={typeof item.id === 'number' ? item.id : undefined}
        slug={slug}
        title={(item.propertyTitle as string | null) ?? (item.title as string | null) ?? ''}
        price={(item.price as number | null) ?? undefined}
        area={(item.unitBuiltupArea as number | null) ?? undefined}
        bedrooms={(item.bedrooms as string | null) ?? undefined}
        bathrooms={(item.noOfBathroom as number | null) ?? undefined}
        unitType={((item.propertyType as { name?: string } | null)?.name) ?? (item.unitType as string | null) ?? undefined}
        location={
          [item.subCommunity, item.community].filter(Boolean).join(', ') || undefined
        }
        images={images}
      />
    )

    // Insert banner after specified index
    const banner = BANNERS.find((b) => b.afterIndex === i)
    if (banner) {
      gridItems.push(
        <ResaleBanner
          key={`banner-${i}`}
          image={banner.image}
          title={banner.title}
          description={banner.description}
          buttonText={banner.buttonText}
          buttonHref={banner.buttonHref}
          align={banner.align}
        />
      )
    }
  })

  return (
    <main>
      {/* ── Header ── */}
      <section className={s.header}>
        <Container>
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={s.breadcrumbHome} aria-label="Home">
              <HomeIcon />
            </Link>
            <span className={s.breadcrumbSep}><ChevronIcon /></span>
            <span className={s.breadcrumbCurrent}>Resale</span>
          </nav>

          <div className={s.headerContent}>
            <div className={s.titleRow}>
              <h1 className={s.title}>Secondary Properties for sale  {total > 0 && <span className={s.titleCount}>{total}</span>}</h1>
            </div>
            <ResaleFilters />
          </div>
        </Container>
      </section>

      {/* ── Listing ── */}
      <section className={s.listing}>
        {view === 'map' ? (
          <>
            <Container>
              <ResaleToolbar view={view} sort={sort} />
            </Container>
            <ResaleMapView properties={mapProperties} />
          </>
        ) : (
          <Container>
            <ResaleToolbar view={view} sort={sort} />
            {properties.length === 0 ? (
              <p className={s.empty}>No properties found.</p>
            ) : (
              <>
                <div className={s.grid}>
                  {gridItems}
                </div>
                <ResalePagination currentPage={currentPage} totalPages={totalPages} />
              </>
            )}
          </Container>
        )}
      </section>
    </main>
  )
}
