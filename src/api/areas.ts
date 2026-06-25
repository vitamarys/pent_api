import qs from 'qs'
import strapiClient from '@/lib/axios'
import type { StrapiArea, StrapiListResponse } from '@/types/strapi'
import { MOCK_AREAS_FULL } from '@/data/mock'

export async function getAreaBySlug(slug: string): Promise<StrapiArea | null> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        heroImage: true,
        features: true,
        overviewImage: true,
        overviewTabs: true,
        mapProximity: true,
        faqItems: true,
        seo: { populate: { ogImage: true } },
      },
    },
    { encodeValuesOnly: true },
  )

  try {
    const { data } = await strapiClient.get<StrapiListResponse<StrapiArea>>(
      `/api/districts?${query}`,
    )
    if (data.data[0]) return data.data[0]
  } catch {
    // fall through to mock data
  }

  return MOCK_AREAS_FULL.find((a) => a.slug === slug) ?? null
}

export async function getAreaSlugs(): Promise<{ slug: string }[]> {
  const query = qs.stringify(
    { fields: ['slug'] },
    { encodeValuesOnly: true },
  )

  try {
    const { data } = await strapiClient.get<StrapiListResponse<StrapiArea>>(
      `/api/districts?${query}`,
    )
    if (data.data.length > 0) return data.data.map((d) => ({ slug: d.slug }))
  } catch {
    // fall through to mock data
  }

  return MOCK_AREAS_FULL.map((a) => ({ slug: a.slug }))
}
