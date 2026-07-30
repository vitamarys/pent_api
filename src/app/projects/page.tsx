import Link from 'next/link'
import type { Metadata } from 'next'
import { getProjects } from '@/api/listings'
import Container from '@/components/ui/Container'
import { getStrapiImageUrl } from '@/lib/utils'
import type { PenthouseProjectFilters } from '@/types/penthouse-api'
import ResaleMapView from '@/app/resale/ResaleMapView'
import type { MapProperty } from '@/app/resale/ResaleMapView'
import ProjectCard from './ProjectCard'
import ProjectPagination from './ProjectPagination'
import ProjectFilters from './ProjectFilters'
import ProjectToolbar from './ProjectToolbar'
import s from './page.module.scss'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Off-plan Projects in Dubai',
  description: 'Browse off-plan projects in Dubai. Find apartments, villas, and penthouses from the best developers.',
}

const PAGE_SIZE = 18

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
  let areaOptions: { id: number; label: string }[] = []
  let typeOptions: { id: number; label: string }[] = []
  let bedroomOptions: { id: string; label: string }[] = []
  let developerOptions: { id: number; label: string }[] = []
  let handoverOptions: { id: string; label: string }[] = []
  let categoryOptions: { id: string; label: string }[] = []

  try {
    const validSort = ['price_asc', 'price_desc', 'handover_asc', 'handover_desc'].includes(sort)
      ? (sort as 'price_asc' | 'price_desc' | 'handover_asc' | 'handover_desc')
      : undefined
    const res = await getProjects({ page: currentPage, pageSize: PAGE_SIZE, filters, sort: validSort })
    projects = res.result?.data ?? []
    total = res.result?.meta?.total ?? projects.length
    areaOptions = (res.areaResult?.data ?? []).map(t => ({ id: t.id, label: t.label }))
    typeOptions = (res.propertyTypeResult?.data ?? []).map(t => ({ id: t.id, label: t.label }))
    bedroomOptions = (res.bedsResult?.data ?? []).map(t => ({ id: String(t.id), label: t.label }))
    developerOptions = (res.developerResult?.data ?? []).map(t => ({ id: t.id, label: t.label }))
    handoverOptions = (res.handoverResult?.data ?? []).map(t => ({ id: t.label, label: t.label }))
    categoryOptions = (res.categoryResult?.data ?? []).map(t => ({ id: t.label, label: t.label }))
  } catch {
    // show empty state on error
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Build map properties
  const mapProperties: MapProperty[] = projects.map(project => {
    const slug =
      project.pageUrl?.url
        ?.replace(/^\/(off-plan|projects)\//, '')
        .replace(/\/$/, '') ?? String(project.id)
    const image = project.previewImage ? getStrapiImageUrl(project.previewImage.url) : undefined
    return {
      id: String(project.id),
      slug,
      title: project.title ?? '',
      price: project.minPrice ?? undefined,
      location: project.area?.title,
      unitType: project.projectTypes?.[0]?.name,
      image,
      lat: project.coordinates?.lat,
      lng: project.coordinates?.lng,
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
            <ResaleMapView properties={mapProperties} />
          </>
        ) : (
          <Container>
            <ProjectToolbar view={view} sort={sort} />
            {projects.length === 0 ? (
              <p className={s.empty}>No projects found.</p>
            ) : (
              <>
                <div className={s.grid}>
                  {projects.map(project => {
                    const slug =
                      project.pageUrl?.url
                        ?.replace(/^\/(off-plan|projects)\//, '')
                        .replace(/\/$/, '') ?? String(project.id)
                    const images = project.previewImage
                      ? [getStrapiImageUrl(project.previewImage.url)]
                      : []
                    return (
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
                  })}
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
