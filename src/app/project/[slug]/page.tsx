import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjectBySlug, getProjectSlugs, getTemplateGlobalBlockSlots } from '@/api/projects'
import { getStrapiImageUrl, formatCompactPrice } from '@/lib/utils'
import type { StrapiSection, StrapiProject, StrapiGlobalBlockSlot } from '@/types/strapi'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.slice(0, 20).map(({ slug }) => ({ slug }))
}

import HeroProject from '@/components/sections/HeroProject'
import ProjectPromo from '@/components/sections/ProjectPromo'
import ProjectInfo from '@/components/sections/ProjectInfo'
import ProjectKeys from '@/components/sections/ProjectKeys'
import ProjectFloorPlan from '@/components/sections/ProjectFloorPlan'
import ProjectPaymentPlan from '@/components/sections/ProjectPaymentPlan'
import ProjectBrand from '@/components/sections/ProjectBrand'
import ProjectAmenities from '@/components/sections/ProjectAmenities'
import ProjectGuide from '@/components/sections/ProjectGuide'
import ProjectForm from '@/components/sections/ProjectForm'
import ProjectDev from '@/components/sections/ProjectDev'
import ProjectTeam from '@/components/sections/ProjectTeam'
import ProjectAwards from '@/components/sections/ProjectAwards'
import ProjectServices from '@/components/sections/ProjectServices'
import ProjectAccordion from '@/components/sections/ProjectAccordion'
import ProjectLocation from '@/components/sections/ProjectLocation'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectMap from '@/components/sections/ProjectMap'
import SimilarProjects from '@/components/sections/SimilarProjects'
import { MOCK_SIMILAR_PROJECTS } from '@/data/mock'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
  }
}

function renderSection(section: StrapiSection, index: number, project: StrapiProject) {
  const developer = project.developer
  if (section.visible === false) return null

  const mediaUrl = (media?: { url: string } | null) =>
    media ? getStrapiImageUrl(media.url) : ''

  switch (section.__component) {
    case 'sections.hero-project':
      return (
        <HeroProject
          key={index}
          title={section.title}
          location={[project.district?.name, project.district?.city].filter(Boolean).join(', ')}
          description={section.description ?? ''}
          image={mediaUrl(section.image)}
          startingPrice={project.priceFrom ? formatCompactPrice(project.priceFrom) : ''}
          handover={project.handover ?? ''}
          numberOfUnits={section.numberOfUnits ?? ''}
          breadcrumb={[
            ...(project.district ? [{ label: project.district.name, href: `/areas/${project.district.slug}` }] : []),
            { label: project.title },
          ]}
        />
      )

    case 'sections.project-promo':
      return (
        <ProjectPromo
          key={index}
          titleHighlight={section.titleHighlight}
          titleRest={section.titleRest}
          description={section.description ?? ''}
        />
      )

    case 'sections.project-info': {
      const autoDetails = [
        project.district && {
          label: 'Location',
          value: [project.district.name, project.district.city].filter(Boolean).join(', '),
          type: 'link' as const,
          href: `/areas/${project.district.slug}`,
        },
        project.developer && {
          label: 'Developer',
          value: project.developer.name,
          type: 'link' as const,
          href: `/developer/${project.developer.slug}`,
        },
        project.handover && {
          label: 'Handover',
          value: project.handover,
          type: 'text' as const,
        },
        project.propertyTypes?.length && {
          label: 'Types of Properties',
          value: project.propertyTypes.join(', '),
          type: 'text' as const,
        },
        project.bedroomTypes?.length && {
          label: 'Bedrooms',
          value: project.bedroomTypes.join(', '),
          type: 'text' as const,
        },
      ].filter(Boolean) as { label: string; value: string; type: 'link' | 'text'; href?: string }[]

      const sectionDetails = (section.details ?? []).map(d => ({ ...d, value: d.value ?? '' }))
      const usedLabels = new Set(autoDetails.map(d => d.label.toLowerCase().trim()))
      const uniqueSectionDetails = sectionDetails.filter(
        d => !usedLabels.has(d.label.toLowerCase().trim())
      )

      return (
        <ProjectInfo
          key={index}
          title={section.title}
          description={section.description ?? ''}
          mainImage={mediaUrl(section.mainImage)}
          images={
            section.images?.map((img) => mediaUrl(img)) as [string, string]
          }
          videoUrl={section.videoUrl}
          details={[...autoDetails, ...uniqueSectionDetails]}
          allImages={[
            mediaUrl(section.mainImage),
            ...(section.images?.map((img) => mediaUrl(img)) ?? []),
          ].filter(Boolean)}
        />
      )
    }

    case 'sections.project-keys':
      return (
        <ProjectKeys
          key={index}
          sectionTitle={section.sectionTitle}
          points={section.points ?? []}
        />
      )

    case 'sections.project-floor-plan':
      return (
        <ProjectFloorPlan
          key={index}
          sectionTitle={section.sectionTitle}
          tabs={[
            { label: 'Apartment', value: 'apartment' },
            { label: 'Duplex', value: 'duplex' },
            { label: 'Penthouse', value: 'penthouse' },
          ]}
          cards={
            section.cards?.map((card) => ({
              ...card,
              image: mediaUrl(card.image),
            })) ?? []
          }
        />
      )

    case 'sections.project-payment-plan':
      return (
        <ProjectPaymentPlan
          key={index}
          sectionTitle={section.sectionTitle}
          description={section.description}
          versions={section.versions ?? []}
          ctaLabel={section.ctaLabel}
        />
      )

    case 'sections.project-brand':
      return (
        <ProjectBrand
          key={index}
          devName={section.devName}
          description={section.description}
          logo={mediaUrl(section.logo)}
          logoText={section.logoText}
          image={mediaUrl(section.image)}
        />
      )

    case 'sections.project-amenities':
      return (
        <ProjectAmenities
          key={index}
          sectionTitle={section.sectionTitle}
          items={
            section.items?.map((item) => ({
              ...item,
              image: mediaUrl(item.image),
            })) ?? []
          }
          totalCount={section.totalCount}
          showAllLabel={section.showAllLabel}
        />
      )

    case 'sections.project-guide':
      return (
        <ProjectGuide
          key={index}
          title={section.title}
          description={section.description}
          buttonLabel={section.buttonLabel}
          image={mediaUrl(section.image)}
        />
      )

    case 'sections.project-form':
      return (
        <ProjectForm
          key={index}
          sectionTitle={section.sectionTitle}
          description={section.description}
          submitLabel={section.submitLabel}
          privacyNote={section.privacyNote}
          consentLabel={section.consentLabel}
          agent={
            section.agent
              ? {
                  name: section.agent.name,
                  role: section.agent.role ?? '',
                  image: mediaUrl(section.agent.image),
                }
              : undefined
          }
        />
      )

    case 'sections.project-dev':
      return developer ? (
        <ProjectDev
          key={index}
          devName={developer.name}
          description={developer.description ?? ''}
          image={mediaUrl(developer.imageBg)}
          logo={mediaUrl(developer.logo)}
          stats={developer.stats ?? []}
          ctaHref={`/developer/${developer.slug}`}
        />
      ) : null

    case 'sections.project-team':
      return (
        <ProjectTeam
          key={index}
          title={section.title}
          description={section.description}
          image={mediaUrl(section.image)}
          stats={section.stats ?? []}
          ctaLabel={section.ctaLabel}
          ctaHref={section.ctaHref}
        />
      )

    case 'sections.project-awards':
      return (
        <ProjectAwards
          key={index}
          sectionLabel={section.sectionLabel}
          awards={
            section.awards?.map((award) => ({
              ...award,
              image: mediaUrl(award.image),
              bgImage: mediaUrl(award.bgImage),
            })) ?? []
          }
        />
      )

    case 'sections.project-services':
      return (
        <ProjectServices
          key={index}
          sectionTitle={section.sectionTitle}
          services={
            section.services?.map((service) => ({
              ...service,
              image: mediaUrl(service.image),
            })) ?? []
          }
        />
      )

    case 'sections.project-accordion':
      return (
        <ProjectAccordion
          key={index}
          sectionTitle={section.sectionTitle}
          items={section.items ?? []}
        />
      )

    case 'sections.project-location':
      return (
        <ProjectLocation
          key={index}
          sectionTitle={section.sectionTitle}
          description={section.description}
          mapUrl={section.mapUrl}
          address={section.address}
          proximity={section.proximity}
          ctaLabel={section.ctaLabel}
          ctaHref={section.ctaHref}
        />
      )

    case 'sections.project-banner':
      return (
        <ProjectBanner
          key={index}
          title={section.title}
          description={section.description}
          ctaLabel={section.ctaLabel}
          ctaHref={section.ctaHref}
          image={section.image ? { url: getStrapiImageUrl(section.image.url) } : undefined}
        />
      )

    case 'sections.project-map':
      return (
        <ProjectMap
          key={index}
          sectionTitle={section.sectionTitle}
          body={project.district?.aboutDescription}
          latitude={section.latitude}
          longitude={section.longitude}
          zoom={section.zoom}
          proximity={section.proximity}
          ctaLabel={section.ctaLabel}
          ctaHref={section.ctaHref}
        />
      )

    default:
      return null
  }
}

