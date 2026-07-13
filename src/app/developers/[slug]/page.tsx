import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/api/pages'
import { getDeveloperSlugs } from '@/api/developers'
import type { PenthouseBlock } from '@/types/penthouse-api'

import DeveloperAbout from '@/components/sections/DeveloperAbout'
import DeveloperProjects from '@/components/sections/DeveloperProjects'
import DeveloperSlider from '@/components/sections/DeveloperSlider'
import HeroDeveloper from '@/components/sections/HeroDeveloper'
import ProjectAccordion from '@/components/sections/ProjectAccordion'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectForm from '@/components/sections/ProjectForm'
import ProjectQr from '@/components/sections/ProjectQr'
import WorkProgress from '@/components/sections/WorkProgress'
import ProjectServices from '@/components/sections/ProjectServices'

export const revalidate = 3600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getDeveloperSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(`/developers/${slug}/`)
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.metaDescription,
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

interface DeveloperEntity {
  name?: string
  description?: string
  image?: { url?: string } | null
  images?: Array<{ url?: string }>
  foundedIn?: string
  projectCount?: number
  completedProjectsCount?: string | number
  underConstructionProjectsCount?: string | number
}

function getDeveloperEntity(page: { associatedEntity?: Array<{ __component: string; developer?: DeveloperEntity }> }): DeveloperEntity | null {
  const ae = page.associatedEntity?.[0]
  if (ae?.__component === 'associated-entity.developer') return ae.developer ?? null
  return null
}

function imgUrl(file: unknown): string {
  if (!file) return ''
  return (file as { url?: string }).url ?? ''
}

// ── block renderer ────────────────────────────────────────────────────────────

function renderBlock(block: PenthouseBlock, index: number) {
  if (block.visible === false) return null
  console.log(block)
  switch (block.__component) {
    case 'block.key-points': {
      const b = block as {
        title?: string
        description?: string
        keyPointsItems?: Array<{ id: number; title: string; description: string }>
      }
      return (
        <DeveloperAbout
          key={index}
          sectionTitle={b.title ?? undefined}
          sectionDescription={b.description ?? undefined}
          features={b.keyPointsItems ?? []}
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

    case 'block.another-content': {
      const b = block as {
        title?: string
        contentType?: string
        seeAllButton?: string | null
        developers?: Array<{
          id: number
          name: string
          description?: string
          pageUrl?: { url?: string } | null
          imageFile?: { url?: string } | null
          imagesFile?: Array<{ url?: string }>
        }>
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
            developerName={''}
            sectionTitle={b.title ?? undefined}
            ctaLabel={b.seeAllButton ?? undefined}
            projects={projects}
          />
        )
      }

      if (b.contentType !== 'developers') return null
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

    default:
      return null
  }
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function DeveloperPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(`/developers/${slug}/`)

  if (!page || page.pageStatus !== 'PUBLISH' || page.deleted) notFound()

  const visibleBlocks = page.blocks.filter(
    (b) => !['block.header', 'block.footer'].includes(b.__component),
  )

  const dev = getDeveloperEntity(page as { associatedEntity?: Array<{ __component: string; developer?: DeveloperEntity }> })

  const stats = []
  if (dev?.foundedIn) stats.push({ label: 'Founded in', value: String(dev.foundedIn).slice(0, 4) })
  if (dev?.completedProjectsCount) stats.push({ label: 'Completed', value: String(dev.completedProjectsCount) })
  if (dev?.underConstructionProjectsCount) stats.push({ label: 'Under Construction', value: String(dev.underConstructionProjectsCount) })

  return (
    <main>
      {dev && (
        <HeroDeveloper
          name={dev.name ?? ''}
          description={dev.description ?? ''}
          bgImage={dev.images?.[0]?.url ?? dev.image?.url ?? ''}
          logo={dev.image?.url ?? undefined}
          stats={stats}
          breadcrumb={[
            { label: 'Developers', href: '/developers' },
            { label: dev.name ?? '' },
          ]}
        />
      )}
      {visibleBlocks.map((block, index) => renderBlock(block, index))}
    </main>
  )
}
