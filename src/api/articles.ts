import strapiClient from '@/lib/axios'
import type { PenthouseArticlesResponse } from '@/types/penthouse-api'

export interface GetArticlesParams {
  page?: number
  pageSize?: number
  category?: string
}

export async function getArticles(
  params: GetArticlesParams = {},
): Promise<PenthouseArticlesResponse | null> {
  try {
    const queryParams: Record<string, string> = {}
    if (params.page !== undefined) queryParams.page = String(params.page)
    if (params.pageSize !== undefined) queryParams.pageSize = String(params.pageSize)
    if (params.category) queryParams.category = params.category

    const { data } = await strapiClient.get<PenthouseArticlesResponse>('/api/get-articles', {
      params: queryParams,
    })
    return data
  } catch {
    return null
  }
}
