import qs from 'qs'
import strapiClient from '@/lib/axios'

interface RawDeveloper {
  id: number
  attributes: {
    pageUrl?: { data: { attributes: { url: string } } | null }
  }
}

interface RawListResponse {
  data: RawDeveloper[]
}

export async function getDeveloperSlugs(): Promise<{ slug: string }[]> {
  const query = qs.stringify(
    { fields: ['id'], populate: { pageUrl: true }, pagination: { pageSize: 100 } },
    { encodeValuesOnly: true },
  )

  try {
    const { data } = await strapiClient.get<RawListResponse>(`/api/developers?${query}`)
    return data.data
      .map((raw) => {
        const url = raw.attributes.pageUrl?.data?.attributes?.url ?? ''
        return { slug: url.replace(/^\/developers\//, '').replace(/\/$/, '') }
      })
      .filter((s) => s.slug)
  } catch {
    return []
  }
}
