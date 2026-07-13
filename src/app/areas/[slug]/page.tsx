import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/api/pages'
import { getAreaSlugs } from '@/api/areas'
import type { PenthousePage, PenthouseBlock } from '@/types/penthouse-api'

import AreaHighlights from '@/components/sections/AreaHighlights'
import HeroArea from '@/components/sections/HeroArea'
import AboutArea from '@/components/sections/AboutArea'
import AreaOverview from '@/components/sections/AreaOverview'
import DeveloperProjects from '@/components/sections/DeveloperProjects'
import DeveloperSlider from '@/components/sections/DeveloperSlider'
import ProjectAccordion from '@/components/sections/ProjectAccordion'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectForm from '@/components/sections/ProjectForm'
import ProjectMap from '@/components/sections/ProjectMap'
import ProjectQr from '@/components/sections/ProjectQr'
import ProjectServices from '@/components/sections/ProjectServices'
import WorkProgress from '@/components/sections/WorkProgress'

export const revalidate = 3600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAreaSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(`/areas/${slug}/`)
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.metaDescription,
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

interface AreaEntity {
  name?: string
  description?: string
  image?: { url?: string } | null
  images?: Array<{ url?: string }>
}

function getAreaEntity(page: PenthousePage): AreaEntity | null {
  const ae = page.associatedEntity?.[0] as { __component: string; area?: AreaEntity } | undefined
  if (ae?.__component === 'associated-entity.area') return ae.area ?? null
  return null
}

function imgUrl(file: unknown): string {
  if (!file) return ''
  return (file as { url?: string }).url ?? ''
}

// ── block renderer ────────────────────────────────────────────────────────────

