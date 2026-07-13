import strapiClient from '@/lib/axios'
import type { PenthouseArticlesResponse } from '@/types/penthouse-api'

export interface GetArticlesParams {
  page?: number
  pageSize?: number
  categorySlug?: string
  pinned?: boolean
}

export async function getArticles(
  params: GetArticlesParams = {},
): Promise<PenthouseArticlesResponse | null> {
  try {
    const queryParams: Record<string, string> = {}
    if (params.page !== undefined) queryParams.page = String(params.page)
    if (params.pageSize !== undefined) queryParams.pageSize = String(params.pageSize)
    if (params.categorySlug) queryParams.categorySlug = params.categorySlug
    if (params.pinned !== undefined) queryParams.pinned = String(params.pinned)

    const { data } = await strapiClient.get<PenthouseArticlesResponse>('/api/catalog/articles', {
      params: queryParams,
    })
    return data
  } catch {
    return null
  }
}
