import { unstable_cache } from 'next/cache'
import strapiClient from '@/lib/axios'
import type { PenthouseArticlesResponse } from '@/types/penthouse-api'

export interface GetArticlesParams {
  page?: number
  pageSize?: number
  categorySlug?: string
  pinned?: boolean
  agents?: number
}

export async function getArticles(
  params: GetArticlesParams = {},
): Promise<PenthouseArticlesResponse | null> {
  const cacheKey = JSON.stringify(params)
  return unstable_cache(
    async () => {
      try {
        const queryParams: Record<string, string> = {}
        if (params.page !== undefined) queryParams.page = String(params.page)
        if (params.pageSize !== undefined) queryParams.pageSize = String(params.pageSize)
        if (params.categorySlug) queryParams.categorySlug = params.categorySlug
        if (params.pinned !== undefined) queryParams.pinned = String(params.pinned)
        if (params.agents !== undefined) queryParams.agents = String(params.agents)

        const { data } = await strapiClient.get<PenthouseArticlesResponse>('/api/catalog/articles', {
          params: queryParams,
        })
        return data
      } catch {
        return null
      }
    },
    ['articles', cacheKey],
    { revalidate: 300, tags: ['articles'] },
  )()
}
