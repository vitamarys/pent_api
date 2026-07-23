import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug } from '@/api/pages'
import { getArticles } from '@/api/articles'
import type {
  PenthousePage,
  PenthouseBlock,
  PenthouseArticleDetail,
} from '@/types/penthouse-api'

import ArticleHero from '@/components/sections/ArticleHero'
import ArticleBody from '@/components/sections/ArticleBody'
import ArticlesSlider, { type ArticleCardItem } from '@/components/sections/ArticlesSlider'
import ProjectBanner from '@/components/sections/ProjectBanner'

export const revalidate = 3600
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const data = await getArticles({ pageSize: 100 })
  if (!data) return []
  return data.data
    .filter((a) => a.pageUrl?.url)
    .map((a) => {
      const url = a.pageUrl!.url
      const slug = url.replace(/^\/articles\//, '').replace(/\/$/, '')
      return { slug }
    })
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(`/articles/${slug}/`)
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.metaDescription,
    openGraph: page.seo?.previewImage
      ? { images: [page.seo.previewImage.url] }
      : undefined,
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

function getArticleEntity(page: PenthousePage): PenthouseArticleDetail | null {
  const ae = page.associatedEntity?.[0] as
    | { __component: string; article?: PenthouseArticleDetail }
    | undefined
  if (ae?.__component === 'associated-entity.article') return ae.article ?? null
  return null
}

function findHeroImage(article: PenthouseArticleDetail): string | undefined {
  for (const block of article.content ?? []) {
    if (block.type === 'image') {
      const url = (block.props as { url?: string })?.url
      if (url) return url
    }
  }
  const a = article as typeof article & { previewImageFile?: { url?: string } }
  return a.previewImageFile?.url ?? article.previewImage?.url
}

// Map a raw article object from block.another-content.articles[] to ArticleCardItem
function mapInlineArticle(raw: Record<string, unknown>): ArticleCardItem {
  const pageUrl = (raw.pageUrl as { url?: string } | null)?.url ?? ''
  const category = raw.category as { name?: string } | null
  const previewFile = (raw.previewImageFile as { url?: string } | null)
    ?? (raw.previewImage as { url?: string } | null)

  return {
    id: raw.id as number,
    title: (raw.title as string) ?? '',
    summary: (raw.summary as string | undefined) ?? undefined,
    category: category?.name,
    date: (raw.date as string | undefined) ?? undefined,
    timeToRead: (raw.timeToRead as string | undefined) ?? undefined,
    image: previewFile?.url,
    href: pageUrl || undefined,
  }
}

// ── Block renderer ────────────────────────────────────────────────────────────

async function renderBlock(block: PenthouseBlock, index: number) {
  if (block.visible === false) return null

  switch (block.__component) {
    case 'block.another-content': {
      const b = block as {
        title?: string
        contentType?: string
        seeAllButton?: string | null
        articles?: Record<string, unknown>[]
      }
      if (b.contentType !== 'articles') return null

      // Prefer inline articles from the block; fallback to API fetch
      let articles: ArticleCardItem[] = (b.articles ?? []).map(mapInlineArticle)

      if (!articles.length) {
        const data = await getArticles({ pageSize: 4 })
        if (data?.data) {
          articles = data.data.map((a) => ({
            id: a.id,
            title: a.title,
            summary: a.summary,
            category: typeof a.category === 'object' && a.category !== null ? (a.category as { name?: string }).name : a.category as string | undefined,
            date: a.date,
            timeToRead: a.timeToRead,
            image: a.previewImage?.url,
            href: a.pageUrl?.url,
          }))
        }
      }

      if (!articles.length) return null

      return (
        <ArticlesSlider
          key={index}
          articles={articles}
          sectionTitle={b.title ?? 'Latest news'}
          ctaLabel={b.seeAllButton ?? 'See all news'}
          ctaHref="/articles"
        />
      )
    }

    case 'block.banner': {
      const b = block as {
        title?: string
        description?: string
        buttonText?: string
        image?: { url?: string } | null
      }
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

    default:
      return null
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(`/articles/${slug}/`)

  if (!page || page.pageStatus !== 'PUBLISH' || page.deleted) notFound()

  const article = getArticleEntity(page)
  if (!article) notFound()

  const heroImage = findHeroImage(article)

  const visibleBlocks = page.blocks.filter(
    (b) => !['block.header', 'block.footer'].includes(b.__component),
  )

  const renderedBlocks = await Promise.all(
    visibleBlocks.map((block, i) =>
      renderBlock(block, i).catch((err) => {
        console.error(`Failed to render ${block.__component}`, err)
        return null
      }),
    ),
  )

  return (
    <main>
      <ArticleHero
        title={article.title}
        summary={article.summary}
        category={article.category?.name}
        date={article.date}
        timeToRead={article.timeToRead}
        heroImage={heroImage}
        breadcrumb={[
          { label: 'Articles', href: '/articles' },
          { label: article.title },
        ]}
      />

      <ArticleBody
        content={article.content ?? []}
        author={article.author}
        editor={article.editor}
      />

      {renderedBlocks}
    </main>
  )
}
