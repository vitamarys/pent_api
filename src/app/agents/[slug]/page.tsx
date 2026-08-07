import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, getPageSlugs } from '@/api/pages'
import { getProperty } from '@/api/listings'
import { getArticles } from '@/api/articles'
import { getStrapiImageUrl } from '@/lib/utils'
import AgentHero from '@/components/sections/AgentHero'
import AgentProperties from '@/components/sections/AgentProperties'
import type { SimilarProjectItem } from '@/components/sections/SimilarProjects'
import AgentArticles from '@/components/sections/AgentArticles'
import type { NewsItem } from '@/components/sections/NewsSlider'

export const revalidate = 3600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs
    .filter((s) => s.startsWith('/agents/'))
    .map((s) => ({
      slug: s.replace('/agents/', '').replace(/\/$/, ''),
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(`/agents/${slug}/`)
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/agents/${slug}`,
    },
  }
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(`/agents/${slug}/`)
  if (!page) notFound()

  // Agent data lives in associatedEntity[0].agent
  const entity = (page.associatedEntity ?? [])[0] as Record<string, unknown> | undefined
  const agent = (entity?.agent ?? entity) as Record<string, unknown> | undefined

  if (!agent) notFound()

  function imgUrl(file: unknown): string {
    if (!file) return ''
    return (file as { url?: string }).url ?? ''
  }

  const imageUrl =
    imgUrl(agent.imageFile) ||
    imgUrl((agent as { image?: unknown }).image) ||
    ''

  const languages = (agent.languages as Array<{ name?: string } | string> | undefined) ?? []

  type RawBlock = {
    id: string
    type: string
    props?: Record<string, unknown>
    content?: Array<{ type: 'text'; text: string; styles?: Record<string, unknown> }>
    children?: RawBlock[]
  }
  const content = (agent.content as RawBlock[]) ?? []

  const agentId = agent.id as number | undefined
  const agentName = (agent.name as string) ?? ''

  // Fetch agent's properties and articles in parallel
  const [propertyRes, articlesRes] = await Promise.all([
    agentId ? getProperty({ pageSize: 8, agents: agentId }).catch(() => null) : null,
    agentId ? getArticles({ pageSize: 8, agents: agentId }) : null,
  ])

  const agentProperties: SimilarProjectItem[] = (propertyRes?.result?.data ?? []).map((item) => {
    const p = item as Record<string, unknown>
    const pageUrl = (p.pageUrl as { url: string } | null)?.url
    const rawImages = (p.images as Array<{ url?: string; formats?: { xl_webp?: { url: string }; thumbnail?: { url: string } } }>) ?? []
    const firstImg = rawImages[0]
    const imgUrl = firstImg?.formats?.xl_webp?.url ?? firstImg?.formats?.thumbnail?.url ?? firstImg?.url ?? ''
    return {
      id: typeof p.id === 'number' ? p.id : undefined,
      slug: String(p.id ?? ''),
      href: pageUrl ?? undefined,
      title: (p.propertyTitle as string | null) ?? (p.unitType as string | null) ?? '',
      location: (p.community as string | null) ?? undefined,
      priceFrom: typeof p.price === 'number' ? p.price : undefined,
      propertyTypes: p.unitType ? [(p.unitType as string)] : undefined,
      images: imgUrl ? [getStrapiImageUrl(imgUrl)] : [],
    }
  })

  const agentArticles: NewsItem[] = (articlesRes?.data ?? []).map((article) => {
    const imgFile = article.previewImageFile ?? article.previewImage
    const imgSrc = imgFile ? getStrapiImageUrl(imgFile.url) : ''
    const category = typeof article.category === 'object' && article.category !== null
      ? (article.category as { name: string }).name
      : (article.category as string | undefined) ?? ''
    const articleUrl = article.pageUrl?.url ?? `/news/${article.id}`
    const slug = articleUrl.replace(/^\/(blog|articles|news)\//, '').replace(/\/$/, '') || String(article.id)
    return {
      slug,
      href: articleUrl,
      title: article.title,
      excerpt: article.summary ?? '',
      tag: category,
      date: article.date ? new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      readTime: article.timeToRead ?? '',
      image: imgSrc,
    }
  })

  return (
    <main>
      <AgentHero
        name={agentName}
        position={(agent.position as string | undefined) ?? undefined}
        description={(agent.description as string | undefined) ?? undefined}
        imageUrl={imageUrl || undefined}
        phone={(agent.phoneNumber as string | undefined) ?? undefined}
        email={(agent.email as string | undefined) ?? undefined}
        whatsapp={(agent.whatsapp as string | undefined) ?? undefined}
        instagram={(agent.instagram as string | undefined) ?? undefined}
        linkedin={(agent.linkedin as string | undefined) ?? undefined}
        telegram={(agent.telegram as string | undefined) ?? undefined}
        languages={languages}
        content={content}
      />

      <AgentProperties
        items={agentProperties}
        title={`Property listed by ${agentName}`}
      />

      <AgentArticles
        items={agentArticles}
        title={`Articles by ${agentName}`}
      />
    </main>
  )
}
