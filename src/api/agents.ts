import strapiClient from '@/lib/axios'
import type {
  PenthouseAgentsResponse,
  PenthouseFavouritesParams,
  PenthouseFavouritesResponse,
} from '@/types/penthouse-api'

export interface SearchAgentsParams {
  page?: number
  search?: string
  sort?: 'asc' | 'desc'
}

export async function searchAgents(
  params: SearchAgentsParams = {},
): Promise<PenthouseAgentsResponse | null> {
  try {
    const queryParams: Record<string, string> = {}
    if (params.page !== undefined) queryParams.page = String(params.page)
    if (params.search) queryParams.search = params.search
    if (params.sort) queryParams.sort = params.sort

    const { data } = await strapiClient.get<PenthouseAgentsResponse>('/api/search-agents', {
      params: queryParams,
    })
    return data
  } catch {
    return null
  }
}

export async function getFavourites(
  params: PenthouseFavouritesParams,
): Promise<PenthouseFavouritesResponse | null> {
  try {
    const queryParams: Record<string, string> = { ids: params.ids }
    if (params.type) queryParams.type = params.type
    if (params.page !== undefined) queryParams.page = String(params.page)
    if (params.pageSize !== undefined) queryParams.pageSize = String(params.pageSize)
    if (params.sort) queryParams.sort = params.sort

    const { data } = await strapiClient.get<PenthouseFavouritesResponse>('/api/favourites', {
      params: queryParams,
    })
    return data
  } catch {
    return null
  }
}
