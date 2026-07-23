import OurProperties from '@/components/sections/OurProperties'
import DirectorQuote from '@/components/sections/DirectorQuote'
import AgentSliderLoader from '@/components/sections/AgentSliderLoader'
import HeroHome from '@/components/sections/HeroHome'
import ProjectPromo from '@/components/sections/ProjectPromo'
import ProjectTeam, { type TeamStat } from '@/components/sections/ProjectTeam'
import ProjectAwards, { type Award } from '@/components/sections/ProjectAwards'
import ProjectServices, { type ServiceItem } from '@/components/sections/ProjectServices'
import HomeFAQ from '@/components/sections/HomeFAQ'
import AnotherContent from '@/components/sections/AnotherContent'
import SimilarProjects, { type SimilarProjectItem } from '@/components/sections/SimilarProjects'
import ArticlesSlider, { type ArticleCardItem } from '@/components/sections/ArticlesSlider'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectOfMonth, { type ProjectOfMonthItem } from '@/components/sections/ProjectOfMonth'
import Areas, { type AreaItem } from '@/components/sections/Areas'
import ConsultationBlock from '@/components/ui/ConsultationBlock'
import { getProjects } from '@/api/listings'
import { getArticles } from '@/api/articles'
import { getPageBySlug } from '@/api/pages'
import { getStrapiImageUrl } from '@/lib/utils'
import type { OffPlanProjectCard, PenthouseBlock } from '@/types/penthouse-api'

export const revalidate = 3600

// ── Helpers ────────────────────────────────────────────────────────────────────

function toSimilarProjectItem(p: OffPlanProjectCard): SimilarProjectItem {
  return {
    slug: p.pageUrl?.url?.replace(/^\/(off-plan|projects)\//, '').replace(/\/$/, '') ?? String(p.id),
    title: p.title ?? '',
    location: p.area?.title,
    developer: p.developer?.name,
    handover: p.handover ?? undefined,
    priceFrom: p.minPrice ?? undefined,
    propertyTypes: p.projectTypes?.map((t) => t.name),
    images: p.previewImage ? [getStrapiImageUrl(p.previewImage.url)] : [],
  }
}

// ── Static fallback ────────────────────────────────────────────────────────────

async function StaticHomePage() {
  const [projectsRes, articlesRes] = await Promise.all([
    getProjects({ pageSize: 12 }).catch(() => null),
    getArticles({ pageSize: 4 }),
  ])

  const projects = projectsRes?.result.data ?? []
  const similarProjects: SimilarProjectItem[] = projects.map(toSimilarProjectItem)

  const articles: ArticleCardItem[] = (articlesRes?.data ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    category: typeof a.category === 'object' && a.category !== null ? (a.category as { name?: string }).name : a.category as string | undefined,
    date: a.date,
    timeToRead: a.timeToRead,
    image: a.previewImageFile?.url ? getStrapiImageUrl(a.previewImageFile.url) : a.previewImage?.url ? getStrapiImageUrl(a.previewImage.url) : undefined,
    href: a.pageUrl?.url,
  }))

  return (
    <main>
      <HeroHome
        title="All luxury properties of Dubai in one place"
        subtitle="Tailored access to Dubai's prime real estate, curated for your lifestyle by our full-cycle real estate services."
      />
      {similarProjects.length > 0 && (
        <SimilarProjects
          projects={similarProjects}
          sectionTitle="Latest luxury projects"
          ctaLabel="See all projects"
          ctaHref="/off-plan"
        />
      )}
      <ProjectBanner
        title="Get professional property guidance"
        description="Leave your details, and an advisor will help you choose the right property and navigate the purchase process."
        ctaLabel="Learn more"
        ctaHref="#"
        image={{ url: '/images/banner-bg.png' }}
      />
      {articles.length > 0 && (
        <ArticlesSlider
          articles={articles}
          sectionTitle="Latest news"
          ctaLabel="See all news"
          ctaHref="/articles"
        />
      )}
      <ConsultationBlock
        sectionTitle="Request Information"
        description="Fill in the form below and our specialist will contact you within 24 hours."
        submitLabel="Send Request"
      />
    </main>
  )
}

// ── Dynamic block renderer ─────────────────────────────────────────────────────

