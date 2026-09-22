import type React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProjects } from '@/api/listings'
import Container from '@/components/ui/Container'
import { getStrapiImageUrl } from '@/lib/utils'
import type { PenthouseProjectFilters } from '@/types/penthouse-api'
import ResaleMapView from '@/app/resale/ResaleMapView'
import ResaleBanner from '@/app/resale/ResaleBanner'
import ProjectCard from '../ProjectCard'
import ProjectPagination from '../ProjectPagination'
import ProjectFilters, { type FilterOption } from '../ProjectFilters'
import ProjectToolbar from '../ProjectToolbar'
import s from './page.module.scss'

export const metadata: Metadata = {
  title: 'Off-plan Projects in Dubai',
  description: 'Browse off-plan projects in Dubai. Find apartments, villas, and penthouses from the best developers.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/projects`,
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

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    beds?: string
    price?: string
    propertyTypes?: string
    location?: string
    handover?: string
    developers?: string
    details?: string
    sort?: string
    view?: string
  }>
}) {
  const {
    page: pageParam,
    beds: bedsParam,
    price: priceParam,
    propertyTypes: typesParam,
    location: locationParam,
    handover: handoverParam,
    developers: developersParam,
    details: detailsParam,
    sort: sortParam,
    view: viewParam,
  } = await searchParams

  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const sort = sortParam ?? ''
  const view = viewParam ?? 'card'

  const filters: PenthouseProjectFilters = {}
  if (bedsParam)       filters.beds          = bedsParam.split(',').filter(Boolean)
  if (typesParam)      filters.propertyTypes = typesParam.split(',').map(Number).filter(Boolean)
  if (locationParam)   filters.areas         = locationParam.split(',').map(Number).filter(Boolean)
  if (handoverParam)   filters.handover      = handoverParam.split(',').filter(Boolean)
  if (developersParam) filters.developers    = developersParam.split(',').map(Number).filter(Boolean)
  if (detailsParam)    filters.categories    = detailsParam.split(',').filter(Boolean)
  if (priceParam) {
    const [min, max] = priceParam.split('-').map(Number)
    if (min && max) filters.price = [min, max]
  }

  // Build search params string for pagination links (excludes page)
  const qs = new URLSearchParams()
  if (bedsParam)       qs.set('beds', bedsParam)
  if (typesParam)      qs.set('propertyTypes', typesParam)
  if (locationParam)   qs.set('location', locationParam)
  if (handoverParam)   qs.set('handover', handoverParam)
  if (developersParam) qs.set('developers', developersParam)
  if (detailsParam)    qs.set('details', detailsParam)
  if (priceParam)      qs.set('price', priceParam)
  if (sort)            qs.set('sort', sort)
  if (view !== 'card') qs.set('view', view)

  let projects: import('@/types/penthouse-api').OffPlanProjectCard[] = []
  let total = 0
  let areaOptions: FilterOption[] = []
  let typeOptions: FilterOption[] = []
  let bedroomOptions: FilterOption[] = []
  let developerOptions: FilterOption[] = []
  let handoverOptions: FilterOption[] = []
  let categoryOptions: FilterOption[] = []

  try {
    const validSort = ['price_asc', 'price_desc', 'handover_asc', 'handover_desc'].includes(sort)
      ? (sort as 'price_asc' | 'price_desc' | 'handover_asc' | 'handover_desc')
      : undefined

    const hasFilters = Object.keys(filters).length > 0

    // Run main query, type-options query (excludes propertyTypes filter so
    // the dropdown always shows the full list), and an unfiltered query to
    // get the complete set of facet options (used to show disabled state).
    const { propertyTypes: _pt, ...typeOptionsFilters } = filters
    const [res, typeRes, allOptsRes] = await Promise.all([
      getProjects({ page: currentPage, pageSize: PAGE_SIZE, filters, sort: validSort }),
      filters.propertyTypes?.length
        ? getProjects({ pageSize: 1, filters: typeOptionsFilters })
        : Promise.resolve(null),
      hasFilters
        ? getProjects({ pageSize: 1, filters: {} })
        : Promise.resolve(null),
    ])

    projects = res.result?.data ?? []
    total = res.result?.meta?.total ?? projects.length

    // Available IDs from filtered results (used to mark disabled state)
    const availAreaIds   = new Set((res.areaResult?.data ?? []).map(o => Number(o.id)))
    const availTypeIds   = new Set(((typeRes ?? res).propertyTypeResult?.data ?? []).map(o => Number(o.id)))
    const availBedIds    = new Set((res.bedsResult?.data ?? []).map(o => String(o.id)))
    const availDevIds    = new Set((res.developerResult?.data ?? []).map(o => Number(o.id)))
    const availHandover  = new Set((res.handoverResult?.data ?? []).map(o => String(o.label)))

    // Use full (unfiltered) options when available; fall back to filtered results
    const base = allOptsRes ?? res
    const baseType = allOptsRes ?? (typeRes ?? res)

    areaOptions = (base.areaResult?.data ?? []).map(t => ({
      id: Number(t.id),
      label: t.label,
      disabled: !availAreaIds.has(Number(t.id)) && !(filters.areas?.includes(Number(t.id))),
    }))
    typeOptions = (baseType.propertyTypeResult?.data ?? []).map(t => ({
      id: Number(t.id),
      label: t.label,
      disabled: !availTypeIds.has(Number(t.id)) && !(filters.propertyTypes?.includes(Number(t.id))),
    }))
    bedroomOptions = (base.bedsResult?.data ?? []).map(t => ({
      id: String(t.id),
      label: t.label,
      disabled: !availBedIds.has(String(t.id)) && !(filters.beds?.includes(String(t.id))),
    }))
    developerOptions = (base.developerResult?.data ?? []).map(t => ({
      id: Number(t.id),
      label: t.label,
      disabled: !availDevIds.has(Number(t.id)) && !(filters.developers?.includes(Number(t.id))),
    }))
    handoverOptions = (base.handoverResult?.data ?? []).map(t => ({
      id: t.label,
      label: t.label,
      disabled: !availHandover.has(String(t.label)) && !(filters.handover?.includes(String(t.label))),
    }))
    categoryOptions = (res.categoryResult?.data ?? []).map(t => ({ id: t.label, label: t.label }))
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
            <span className={s.breadcrumbCurrent}>Projects</span>
          </nav>

          <div className={s.headerContent}>
            <h1 className={s.title}>
              Off-plan Projects{total > 0 && <> <span className={s.titleCount}>{total}</span></>}
            </h1>
            <ProjectFilters
              areaOptions={areaOptions}
              typeOptions={typeOptions}
              bedroomOptions={bedroomOptions}
              developerOptions={developerOptions}
              handoverOptions={handoverOptions}
              categoryOptions={categoryOptions}
            />
          </div>
        </Container>
      </section>

      {/* ── Listing ── */}
      <section className={s.listing}>
        {view === 'map' ? (
          <>
            <Container>
              <ProjectToolbar view={view} sort={sort} />
            </Container>
            <ResaleMapView apiPath="/api/catalog/projects" />
          </>
        ) : (
          <Container>
            <ProjectToolbar view={view} sort={sort} />
            {projects.length === 0 ? (
              <p className={s.empty}>No projects found.</p>
            ) : (
              <>
                <div className={s.grid}>
                  {(() => {
                    const items: React.ReactNode[] = []
                    projects.forEach((project, i) => {
                      const slug =
                        project.pageUrl?.url
                          ?.replace(/^\/(off-plan|projects)\//, '')
                          .replace(/\/$/, '') ?? String(project.id)
                      const images = project.galleryImages?.length
                        ? project.galleryImages.map(img => getStrapiImageUrl(img.url))
                        : project.previewImage
                          ? [getStrapiImageUrl(project.previewImage.url)]
                          : []
                      items.push(
                        <ProjectCard
                          key={project.id}
                          id={project.id}
                          slug={slug}
                          title={project.title ?? ''}
                          location={project.area?.title}
                          developer={project.developer?.name}
                          handover={project.handover ?? undefined}
                          priceFrom={project.minPrice ?? undefined}
                          propertyTypes={project.projectTypes?.map(t => t.name)}
                          images={images}
                        />
                      )
                      if (i === 5) {
                        items.push(
                          <div key="banner" className={s.bannerWrap}>
                            <ResaleBanner
                              image="/images/baner2.png"
                              title="Get professional property guidance"
                              description="Leave your details, and an advisor will help you choose the right property and navigate the purchase process."
                              buttonText="Learn more"
                              align="right"
                            />
                          </div>
                        )
                      }
                    })
                    return items
                  })()}
                </div>
                <ProjectPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchParams={qs.toString()}
                />
              </>
            )}
          </Container>
        )}
      </section>
    </main>
  )
}
