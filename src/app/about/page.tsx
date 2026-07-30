import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/api/pages'
import type { PenthouseBlock } from '@/types/penthouse-api'

import AboutHero from '@/components/sections/AboutHero'
import ProjectTeam from '@/components/sections/ProjectTeam'
import WorkProgress from '@/components/sections/WorkProgress'
import OurProperties from '@/components/sections/OurProperties'
import DirectorQuote from '@/components/sections/DirectorQuote'
import ProjectAwards from '@/components/sections/ProjectAwards'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectServices from '@/components/sections/ProjectServices'
import AnotherContent from '@/components/sections/AnotherContent'
import ConsultationBlock from '@/components/ui/ConsultationBlock'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('/about/')
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.metaDescription,
  }
}

function imgUrl(file: unknown): string {
  if (!file) return ''
  return (file as { url?: string }).url ?? ''
}

function renderBlock(block: PenthouseBlock, index: number) {
  if (block.visible === false) return null

  switch (block.__component) {
    case 'block.hero': {
      const b = block as {
        title?: string
        description?: string
        imageFile?: { url?: string }
      }
      return (
        <AboutHero
          key={index}
          title={b.title ?? undefined}
          description={b.description ?? undefined}
          bgImage={imgUrl(b.imageFile) || undefined}
          breadcrumbs={[{ label: 'About us' }]}
        />
      )
    }

    case 'block.who-we-are': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        stats?: Array<{ title: string; value: string }>
        image?: { url: string }
        imageFile?: { url?: string }
      }
      const imageUrl = b.image?.url || imgUrl(b.imageFile)
      return (
        <ProjectTeam
          key={index}
          title={b.title}
          description={b.description}
          image={imageUrl}
          stats={(b.stats ?? []).map((s) => ({ value: s.value, label: s.title }))}
          ctaLabel={b.buttonText}
        />
      )
    }

    case 'block.working-process': {
      const b = block as {
        title?: string
        description?: string
        videoURL?: string
        videoButton?: string
        steps?: Array<{ title: string; value: string }>
        image?: { url: string }
        imageFile?: { url?: string }
      }
      const previewImage = b.image?.url || imgUrl(b.imageFile)
      return (
        <WorkProgress
          key={index}
          sectionTitle={b.title}
          description={b.description}
          steps={(b.steps ?? []).map((s, i) => ({ id: i, title: s.title, value: s.value }))}
          videoUrl={b.videoURL}
          videoButton={b.videoButton}
          previewImage={previewImage || undefined}
        />
      )
    }

    case 'block.our-properties': {
      const b = block as {
        title?: string
        description?: string
        cards?: Array<{
          id?: number
          title?: string
          priceValue?: number | null
          currency?: string | null
          url?: string | null
          imageFile?: { url: string; alternativeText?: string | null } | null
        }>
      }
      return (
        <OurProperties
          key={index}
          title={b.title}
          description={b.description}
          cards={b.cards}
        />
      )
    }

    case 'block.director-quote': {
      const b = block as {
        quote?: string
        name?: string
        position?: string
        imageFile?: { url?: string }
        agent?: {
          name?: string
          position?: string
          image?: { url?: string }
        }
      }
      const imageUrl = imgUrl(b.imageFile) || b.agent?.image?.url || ''
      return (
        <DirectorQuote
          key={index}
          quote={b.quote ?? ''}
          name={b.agent?.name ?? b.name ?? ''}
          position={b.agent?.position ?? b.position}
          imageUrl={imageUrl || undefined}
        />
      )
    }

    case 'block.awards': {
      const b = block as {
        title?: string
        award?: Array<{
          title: string
          description: string
          image?: { url: string }
          imageFile?: { url?: string }
        }>
      }
      return (
        <ProjectAwards
          key={index}
          sectionLabel={b.title}
          awards={(b.award ?? []).map((a) => ({
            value: a.title,
            label: a.description,
            image: a.image?.url || a.imageFile?.url || '',
          }))}
        />
      )
    }

    case 'block.banner': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        imageFile?: { url?: string }
      }
      const bannerImg = imgUrl(b.imageFile)
      return (
        <ProjectBanner
          key={index}
          title={b.title}
          description={b.description}
          ctaLabel={b.buttonText}
          image={bannerImg ? { url: bannerImg } : undefined}
        />
      )
    }

    case 'block.services': {
      const b = block as {
        title?: string
        slides?: Array<{
          title: string
          description?: string
          imageFile?: { url?: string }
        }>
      }
      return (
        <ProjectServices
          key={index}
          sectionTitle={b.title}
          services={(b.slides ?? []).map((s) => ({
            title: s.title,
            description: s.description ?? '',
            image: s.imageFile?.url ?? '',
          }))}
        />
      )
    }

    case 'block.another-content': {
      const b = block as {
        contentType?: string
        title?: string
        seeAllButton?: string
      }
      return (
        <AnotherContent
          key={index}
          contentType={b.contentType}
          title={b.title}
          seeAllButton={b.seeAllButton}
        />
      )
    }

    case 'block.any-questions-block': {
      const b = block as {
        contactFormData?: {
          title?: string
          description?: string
          buttonText?: string | null
          agentName?: string | null
          agentPosition?: string | null
          agentImage?: { url?: string } | null
          agentImageFile?: { url?: string } | null
          agent?: {
            name?: string
            position?: string
            image?: { url?: string }
          } | null
        }
      }
      const f = b.contactFormData
      const agentImageUrl =
        f?.agent?.image?.url ||
        imgUrl(f?.agentImageFile) ||
        imgUrl(f?.agentImage) ||
        ''
      const agent =
        f?.agentName
          ? { name: f.agentName, role: f.agentPosition ?? '', image: agentImageUrl }
          : f?.agent
          ? { name: f.agent.name ?? '', role: f.agent.position ?? '', image: agentImageUrl }
          : undefined
      return (
        <ConsultationBlock
          key={index}
          sectionTitle={f?.title}
          description={f?.description}
          submitLabel={f?.buttonText ?? undefined}
          agent={agent}
        />
      )
    }

    default:
      return null
  }
}

export default async function AboutPage() {
  const page = await getPageBySlug('/about/')
  if (!page) notFound()

  return (
    <main>
      {page.blocks.map((block, i) => renderBlock(block, i))}
    </main>
  )
}
