import SimilarProjects, { type SimilarProjectItem } from './SimilarProjects'
import NewsSlider, { type NewsItem } from './NewsSlider'
import DeveloperSlider, { type DeveloperSliderItem } from './DeveloperSlider'
import AgentSlider from './AgentSlider'
import SecondAreas from './SecondAreas'
import { getProjects } from '@/api/listings'
import { getArticles } from '@/api/articles'
import { getDevelopers } from '@/api/developers'
import { searchAgents } from '@/api/agents'
import { getStrapiImageUrl } from '@/lib/utils'
import type { OffPlanProjectCard } from '@/types/penthouse-api'

export interface ProjectSimilarityMeta {
  typeNames: string[]
  areaTitle?: string
  developerName?: string
  minPrice?: number
  currentTitle?: string
}

const SIMILAR_MAX = 16
const SIMILAR_MIN = 4
const POOL_SIZE   = 60

function scoreProject(
  card: OffPlanProjectCard,
  meta: ProjectSimilarityMeta,
  withPrice: boolean,
): number {
  let score = 0

  // Type: match any of current project's types (+4)
  if (
    meta.typeNames.length > 0 &&
    card.projectTypes.some(t => meta.typeNames.includes(t.name))
  ) {
    score += 4
  }

  // Price ±20% (+3)
  if (withPrice && meta.minPrice && card.minPrice) {
    const lo = meta.minPrice * 0.8
    const hi = meta.minPrice * 1.2
    if (card.minPrice >= lo && card.minPrice <= hi) score += 3
  }

  // Area (+2)
  if (meta.areaTitle && card.area?.title === meta.areaTitle) score += 2

  // Developer (+1)
  if (meta.developerName && card.developer?.name === meta.developerName) score += 1

  return score
}

