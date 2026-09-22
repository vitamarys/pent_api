import type React from 'react'
import { Suspense } from 'react'
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

import s from './page.module.scss'

export const metadata: Metadata = {
  title: 'Resale Properties in Dubai — PentTest',
  description:
    'Browse resale apartments, villas, and penthouses in Dubai. Find your perfect secondary market property with PentTest.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/resale`,
  },
}

const PAGE_SIZE = 16


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


  return (
    <main>
      {/* ── Header ── */}
      <section className={s.header}>
        <Container>
          <nav className={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={s.breadcrumbHome} aria-label="Home">
              <img src="/icons/icon-home-b.svg" width={24} height={24} alt="" />
            </Link>
            <span className={s.breadcrumbSep}><ChevronIcon /></span>
            <span className={s.breadcrumbCurrent}>Resale</span>
          </nav>

          <div className={s.headerContent}>
            <div className={s.titleRow}>
              <h1 className={s.title}>Secondary Properties for sale  {total > 0 && <span className={s.titleCount}>{total}</span>}</h1>
            </div>
            <ResaleFilters view={view} />
          </div>
        </Container>
      </section>

      {/* ── Listing ── */}
      <section className={s.listing}>
        <Container>
          <ResaleToolbar view={view} sort={sort} />
        </Container>

        {view === 'map' ? (
          <Suspense>
            <ResaleMapView />
          </Suspense>
        ) : (
          <Container>
            {properties.length === 0 ? (
              <p className={s.empty}>No properties found.</p>
            ) : (
              <>
                <div className={s.grid}>
                  {(() => {
                    const items: React.ReactNode[] = []
                    properties.forEach((item, i) => {
                      const rawUrl = (item.pageUrl as { url?: string } | null)?.url ?? ''
                      const slug = rawUrl.replace(/^\/resale\//, '').replace(/\/$/, '') || String(item.id)
                      const images = ((item.images ?? []) as Array<{ url: string }>).map((img) => img.url)
                      items.push(
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
                          location={[item.subCommunity, item.community].filter(Boolean).join(', ') || undefined}
                          projectName={(item.propertyName as string | null) ?? undefined}
                          images={images}
                        />
                      )
                      if (i === 5) {
                        items.push(
                          <ResaleBanner
                            key="banner"
                            image="/images/baner1.png"
                            title="Get professional property guidance"
                            description="Leave your details, and an advisor will help you choose the right property and navigate the purchase process."
                            buttonText="Learn more"
                          />
                        )
                      }
                    })
                    return items
                  })()}
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
