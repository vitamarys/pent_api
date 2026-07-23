import SimilarProjects, { type SimilarProjectItem } from './SimilarProjects'
import NewsSlider, { type NewsItem } from './NewsSlider'
import DeveloperSlider, { type DeveloperSliderItem } from './DeveloperSlider'
import AgentSlider from './AgentSlider'
import { getProjects, getSimilar } from '@/api/listings'
import { getArticles } from '@/api/articles'
import { getDevelopers } from '@/api/developers'
import { searchAgents } from '@/api/agents'
import { getStrapiImageUrl } from '@/lib/utils'
import type { OffPlanProjectCard } from '@/types/penthouse-api'

interface Props {
  contentType: 'projects' | 'articles' | string | null | undefined
  title?: string
  seeAllButton?: string
  entityType?: 'area' | 'developer' | 'project'
  entityId?: number
}

export default async function AnotherContent({ contentType, title, seeAllButton, entityType, entityId }: Props) {
  if (contentType === 'projects') {
    let projectData: OffPlanProjectCard[] = []
      
    if (entityType === 'project' && entityId != null) {
      const res = await getSimilar({ type: 'projects', id: entityId }).catch(() => null)
      projectData = (res?.data ?? []) as OffPlanProjectCard[]
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
      slug:
        p.pageUrl?.url
          ?.replace(/^\/(off-plan|projects)\//, '')
          .replace(/\/$/, '') ?? String(p.id),
      title: p.title ?? '',
      location: p.area?.title,
      developer: p.developer?.name,
      handover: p.handover ?? undefined,
      priceFrom: p.minPrice ?? undefined,
      propertyTypes: p.projectTypes?.map((t) => t.name),
      images: p.previewImage ? [getStrapiImageUrl(p.previewImage.url)] : [],
    }))
    if (!items.length) return null   
    return (
      <SimilarProjects
        projects={items}
        sectionTitle={title}
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
      name: d.name,
      slug:
        d.pageUrl?.url
          ?.replace(/^\/developers\//, '')
          .replace(/\/$/, '') ?? String(d.id),
      logo: d.imageFile ?? undefined,
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

  return null
}