function renderBlock(block: PenthouseBlock): React.ReactNode {
  switch (block.__component) {
    case 'block.main-hero': {
      const b = block as {
        title?: string
        description?: string
        imageFile?: { url: string } | null
        image?: { url: string } | null
      }
      const bgUrl = b.imageFile?.url ?? b.image?.url
      return (
        <HeroHome
          title={b.title}
          subtitle={b.description}
          bgImage={bgUrl ? getStrapiImageUrl(bgUrl) : undefined}
        />
      )
    }
    
    case 'block.slogan': {
      const b = block as { header?: string; description?: string }
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

    case 'block.another-content': {
      const b = block as {
        contentType?: string | null
        title?: string
        seeAllButton?: string
      }
      if (!b.contentType) return null
      return (
        <AnotherContent
          contentType={b.contentType}
          title={b.title}
          seeAllButton={b.seeAllButton}
        />
      )
    }

    case 'block.banner': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        imageFile?: { url: string } | null
        image?: { url: string } | null
      }
      const bannerImg = b.imageFile ?? b.image ?? undefined
      return (
        <ProjectBanner
          title={b.title}
          description={b.description}
          ctaLabel={b.buttonText}
          image={bannerImg}
        />
      )
    }

    case 'block.project-month': {
      const b = block as {
        title?: string
        items?: Array<{
          id?: number
          name?: string
          Location?: string
          description?: string
          priceValue?: number | null
          currency?: string | null
          handoverValue?: string
          unitsValue?: number
          imagesFile?: Array<{ url: string }> | null
        }>
      }
      const items: ProjectOfMonthItem[] = (b.items ?? []).map((item) => ({
        slug: String(item.id ?? Math.random()),
        title: item.name ?? '',
        location: item.Location,
        description: item.description,
        priceRange: item.priceValue != null ? String(item.priceValue) : undefined,
        handover: item.handoverValue,
        numberOfUnits: item.unitsValue,
        images: Array.isArray(item.imagesFile) ? item.imagesFile.map((img) => getStrapiImageUrl(img.url)) : [],
      }))
      if (!items.length) return null
      return <ProjectOfMonth projects={items} sectionTitle={b.title} />
    }

    case 'block.best-areas': {
      const b = block as {
        title?: string
        buttonText?: string
        areas?: Array<{
          id?: number
          title?: string
          previewImageFile?: { url: string } | null
          pageUrl?: { url: string } | null
        }>
      }
      const areaItems: AreaItem[] = (b.areas ?? []).map((area) => ({
        name: area.title ?? '',
        slug:
          area.pageUrl?.url
            ?.replace(/^\/areas\//, '')
            .replace(/\/$/, '') ?? String(area.id ?? ''),
        image: area.previewImageFile?.url
          ? getStrapiImageUrl(area.previewImageFile.url)
          : '',
      }))
      if (!areaItems.length) return null
      return (
        <Areas
          areas={areaItems}
          sectionTitle={b.title}
          ctaLabel={b.buttonText}
          ctaHref="/areas"
        />
      )
    }

    case 'block.who-we-are': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        stats?: Array<{ title: string; value: string }>
        imageFile?: { url: string } | null
        image?: { url: string } | null
      }
      const stats: TeamStat[] = (b.stats ?? []).map((s) => ({
        value: s.value,
        label: s.title,
      }))
      const whoImg = b.imageFile?.url ?? b.image?.url ?? ''
      return (
        <ProjectTeam
          title={b.title}
          description={b.description}
          image={whoImg ? getStrapiImageUrl(whoImg) : ''}
          stats={stats}
          ctaLabel={b.buttonText}
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
      if (!b.cards?.length) return null
      return (
        <OurProperties
          title={b.title}
          description={b.description}
          cards={b.cards}
        />
      )
    }

    case 'block.our-team': {
      const b = block as {
        title?: string
        buttonText?: string
        ctaHref?: string
      }
      return (
        <AgentSliderLoader
          sectionTitle={b.title}
          ctaLabel={b.buttonText}
          ctaHref={b.ctaHref}
          limit={6}
        />
      )
    }

    case 'block.director-quote': {
      const b = block as {
        quote?: string
        agent?: { name?: string; position?: string } | null
        imageFile?: { url: string; alternativeText?: string | null } | null
      }
      if (!b.quote) return null
      const agentName = b.agent?.name ?? ''
      const agentPosition = b.agent?.position
      return (
        <DirectorQuote
          quote={b.quote}
          name={agentName}
          position={agentPosition}
          imageUrl={b.imageFile?.url}
          imageAlt={b.imageFile?.alternativeText ?? agentName}
        />
      )
    }

    case 'block.awards': {
      const b = block as {
        title?: string
        award?: Array<{ title: string; description: string; image?: { url: string } }>
      }
      const awards: Award[] = (b.award ?? []).map((item) => ({
        image: item.image?.url ? getStrapiImageUrl(item.image.url) : '',
        value: item.title,
        label: item.description,
      }))
      if (!awards.length) return null
      return <ProjectAwards sectionLabel={b.title} awards={awards} />
    }

    case 'block.services': {
      const b = block as {
        title?: string
        slides?: Array<{ title: string; description?: string; imageFile?: { url: string } }>
      }
      const services: ServiceItem[] = (b.slides ?? []).map((slide) => ({
        title:       slide.title,
        description: slide.description ?? '',
        image:       slide.imageFile?.url ? getStrapiImageUrl(slide.imageFile.url) : '',
      }))
      if (!services.length) return null
      return <ProjectServices sectionTitle={b.title} services={services} />
    }

    case 'block.any-questions-block': {
      const b = block as {
        contactFormData?: {
          title?: string
          description?: string
          buttonText?: string
          agentName?: string
          agentPosition?: string
          agentImage?: { url?: string } | null
          agentImageFile?: { url?: string } | null
        }
      }
      const form = b.contactFormData ?? {}
      const agentImg = form.agentImageFile?.url ?? form.agentImage?.url ?? ''
      return (
        <ConsultationBlock
          sectionTitle={form.title}
          description={form.description}
          submitLabel={form.buttonText}
          agent={form.agentName ? {
            name: form.agentName,
            role: form.agentPosition ?? '',
            image: agentImg,
          } : undefined}
        />
      )
    }

    case 'block.faq': {
      const b = block as {
        title?: string
        questions?: Array<{ title: string; answer: string }>
      }
      return <HomeFAQ title={b.title} questions={b.questions} />
    }

    // Skip globally rendered blocks and unknown types
    case 'block.header':
    case 'block.footer':
    case 'block.reviews':
    default:
      return null
  }
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const page = await getPageBySlug('/')

  if (!page) {
    return <StaticHomePage />
  }

  // Filter out header/footer and invisible blocks
  const visibleBlocks = page.blocks.filter((b) => {
    if (b.__component === 'block.header' || b.__component === 'block.footer') return false
    if ((b as { visible?: boolean }).visible === false) return false
    return true
  })

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
