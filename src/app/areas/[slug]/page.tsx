import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAreaBySlug, getAreaSlugs } from '@/api/areas'
import { getProjectsByDistrictSlug } from '@/api/projects'
import { getStrapiImageUrl } from '@/lib/utils'

import HeroArea from '@/components/sections/HeroArea'
import AboutArea from '@/components/sections/AboutArea'
import AreaOverview from '@/components/sections/AreaOverview'
import DeveloperProjects from '@/components/sections/DeveloperProjects'
import ProjectMap from '@/components/sections/ProjectMap'
import ProjectAccordion from '@/components/sections/ProjectAccordion'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAreaSlugs()
  return slugs.slice(0, 50).map(({ slug }) => ({ slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await getAreaBySlug(slug)
  if (!area) return {}
  return {
    title: area.seo?.metaTitle ?? area.name,
    description: area.seo?.metaDescription ?? area.description,
  }
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params
  const [area, projects] = await Promise.all([
    getAreaBySlug(slug),
    getProjectsByDistrictSlug(slug),
  ])
  if (!area) notFound()

  const mediaUrl = (media?: { url: string } | null) =>
    media ? getStrapiImageUrl(media.url) : ''

  return (
    <>
      {/* ── Hero ── */}
      <HeroArea
        title={area.name}
        description={area.description ?? ''}
        image={mediaUrl(area.heroImage)}
        breadcrumb={[
          { label: 'Areas', href: '/areas' },
          { label: area.name },
        ]}
      />

      {/* ── About the district ── */}
      {area.aboutDescription && (
        <AboutArea
          sectionTitle={area.aboutTitle ?? 'About the district'}
          description={area.aboutDescription}
          features={area.features?.map((f) => ({
            title: f.title,
            description: f.description,
          }))}
        />
      )}

      {/* ── Projects in this district ── */}
      {projects.length > 0 && (
        <DeveloperProjects
          developerName={area.name}
          sectionTitle={`Latest Projects in ${area.name}`}
          projects={projects.map((p) => ({
            title: p.title,
            slug: p.slug,
            location: [p.district?.name, p.district?.city].filter(Boolean).join(', '),
            developerName: p.developer?.name ?? '',
            handover: p.handover,
            priceFrom: p.priceFrom,
            images: p.images ?? [],
            propertyTypes: p.propertyTypes,
          }))}
        />
      )}

      {/* ── Area overview (tabs + image) ── */}
      {(area.overviewTabs?.length || area.overviewImage) && (
        <AreaOverview
          image={mediaUrl(area.overviewImage)}
          tabs={area.overviewTabs?.map((t) => ({
            label: t.label,
            content: t.content,
          }))}
        />
      )}

      {/* ── Map (data from Strapi) ── */}
      {(area.latitude || area.longitude) && (
        <ProjectMap
          sectionTitle="Location"
          body={area.mapBody}
          latitude={area.latitude}
          longitude={area.longitude}
          zoom={area.mapZoom ?? 13}
          proximity={area.mapProximity?.map((p) => ({
            id: p.id,
            label: p.label,
            value: p.value,
          }))}
        />
      )}

      {/* ── FAQ ── */}
      {area.faqItems && area.faqItems.length > 0 && (
        <ProjectAccordion
          sectionTitle="Frequently Asked Questions"
          items={area.faqItems.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))}
        />
      )}
    </>
  )
}
