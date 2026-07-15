import { getSimilar } from '@/api/listings'
import SimilarProjects, { type SimilarProjectItem } from './SimilarProjects'

interface Props {
  title?: string
  ctaLabel?: string
  propertyId: number
}

export default async function SecondarySimilar({ title, ctaLabel, propertyId }: Props) {
  let items: SimilarProjectItem[] = []

  try {
    const res = await getSimilar({ type: 'property', id: propertyId })
    items = (res.data ?? []).map((p) => {
      const item = p as any
      const rawUrl: string = item.pageUrl?.url ?? ''
      const slug = rawUrl.replace(/^\/resale\//, '').replace(/\/$/, '') || String(item.id)
      return {
        slug,
        title: item.propertyTitle ?? item.title ?? '',
        location: [item.subCommunity, item.community].filter(Boolean).join(', ') || undefined,
        priceFrom: item.price ?? undefined,
        images: (item.images ?? []).map((img: any) => img.url as string),
      } satisfies SimilarProjectItem
    })
  } catch {
    // silently return null on error
  }

  if (!items.length) return null

  return (
    <SimilarProjects
      projects={items}
      sectionTitle={title ?? 'Similar Properties'}
      ctaLabel={ctaLabel ?? 'See all properties'}
      ctaHref="/resale"
    />
  )
}