function resolveGlobalBlockEntries(
  slots: StrapiGlobalBlockSlot[] | undefined,
): Array<{ section: StrapiSection; order: number }> {
  if (!slots?.length) return []

  return slots
    .filter((slot) => slot.globalBlock && !slot.globalBlock.isDeleted && slot.defaultVisible !== false)
    .flatMap((slot) =>
      slot.globalBlock.section.map((section) => ({ section, order: slot.order })),
    )
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const templateDocId = project.templateConfig?.documentId
  const templateSlots = templateDocId
    ? await getTemplateGlobalBlockSlots(templateDocId)
    : []

  // Project-level slots override template slots with the same globalBlock
  const projectSlotIds = new Set(
    project.globalBlockSlots?.map((s) => s.globalBlock?.documentId).filter(Boolean) ?? [],
  )
  const mergedSlots = [
    ...templateSlots.filter((s) => !projectSlotIds.has(s.globalBlock?.documentId)),
    ...(project.globalBlockSlots ?? []),
  ]

  const globalEntries = resolveGlobalBlockEntries(mergedSlots)

  // Merge regular sections (order = array index) with global blocks (order = slot.order)
  // Ties: regular sections come first (isGlobal flag used as secondary sort)
  const allSections = [
    ...project.sections.map((section, index) => ({ section, order: index, isGlobal: false })),
    ...globalEntries.map(({ section, order }) => ({ section, order, isGlobal: true })),
  ].sort((a, b) => a.order - b.order || (a.isGlobal ? 1 : -1))

  return (
    <main>
      {allSections.map(({ section }, index) => renderSection(section, index, project))}
      <SimilarProjects projects={MOCK_SIMILAR_PROJECTS} />
    </main>
  )
}
