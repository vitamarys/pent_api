import strapiClient from '@/lib/axios'

export interface CatalogDeveloperItem {
  id: number
  name: string
  pageUrl?: { url: string; isExternal?: boolean } | null
  imageFile?: { url: string } | null
}

export interface CatalogDevelopersResponse {
  data: CatalogDeveloperItem[]
  meta: { page: number; pageSize: number; total: number; pageCount: number }
}

const EMPTY_DEVELOPERS: CatalogDevelopersResponse = { data: [], meta: { page: 1, pageSize: 0, total: 0, pageCount: 0 } }

export async function getDevelopers(
  params: { locale?: string; page?: number; pageSize?: number; search?: string } = {},
): Promise<CatalogDevelopersResponse> {
  try {
    const { data } = await strapiClient.get<CatalogDevelopersResponse>('/api/catalog/developers', {
      params,
    })
    return data
  } catch {
    return EMPTY_DEVELOPERS
  }
}

export async function getDeveloperSlugs(): Promise<{ slug: string }[]> {
  const result = await getDevelopers({ pageSize: 100 })
  return result.data
    .map((dev) => ({ slug: dev.pageUrl?.url?.replace(/^\/developers\//, '').replace(/\/$/, '') ?? '' }))
    .filter((s) => s.slug)
}
