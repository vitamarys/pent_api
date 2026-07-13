import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getPageSlugs } from '@/api/pages'
import { formatCompactPrice } from '@/lib/utils'
import type { PenthousePage, PenthouseBlock } from '@/types/penthouse-api'

import HeroProject from '@/components/sections/HeroProject'
import ProjectPromo from '@/components/sections/ProjectPromo'
import ProjectInfo from '@/components/sections/ProjectInfo'
import ProjectKeys from '@/components/sections/ProjectKeys'
import ProjectFloorPlan from '@/components/sections/ProjectFloorPlan'
import ProjectPaymentPlan from '@/components/sections/ProjectPaymentPlan'
import ProjectBrand from '@/components/sections/ProjectBrand'
import ProjectDev from '@/components/sections/ProjectDev'
import ProjectAmenities from '@/components/sections/ProjectAmenities'
import ProjectAccordion from '@/components/sections/ProjectAccordion'
import ProjectTeam from '@/components/sections/ProjectTeam'
import ProjectAwards from '@/components/sections/ProjectAwards'
import ProjectBanner from '@/components/sections/ProjectBanner'
import WorkProgress from '@/components/sections/WorkProgress'
import ProjectServices from '@/components/sections/ProjectServices'

export const revalidate = 3600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs
    .filter((s) => s.startsWith('/off-plan/'))
    .map((s) => ({ slug: s.replace('/off-plan/', '').replace(/\/$/, '') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(`/off-plan/${slug}/`)
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.metaDescription,
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

function getProject(page: PenthousePage) {
  const ae = page.associatedEntity?.[0]
  if (ae?.__component === 'associated-entity.off-plan') {
    return (ae as { __component: string; project?: Record<string, unknown> }).project ?? null
  }
  return null
}

function imgUrl(file: unknown): string {
  if (!file) return ''
  const f = file as { url?: string }
  return f.url ?? ''
}

function parseHighlight(text: string): { highlight: string; rest: string } {
  const match = text.match(/\*+([^*]+)\*+(.*)/)
  if (match) return { highlight: match[1].trim(), rest: match[2].trim() }
  return { highlight: text, rest: '' }
}

// ── block renderer ────────────────────────────────────────────────────────────

function renderBlock(block: PenthouseBlock, index: number, page: PenthousePage) {
  if (block.visible === false) return null

  const project = getProject(page)


  switch (block.__component) {
    case 'block.hero': {
      const b = block as {
        title?: string
        subtitle?: string
        imageFile?: { url?: string }
      }
      const handover = (project?.handoverValue as string) ?? ''
      const minPrice = project?.minPrice as number | undefined
      const units = project?.numberOfUnits as number | undefined
      const area = (project?.area as { title?: string } | null)?.title ?? ''
      
      return (
        <HeroProject
          key={index}
          title={b.title ?? page.title}
          location={[area, 'Dubai'].filter(Boolean).join(', ')}
          description={b.subtitle ?? ''}
          image={imgUrl(b.imageFile)}
          startingPrice={minPrice ? formatCompactPrice(minPrice) : ''}
          handover={handover}
          numberOfUnits={units ? String(units) : ''}
          breadcrumb={[
            { label: 'Projects', href: '/projects' },
            { label: b.title ?? page.title },
          ]}
        />
      )
    }

    case 'block.slogan': {
      const b = block as { header?: string; description?: string }
      const { highlight, rest } = parseHighlight(b.header ?? '')
      return (
        <ProjectPromo
          key={index}
          titleHighlight={highlight}
          titleRest={rest}
          description={b.description ?? ''}
        />
      )
    }

    case 'block.overview': {
      const b = block as {
        title?: string
        description?: string
        imagesFile?: Array<{ url?: string }>
      }
      const project = getProject(page)
      const developer = project?.developer as { name?: string; pageUrl?: { url?: string } } | null
      const area = project?.area as { title?: string; pageUrl?: { url?: string } } | null
      const handover = project?.handoverValue as string | undefined
      const paymentPlan = project?.paymentPlan as string | undefined
      const types = (project?.projectTypes as Array<{ name?: string }> | undefined)
        ?.map((t) => t.name ?? '')
        .join(', ')
      const beds = (project?.beds as { multiValue?: string[] } | undefined)?.multiValue?.join(', ')
      const floors = project?.floors as string | undefined
      const brandCollaboration = project?.brandCollaboration as string | undefined

      const details: { label: string; value: string; type: 'text' | 'link'; href?: string }[] = [
        ...(area ? [{ label: 'Location', value: area.title ?? '', type: 'link' as const, href: area.pageUrl?.url }] : []),
        ...(developer
          ? [
              {
                label: 'Developer',
                value: developer.name ?? '',
                type: 'link' as const,
                href: developer.pageUrl?.url,
              },
            ]
          : []),
        ...(handover ? [{ label: 'Handover', value: handover, type: 'text' as const }] : []),
        ...(paymentPlan ? [{ label: 'Payment Plan', value: paymentPlan, type: 'text' as const }] : []),
        ...(types ? [{ label: 'Types', value: types, type: 'text' as const }] : []),
        ...(beds ? [{ label: 'Bedrooms', value: beds, type: 'text' as const }] : []),
        ...(floors ? [{ label: 'Floors', value: floors, type: 'text' as const }] : []),
        ...(brandCollaboration ? [{ label: 'Brand Collaboration', value: brandCollaboration, type: 'text' as const }] : []),
      ]

      const images = b.imagesFile?.map((f) => imgUrl(f)) ?? []
    
      return (
        <ProjectInfo
          key={index}
          title={b.title ?? ''}
          description={b.description ?? ''}
          mainImage={images[0] ?? ''}
          images={images.slice(1) as [string, string]}
          details={details}
          allImages={images}
        />
      )
    }

    case 'block.key-points': {
      const b = block as {
        title?: string
        keyPointsItems?: Array<{ id: number; title: string; description: string }>
      }
      return (
        <ProjectKeys
          key={index}
          sectionTitle={b.title ?? undefined}
          points={b.keyPointsItems ?? []}
        />
      )
    }

    case 'block.floor-plans': {
      const b = block as {
        title?: string
        floorPlans?: Array<{
          id: number
          title?: string
          type?: string
          options?: string
          price?: string
          area?: number
          bedroomsLabel?: string
          imageFile?: { url?: string }
        }>
      }
      const plans = b.floorPlans ?? []
      const uniqueTypes = [...new Set(plans.map((p) => p.type).filter(Boolean))] as string[]
      const tabs = uniqueTypes.map((t) => ({ label: t, value: t.toLowerCase() }))
      const cards = plans.map((p) => ({
        title: p.title ?? '',
        type: p.type ?? '',
        optionsLabel: p.options ? `${p.options} options` : undefined,
        bedroomsLabel: p.bedroomsLabel,
        image: imgUrl(p.imageFile),
        startingPrice: p.price ?? '',
        livingArea: p.area ? `${p.area} sq.ft` : '',
      }))
      return (
        <ProjectFloorPlan
          key={index}
          sectionTitle={b.title ?? undefined}
          tabs={tabs}
          cards={cards}
        />
      )
    }

    case 'block.payment-plan': {
      const b = block as {
        title?: string
        description?: string
        expertButton?: string
        versionLabel?: string
        step?: Array<{
          id: number
          bookingTitleValue: string
          bookingPercentValue: string
          bookingDescriptionValue: string
          bookingPaymentValue: string
          duringConstructionTitleValue: string
          duringConstructionPercentValue: string
          duringConstructionDescriptionValue: string
          duringConstructionPaymentValue: string
          onHandoverTitleValue: string
          onHandoverPercentValue: string
          onHandoverDescriptionValue: string
          onHandoverPaymentValue: string
          postHandoverTitleValue: string
          postHandoverPercentValue: string
          postHandoverDescriptionValue: string
          postHandoverPaymentValue: string
        }>
      }

      const versionPrefix = b.versionLabel || 'Option'
      const versions = (b.step ?? []).map((s, i) => ({
        id: i,
        label: `${versionPrefix} ${i + 1}`,
        stages: [
          { id: 1, title: s.bookingTitleValue || 'Booking', subtitle: s.bookingDescriptionValue || undefined, percentage: s.bookingPercentValue, paymentsLabel: s.bookingPaymentValue ? `${s.bookingPaymentValue} payments` : undefined },
          { id: 2, title: s.duringConstructionTitleValue || 'During Construction', subtitle: s.duringConstructionDescriptionValue || undefined, percentage: s.duringConstructionPercentValue, paymentsLabel: s.duringConstructionPaymentValue ? `${s.duringConstructionPaymentValue} payments` : undefined },
          { id: 3, title: s.onHandoverTitleValue || 'On Handover', subtitle: s.onHandoverDescriptionValue || undefined, percentage: s.onHandoverPercentValue, paymentsLabel: s.onHandoverPaymentValue ? `${s.onHandoverPaymentValue} payments` : undefined },
          ...(s.postHandoverTitleValue
            ? [{ id: 4, title: s.postHandoverTitleValue, subtitle: s.postHandoverDescriptionValue || undefined, percentage: s.postHandoverPercentValue, paymentsLabel: s.postHandoverPaymentValue ? `${s.postHandoverPaymentValue} payments` : undefined }]
            : []),
        ].filter((stage) => stage.percentage),
      }))

      return (
        <ProjectPaymentPlan
          key={index}
          sectionTitle={b.title ?? undefined}
          description={b.description ?? undefined}
          ctaLabel={b.expertButton ?? undefined}
          versions={versions}
        />
      )
    }

    case 'block.brand': {
      const b = block as {
        title?: string
        description?: string
        image?: { url?: string }
        logo?: { url?: string }
      }
      return (
        <ProjectBrand
          key={index}
          devName={b.title ?? ''}
          description={b.description ?? ''}
          logo={imgUrl(b.logo)}
          image={imgUrl(b.image)}
        />
      )
    }

    case 'block.amenities': {
      const b = block as {
        title?: string
        amenities?: Array<{ id: number; name: string; image?: { url?: string } }>
      }
      return (
        <ProjectAmenities
          key={index}
          sectionTitle={b.title ?? undefined}
          items={
            b.amenities?.map((a) => ({
              id: a.id,
              label: a.name,
              image: imgUrl(a.image),
            })) ?? []
          }
        />
      )
    }

    case 'block.developers': {
      const dev = project?.developer as {
        name?: string
        description?: string
        foundedIn?: string
        projectCount?: number
        areaCount?: number
        minPrice?: number
        logo?: { url?: string }
        images?: Array<{ url?: string }>
        pageUrl?: { url?: string }
      } | null

      if (!dev) return null

      const stats = [
        ...(dev.foundedIn ? [{ label: 'Founded in', value: dev.foundedIn }] : []),
        ...(dev.projectCount ? [{ label: 'Projects', value: String(dev.projectCount) }] : []),
        ...(dev.areaCount ? [{ label: 'Areas', value: String(dev.areaCount) }] : []),
        ...(dev.minPrice ? [{ label: 'Starting from', value: formatCompactPrice(dev.minPrice) }] : []),
      ]

      return (
        <ProjectDev
          key={index}
          devName={dev.name ?? ''}
          description={dev.description ?? ''}
          logo={imgUrl(dev.logo)}
          image={imgUrl(dev.images?.[0])}
          stats={stats}
          ctaHref={dev.pageUrl?.url ?? '#'}
        />
      )
    }

    case 'block.awards': {
      const b = block as {
        title?: string
        description?: string
        award?: Array<{
          id: number
          title?: string
          description?: string
          image?: { url?: string }
        }>
      }
      const awards = (b.award ?? []).map((a) => ({
        image: imgUrl(a.image),
        value: a.title ?? '',
        label: a.description ?? '',
      }))
      return (
        <ProjectAwards
          key={index}
          sectionLabel={b.description ?? b.title ?? undefined}
          awards={awards}
        />
      )
    }

    case 'block.who-we-are': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        image?: { url?: string }
        stats?: Array<{ id: number; title: string; value: string }>
      }
      return (
        <ProjectTeam
          key={index}
          title={b.title ?? undefined}
          description={b.description ?? undefined}
          image={imgUrl(b.image)}
          stats={b.stats?.map((s) => ({ value: s.value, label: s.title })) ?? []}
          ctaLabel={b.buttonText ?? undefined}
        />
      )
    }

    case 'block.faq': {
      const b = block as {
        title?: string
        questions?: Array<{ id: number; question: string; answer: string }>
      }
      return (
        <ProjectAccordion
          key={index}
          sectionTitle={b.title ?? undefined}
          items={b.questions ?? []}
        />
      )
    }

    case 'block.services': {
      const b = block as {
        title?: string
        description?: string
        slides?: Array<{
          id: number
          title?: string
          description?: string
          imageFile?: { url?: string }
        }>
      }
      return (
        <ProjectServices
          key={index}
          sectionTitle={b.description ?? b.title ?? undefined}
          services={(b.slides ?? []).map((s) => ({
            title: s.title ?? '',
            description: s.description ?? '',
            image: imgUrl(s.imageFile),
          }))}
        />
      )
    }

    case 'block.working-process': {
      const b = block as {
        title?: string
        description?: string
        videoURL?: string
        videoButton?: string
        previewVideo?: { url?: string }
        steps?: Array<{ id: number; title: string; value: string }>
      }
      return (
        <WorkProgress
          key={index}
          sectionTitle={b.title ?? undefined}
          description={b.description ?? undefined}
          steps={b.steps ?? []}
          videoUrl={b.videoURL ?? undefined}
          videoButton={b.videoButton ?? undefined}
          previewImage={imgUrl(b.previewVideo) || undefined}
        />
      )
    }

    case 'block.banner': {
      const b = block as {
        title?: string
        description?: string
        image?: { url?: string }
      }
      if (!b.title && !b.image) return null
      return (
        <ProjectBanner
          key={index}
          title={b.title}
          description={b.description}
          image={b.image?.url ? { url: b.image.url } : undefined}
        />
      )
    }

    default:
      return null
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function OffPlanPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(`/off-plan/${slug}/`)

  if (!page || page.pageStatus !== 'PUBLISH' || page.deleted) notFound()

  const visibleBlocks = page.blocks.filter(
    (b) => !['block.header', 'block.footer'].includes(b.__component),
  )

  return (
    <main>
      {visibleBlocks.map((block, index) => renderBlock(block, index, page))}
    </main>
  )
}
