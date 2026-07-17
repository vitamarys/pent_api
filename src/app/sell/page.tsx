import { Metadata } from 'next'
import SellHero from '@/components/sections/SellHero'
import ProjectPromo from '@/components/sections/ProjectPromo'
import AreaHighlights, { type AreaHighlightItem } from '@/components/sections/AreaHighlights'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectTeam, { type TeamStat } from '@/components/sections/ProjectTeam'
import MarketingSupport from '@/components/sections/MarketingSupport'
import ProjectAwards, { type Award } from '@/components/sections/ProjectAwards'
import WorkProgress, { type WorkStep } from '@/components/sections/WorkProgress'
import ConsultationBlock from '@/components/ui/ConsultationBlock'
import HomeFAQ from '@/components/sections/HomeFAQ'
import { getPageBySlug } from '@/api/pages'
import { getStrapiImageUrl } from '@/lib/utils'
import type { PenthouseBlock } from '@/types/penthouse-api'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('/sell/')
  if (!page?.seo) return { title: 'Sell | Penthouse.ae' }
  return {
    title: page.seo.title,
    description: page.seo.metaDescription,
  }
}

function renderBlock(block: PenthouseBlock): React.ReactNode {
  if ((block as { visible?: boolean }).visible === false) return null

  switch (block.__component) {

    case 'block.hero': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string | null
        imageFile?: { url: string } | null
      }
      return (
        <SellHero
          title={b.title ?? undefined}
          description={b.description ?? undefined}
          ctaLabel={b.buttonText ?? 'Get Consultation'}
          bgImage={b.imageFile?.url ? getStrapiImageUrl(b.imageFile.url) : undefined}
          breadcrumbs={[{ label: 'Sell' }]}
        />
      )
    }

    case 'block.slogan': {
      const b = block as { header?: string; description?: string }
      if (!b.header && !b.description) return null
      const match = b.header?.match(/^\*(.+?)\*\s*(.*)$/)
      const titleHighlight = match?.[1] ?? b.header ?? ''
      const titleRest = match?.[2] ?? ''
      return (
        <ProjectPromo
          titleHighlight={titleHighlight}
          titleRest={titleRest}
          description={b.description ?? ''}
          bg="white"
        />
      )
    }

    case 'block.highlights': {
      const b = block as {
        title?: string
        items?: Array<{
          title: string
          description: string
          image?: { url: string } | null
        }>
      }
      if (!b.items?.length) return null
      const items: AreaHighlightItem[] = b.items.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.image?.url ? getStrapiImageUrl(item.image.url) : '',
      }))
      return <AreaHighlights sectionTitle={b.title} items={items} />
    }

    case 'block.banner': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string | null
        image?: { url: string } | null
      }
      return (
        <ProjectBanner
          title={b.title}
          description={b.description}
          ctaLabel={b.buttonText ?? undefined}
          image={b.image ?? undefined}
        />
      )
    }

    case 'block.who-we-are': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        stats?: Array<{ title: string; value: string }>
        image?: { url: string } | null
      }
      const stats: TeamStat[] = (b.stats ?? []).map((s) => ({
        value: s.value,
        label: s.title,
      }))
      return (
        <ProjectTeam
          title={b.title}
          description={b.description}
          image={b.image?.url ? getStrapiImageUrl(b.image.url) : ''}
          stats={stats}
          ctaLabel={b.buttonText}
        />
      )
    }

    case 'block.marketing-support': {
      const b = block as {
        title?: string
        description?: string
        items?: Array<{ id?: number; description?: string }>
      }
      if (!b.items?.length) return null
      return (
        <MarketingSupport
          sectionTitle={b.title}
          description={b.description}
          items={b.items.map((item, i) => ({
            number: String(i + 1).padStart(2, '0'),
            title: item.description ?? '',
          }))}
        />
      )
    }

    case 'block.awards': {
      const b = block as {
        title?: string
        award?: Array<{ title: string; description: string; image?: { url: string } | null }>
      }
      const awards: Award[] = (b.award ?? []).map((item) => ({
        image: item.image?.url ? getStrapiImageUrl(item.image.url) : '',
        value: item.title,
        label: item.description,
      }))
      if (!awards.length) return null
      return <ProjectAwards sectionLabel={b.title} awards={awards} />
    }

    case 'block.working-process': {
      const b = block as {
        title?: string
        description?: string
        videoURL?: string | null
        videoButton?: string | null
        image?: { url: string } | null
        steps?: Array<{ id: number; title: string; value: string }>
      }
      if (!b.steps?.length) return null
      const steps: WorkStep[] = b.steps.map((s) => ({
        id: s.id,
        title: s.title,
        value: s.value,
      }))
      return (
        <WorkProgress
          sectionTitle={b.title}
          description={b.description}
          steps={steps}
          videoUrl={b.videoURL ?? undefined}
          videoButton={b.videoButton ?? undefined}
          previewImage={b.image?.url ? getStrapiImageUrl(b.image.url) : undefined}
        />
      )
    }

    case 'block.any-questions-block': {
      const b = block as {
        contactFormData?: {
          title?: string
          description?: string
          buttonText?: string
          agentName?: string | null
          agentPosition?: string | null
          agentImage?: { url?: string } | null
        }
      }
      const form = b.contactFormData ?? {}
      return (
        <div id="contact">
          <ConsultationBlock
            sectionTitle={form.title}
            description={form.description}
            submitLabel={form.buttonText}
            agent={form.agentName ? {
              name: form.agentName,
              role: form.agentPosition ?? '',
              image: form.agentImage?.url ?? '',
            } : undefined}
          />
        </div>
      )
    }

    case 'block.faq': {
      const b = block as {
        title?: string
        questions?: Array<{ title: string; answer: string }>
      }
      if (!b.questions?.length) return null
      return <HomeFAQ title={b.title} questions={b.questions} />
    }

    case 'block.header':
    case 'block.footer':
    default:
      return null
  }
}

export default async function SellPage() {
  const page = await getPageBySlug('/sell/')

  if (!page) return null

  const visibleBlocks = page.blocks.filter(
    (b) => b.__component !== 'block.header' && b.__component !== 'block.footer',
  )

  return (
    <main>
      {visibleBlocks.map((block, i) => {
        const node = renderBlock(block)
        if (!node) return null
        return <div key={`${block.__component}-${i}`}>{node}</div>
      })}
    </main>
  )
}
