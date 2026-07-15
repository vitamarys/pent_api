import HeroHome from '@/components/sections/HeroHome'
import ProjectPromo from '@/components/sections/ProjectPromo'
import HomeWhoWeAre from '@/components/sections/HomeWhoWeAre'
import HomeAwards from '@/components/sections/HomeAwards'
import HomeServices from '@/components/sections/HomeServices'
import HomeFAQ from '@/components/sections/HomeFAQ'
import AnotherContent from '@/components/sections/AnotherContent'
import SimilarProjects, { type SimilarProjectItem } from '@/components/sections/SimilarProjects'
import ArticlesSlider, { type ArticleCardItem } from '@/components/sections/ArticlesSlider'
import ProjectBanner from '@/components/sections/ProjectBanner'
import ProjectOfMonth, { type ProjectOfMonthItem } from '@/components/sections/ProjectOfMonth'
import Areas, { type AreaItem } from '@/components/sections/Areas'
import ProjectForm from '@/components/sections/ProjectForm'
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
    images: p.previewImageFile ? [getStrapiImageUrl(p.previewImageFile.url)] : [],
  }
}

// ── Static fallback ────────────────────────────────────────────────────────────

async function StaticHomePage() {
  const [projectsRes, articlesRes] = await Promise.all([
    getProjects({ pageSize: 8, sort: 'newest' }).catch(() => null),
    getArticles({ pageSize: 4 }),
  ])

  const projects = projectsRes?.result.data ?? []
  const similarProjects: SimilarProjectItem[] = projects.map(toSimilarProjectItem)

  const articles: ArticleCardItem[] = (articlesRes?.data ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    category: a.category,
    date: a.date,
    timeToRead: a.timeToRead,
    image: a.previewImage ? getStrapiImageUrl(a.previewImage.url) : undefined,
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
      <ProjectForm
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
        image?: { url: string }
      }
      return (
        <HeroHome
          title={b.title}
          subtitle={b.description}
          bgImage={b.image?.url ? getStrapiImageUrl(b.image.url) : undefined}
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
        image?: { url: string }
      }
      return (
        <ProjectBanner
          title={b.title}
          description={b.description}
          ctaLabel={b.buttonText}
          image={b.image}
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
          priceValue?: string | null
          handoverValue?: string
          unitsValue?: number
          images?: Array<{ url: string }>
        }>
      }
      const items: ProjectOfMonthItem[] = (b.items ?? []).map((item) => ({
        slug: String(item.id ?? Math.random()),
        title: item.name ?? '',
        location: item.Location,
        description: item.description,
        priceRange: item.priceValue ?? undefined,
        handover: item.handoverValue,
        numberOfUnits: item.unitsValue,
        images: item.images?.map((img) => getStrapiImageUrl(img.url)) ?? [],
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
        image?: { url: string }
      }
      return (
        <HomeWhoWeAre
          title={b.title}
          description={b.description}
          buttonText={b.buttonText}
          stats={b.stats}
          image={b.image}
        />
      )
    }

    case 'block.our-properties': {
      const b = block as { cards?: unknown[] }
      if (!b.cards?.length) return null
      // Render omitted — no dedicated component; skip
      return null
    }

    case 'block.awards': {
      const b = block as {
        title?: string
        award?: Array<{ title: string; description: string; image?: { url: string } }>
      }
      return <HomeAwards title={b.title} award={b.award} />
    }

    case 'block.services': {
      const b = block as {
        title?: string
        slides?: Array<{ title: string; description?: string; imageFile?: { url: string } }>
      }
      return <HomeServices title={b.title} slides={b.slides} />
    }

    case 'block.any-questions-block': {
      const b = block as {
        contactFormData?: {
          title?: string
          description?: string
          buttonText?: string
          nameLabel?: string | null
          emailLabel?: string | null
          phoneLabel?: string | null
        }
      }
      const form = b.contactFormData ?? {}
      return (
        <ProjectForm
          sectionTitle={form.title}
          description={form.description}
          submitLabel={form.buttonText}
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