function renderBlock(block: PenthouseBlock, index: number, page: PenthousePage) {
  if (block.visible === false) return null
  const area = getAreaEntity(page)
  console.log(block);
  
  switch (block.__component) {
    case 'block.hero': {
      const b = block as { title?: string; subtitle?: string; imageFile?: { url?: string } }
      return (
        <HeroArea
          key={index}
          title={b.title ?? page.title}
          description={b.subtitle ?? ''}
          image={imgUrl(b.imageFile)}
          breadcrumb={[
            { label: 'Areas', href: '/areas' },
            { label: b.title ?? page.title },
          ]}
        />
      )
    }

    case 'block.key-points': {
      const b = block as {
        title?: string
        description?: string
        keyPointsItems?: Array<{ id: number; title: string; description: string }>
      }
      return (
        <AboutArea
          key={index}
          sectionTitle={b.title ?? undefined}
          description={b.description ?? ''}
          features={b.keyPointsItems ?? []}
        />
      )
    }

    case 'block.highlights': {
      const b = block as {
        title?: string
        items?: Array<{
          id: number
          title: string
          description: string
          image?: { url?: string } | null
        }>
      }
      return (
        <AreaHighlights
          key={index}
          sectionTitle={b.title ?? undefined}
          items={(b.items ?? []).map((item) => ({
            title: item.title,
            description: item.description,
            image: item.image?.url ?? '',
          }))}
        />
      )
    }

    case 'block.area-overview': {
      const b = block as {
        title?: string
        points?: Array<{
          id: number
          pointLabel: string
          pointDescription: string
          image?: { url?: string } | null
        }>
      }
      return (
        <AreaOverview
          key={index}
          sectionTitle={b.title ?? undefined}
          tabs={(b.points ?? []).map((p) => ({
            label: p.pointLabel,
            content: p.pointDescription,
            image: p.image?.url ?? undefined,
          }))}
        />
      )
    }

    case 'block.faq': {
      const b = block as {
        title?: string
        questions?: Array<{ id: number; title: string; answer: string }>
      }
      return (
        <ProjectAccordion
          key={index}
          sectionTitle={b.title ?? undefined}
          items={(b.questions ?? []).map((q) => ({ title: q.title, answer: q.answer }))}
        />
      )
    }

    case 'block.banner': {
      const b = block as { title?: string; description?: string; buttonText?: string; image?: { url?: string } | null }
      if (!b.title && !b.image) return null
      return (
        <ProjectBanner
          key={index}
          title={b.title}
          description={b.description}
          ctaLabel={b.buttonText ?? undefined}
          image={b.image?.url ? { url: b.image.url } : undefined}
        />
      )
    }

    case 'block.any-questions-block': {
      const b = block as {
        contactFormData?: {
          title?: string
          description?: string
          buttonText?: string
          agreeText?: string
          policyText?: string
          agentName?: string
          agentPosition?: string
          agentImage?: { url?: string } | null
        }
      }
      const form = b.contactFormData
      return (
        <ProjectForm
          key={index}
          sectionTitle={form?.title ?? undefined}
          description={form?.description ?? undefined}
          submitLabel={form?.buttonText ?? undefined}
          consentLabel={form?.agreeText ?? undefined}
          privacyNote={form?.policyText ?? undefined}
          agent={form?.agentName ? {
            name: form.agentName,
            role: form.agentPosition ?? '',
            image: form.agentImage?.url ?? '',
          } : undefined}
        />
      )
    }

    case 'block.project-qr-code': {
      const b = block as {
        tag?: string
        description?: string
        qrImage?: { url?: string } | null
      }
      return (
        <ProjectQr
          key={index}
          tagLabel={b.tag ?? undefined}
          description={b.description ?? undefined}
          qrUrl={b.qrImage?.url ?? null}
        />
      )
    }

    case 'block.services': {
      const b = block as {
        title?: string
        description?: string
        slides?: Array<{ id: number; title?: string; description?: string; imageFile?: { url?: string } }>
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

    case 'block.location': {
      const b = block as {
        title?: string
        description?: string
        mapLink?: string
        zoom?: number
        points?: Array<{ id: number; title: string; value: string }>
      }
      const [latitude, longitude] = (b.mapLink ?? '')
        .split(',')
        .map((s) => parseFloat(s.trim()))
      if (!latitude || !longitude) return null
      return (
        <ProjectMap
          key={index}
          sectionTitle={b.title ?? undefined}
          body={b.description}
          latitude={latitude}
          longitude={longitude}
          zoom={b.zoom ?? 13}
          proximity={b.points?.map((p) => ({ id: p.id, label: p.title, value: p.value }))}
        />
      )
    }

    case 'block.another-content': {
      const b = block as {
        title?: string
        contentType?: string
        seeAllButton?: string | null
        projects?: Array<{
          id: number
          name?: string
          title?: string
          pageUrl?: { url?: string } | null
          area?: { title?: string } | null
          developer?: { name?: string } | null
          handoverValue?: string
          minPrice?: number
          imagesFile?: Array<{ url?: string }>
          projectTypes?: Array<{ name?: string }>
        }>
        developers?: Array<{
          id: number
          name: string
          description?: string
          pageUrl?: { url?: string } | null
          imageFile?: { url?: string } | null
          imagesFile?: Array<{ url?: string }>
        }>
      }

      if (b.contentType === 'projects') {
        const projects = (b.projects ?? []).map((p) => ({
          title: p.title ?? p.name ?? '',
          slug: (p.pageUrl?.url ?? '').replace(/^\/projects\//, '').replace(/\/$/, '') || String(p.id),
          location: p.area?.title ?? '',
          developerName: p.developer?.name ?? '',
          handover: p.handoverValue,
          priceFrom: p.minPrice,
          images: (p.imagesFile ?? []).map((f) => ({ url: f.url ?? '' })),
          propertyTypes: p.projectTypes?.map((t) => t.name ?? '').filter(Boolean),
        }))
        return (
          <DeveloperProjects
            key={index}
            developerName={area?.name ?? ''}
            sectionTitle={b.title ?? undefined}
            ctaLabel={b.seeAllButton ?? undefined}
            projects={projects}
          />
        )
      }

      if (b.contentType === 'developers') {
        const developers = (b.developers ?? []).map((d) => ({
          name: d.name,
          slug: (d.pageUrl?.url ?? '').replace(/^\/developers\//, '').replace(/\/$/, '') || String(d.id),
          description: d.description,
          logo: d.imageFile?.url ? { url: d.imageFile.url } : undefined,
          imageBg: d.imagesFile?.[0]?.url ? { url: d.imagesFile[0].url } : undefined,
        }))
        return (
          <DeveloperSlider
            key={index}
            developers={developers}
            sectionTitle={b.title ?? undefined}
            ctaLabel={b.seeAllButton ?? undefined}
          />
        )
      }

      return null
    }

    default:
      return null
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function AreaPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(`/areas/${slug}/`)

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
