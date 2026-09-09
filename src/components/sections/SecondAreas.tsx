import Link from 'next/link'
import { getProperty } from '@/api/listings'
import ResaleCard from '@/app/resale/ResaleCard'
import Container from '@/components/ui/Container'
import SecondAreasSlider from './SecondAreasSlider'
import s from './SecondAreas.module.scss'

interface Props {
  sectionTitle?: string
  titleHighlight?: string
  ctaLabel?: string
  entityId?: number
  pageSize?: number
  variant?: 'grid' | 'slider'
}

export default async function SecondAreas({
  sectionTitle,
  titleHighlight,
  ctaLabel = 'See more',
  entityId,
  pageSize = 9,
  variant = 'grid',
}: Props) {
  const res = await getProperty({
    pageSize: variant === 'slider' ? 12 : pageSize,
    filters: entityId != null ? { areas: [entityId] } : undefined,
  }).catch(() => null)

  const rawItems = res?.result.data ?? []
  if (!rawItems.length) return null

  const items = rawItems.map((item) => {
    const raw = item as Record<string, unknown>
    const rawUrl = (raw.pageUrl as { url?: string } | null)?.url ?? ''
    const slug = rawUrl.replace(/^\/resale\//, '').replace(/\/$/, '') || String(raw.id)
    const imgList = (raw.images as Array<{ url?: string }> | null) ?? []
    return {
      id: typeof raw.id === 'number' ? raw.id : undefined,
      slug,
      title: (raw.propertyTitle as string) ?? '',
      price: raw.price as number | undefined,
      area: raw.unitBuiltupArea as number | undefined,
      bedrooms: raw.bedrooms as string | undefined,
      bathrooms: raw.noOfBathroom as number | undefined,
      unitType: (raw.propertyType as { name?: string } | null)?.name,
      location: [raw.community, raw.emirate].filter(Boolean).join(', ') || undefined,
      images: imgList.map((img) => img.url ?? '').filter(Boolean).slice(0, 4),
    }
  })

  if (variant === 'slider') {
    return (
      <SecondAreasSlider
        items={items}
        sectionTitle={sectionTitle}
        titleHighlight={titleHighlight}
        ctaLabel={ctaLabel}
      />
    )
  }

  return (
    <section className={s.section}>
      <Container>
        {sectionTitle && (
          <h2 className={s.title}>
            {titleHighlight && sectionTitle.includes(titleHighlight)
              ? <>
                  {sectionTitle.slice(0, sectionTitle.indexOf(titleHighlight))}
                  <span className={s.highlight}>{titleHighlight}</span>
                  {sectionTitle.slice(sectionTitle.indexOf(titleHighlight) + titleHighlight.length)}
                </>
              : sectionTitle}
          </h2>
        )}

        <div className={s.grid}>
          {items.map((item) => (
            <ResaleCard key={item.slug} {...item} />
          ))}
        </div>

        <Link href="/resale" className={s.cta}>
          {ctaLabel}
        </Link>
      </Container>
    </section>
  )
}
