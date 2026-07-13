import strapiClient from '@/lib/axios'

export interface CatalogAreaItem {
  id: number
  title: string
  subtitle?: string
  pageUrl?: { url: string; isExternal?: boolean } | null
  previewImageFile?: { url: string } | null
}

export interface CatalogAreasResponse {
  data: CatalogAreaItem[]
  meta: { page: number; pageSize: number; total: number; pageCount: number }
}

const EMPTY_AREAS: CatalogAreasResponse = { data: [], meta: { page: 1, pageSize: 0, total: 0, pageCount: 0 } }

export async function getAreas(
  params: { locale?: string; page?: number; pageSize?: number; search?: string } = {},
): Promise<CatalogAreasResponse> {
  try {
    const { data } = await strapiClient.get<CatalogAreasResponse>('/api/catalog/areas', {
      params,
    })
    return data
  } catch {
    return EMPTY_AREAS
  }
}

export async function getAreaSlugs(): Promise<{ slug: string }[]> {
  const result = await getAreas({ pageSize: 100 })
  return result.data
    .map((area) => ({ slug: area.pageUrl?.url?.replace(/^\/areas\//, '').replace(/\/$/, '') ?? '' }))
    .filter((s) => s.slug)
}