async function fetchSimilarProjects(meta: ProjectSimilarityMeta): Promise<OffPlanProjectCard[]> {
  const priceRange = meta.minPrice
    ? ([Math.floor(meta.minPrice * 0.8), Math.ceil(meta.minPrice * 1.2)] as [number, number])
    : undefined

  // Phase 1: fetch with price filter
  const phase1Res = await getProjects({
    pageSize: POOL_SIZE,
    ...(priceRange ? { filters: { price: priceRange } } : {}),
  }).catch(() => null)

  const pool1 = (phase1Res?.result.data ?? []).filter(
    p => p.title !== meta.currentTitle,
  )

  const scored1 = pool1
    .map(p => ({ p, score: scoreProject(p, meta, true) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.p.minPrice ?? 0) - (b.p.minPrice ?? 0))

  if (scored1.length >= SIMILAR_MIN) {
    return scored1.slice(0, SIMILAR_MAX).map(x => x.p)
  }

  // Phase 2: fetch without price filter (Scenario 5)
  const phase2Res = await getProjects({ pageSize: POOL_SIZE }).catch(() => null)
  const seenTitles = new Set(pool1.map(p => p.title))
  const pool2 = (phase2Res?.result.data ?? []).filter(
    p => p.title !== meta.currentTitle && !seenTitles.has(p.title),
  )

  const allScored = [
    ...scored1,
    ...pool2
      .map(p => ({ p, score: scoreProject(p, meta, false) }))
      .filter(x => x.score > 0),
  ].sort((a, b) => b.score - a.score || (a.p.minPrice ?? 0) - (b.p.minPrice ?? 0))

  return allScored.slice(0, SIMILAR_MAX).map(x => x.p)
}

interface Props {
  contentType: 'projects' | 'articles' | string | null | undefined
  title?: string
  titleHighlight?: string
  seeAllButton?: string
  entityType?: 'area' | 'developer' | 'project'
  entityId?: number
  projectSimilarity?: ProjectSimilarityMeta
}

export default async function AnotherContent({ contentType, title, titleHighlight, seeAllButton, entityType, entityId, projectSimilarity }: Props) {
  if (contentType === 'projects') {
    let projectData: OffPlanProjectCard[] = []

    if (entityType === 'project' && projectSimilarity) {
      projectData = await fetchSimilarProjects(projectSimilarity)
    } else if (entityType === 'project' && entityId != null) {
      const res = await getProjects({ pageSize: 16 }).catch(() => null)
      projectData = res?.result.data ?? []
    } else if (entityType === 'area' && entityId != null) {
      const res = await getProjects({ pageSize: 12, filters: { areas: [entityId] } }).catch(() => null)
      projectData = res?.result.data ?? []
    } else if (entityType === 'developer' && entityId != null) {
      const res = await getProjects({ pageSize: 12, filters: { developers: [entityId] } }).catch(() => null)
      projectData = res?.result.data ?? []
    } else {
      const res = await getProjects({ pageSize: 12 }).catch(() => null)
      projectData = res?.result.data ?? []
    }

    const items: SimilarProjectItem[] = projectData.map((p) => ({
      id: typeof p.id === 'number' ? p.id : undefined,
      slug:
        p.pageUrl?.url
          ?.replace(/^\/(off-plan|projects)\//, '')
          .replace(/\/$/, '') ?? String(p.id),
      title: p.title ?? '',
      location: p.area?.title,
      developer: p.developer?.name,
      handover: p.handover ?? (p.handoverValue ? `Handover ${p.handoverValue}` : undefined),
      priceFrom: p.minPrice ?? undefined,
      propertyTypes: p.projectTypes?.map((t) => t.name),
      images: (
        p.galleryImagesFile?.length ? p.galleryImagesFile :
        p.galleryImages?.length    ? p.galleryImages :
        p.images?.length           ? p.images :
        p.previewImageFile         ? [p.previewImageFile] :
        p.previewImage             ? [p.previewImage] :
        []
      ).slice(0, 4).map(img => getStrapiImageUrl(img.url)),
    }))
    if (!items.length) return null   
    return (
      <SimilarProjects
        projects={items}
        sectionTitle={title}
        titleHighlight={titleHighlight}
        ctaLabel={seeAllButton}
        ctaHref="/projects"
      />
    )
  }

  if (contentType === 'articles') {
    const res = await getArticles({ pageSize: 8 }).catch(() => null)
    const items: NewsItem[] = (res?.data ?? []).map((a) => ({
      slug:
        a.pageUrl?.url
          ?.replace(/^\/(articles|blog)\//, '')
          .replace(/\/$/, '') ?? String(a.id),
      title: a.title,
      excerpt: a.summary ?? '',
      tag: typeof a.category === 'object' && a.category !== null ? (a.category as { name?: string }).name ?? '' : (a.category as string) ?? '',
      date: a.date,
      readTime: a.timeToRead ?? '',
      image: a.previewImageFile?.url ? getStrapiImageUrl(a.previewImageFile.url) : a.previewImage?.url ? getStrapiImageUrl(a.previewImage.url) : '',
      href: a.pageUrl?.url,
    }))
    if (!items.length) return null
    return (
      <NewsSlider
        news={items}
        sectionTitle={title}
        ctaLabel={seeAllButton}
        ctaHref="/articles"
      />
    )
  }

  if (contentType === 'agents') {
    const res = await searchAgents({ page: 1 }).catch(() => null)
    const agents = (res?.data ?? []).slice(0, 6)
    if (!agents.length) return null
    return (
      <AgentSlider
        agents={agents}
        sectionTitle={title}
        ctaLabel={seeAllButton}
        ctaHref="/agents"
      />
    )
  }

  if (contentType === 'developers') {
    const res = await getDevelopers({ pageSize: 8 }).catch(() => null)
    const items: DeveloperSliderItem[] = (res?.data ?? []).map((d) => ({
      id: typeof d.id === 'number' ? d.id : undefined,
      name: d.name,
      slug:
        d.pageUrl?.url
          ?.replace(/^\/developers\//, '')
          .replace(/\/$/, '') ?? String(d.id),
      description: d.description ?? undefined,
      logo: d.logo ?? d.logoFile ?? undefined,
      image: d.image ?? d.imageFile ?? undefined,
    }))
    if (!items.length) return null
    return (
      <DeveloperSlider
        developers={items}
        sectionTitle={title}
        ctaLabel={seeAllButton}
        ctaHref="/developers"
      />
    )
  }

  if (contentType === 'secondary') {
    return (
      <SecondAreas
        sectionTitle={title}
        titleHighlight={titleHighlight}
        ctaLabel={seeAllButton}
        entityId={entityId}
        variant="slider"
      />
    )
  }

  return null
}
