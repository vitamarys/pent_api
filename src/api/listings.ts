import strapiClient from '@/lib/axios'
import type {
  PenthouseListingsProjectsParams,
  PenthouseListingsProjectsResponse,
  PenthouseListingsPropertyParams,
  PenthouseListingsPropertyResponse,
  PenthouseSearchResponse,
  PenthouseSimilarParams,
  PenthouseSimilarResponse,
  PenthouseProjectFilters,
  PenthousePropertyFilters,
} from '@/types/penthouse-api'

function buildListingsParams(
  params: PenthouseListingsProjectsParams | PenthouseListingsPropertyParams,
): Record<string, string> {
  const result: Record<string, string> = {}
  if (params.locale) result.locale = params.locale
  if (params.currency) result.currency = params.currency
  if (params.page !== undefined) result.page = String(params.page)
  if (params.pageSize !== undefined) result.pageSize = String(params.pageSize)
  if (params.sort) result.sort = params.sort
  if ('search' in params && params.search) result.search = params.search

  // Serialize filters as flat query params (API does not accept JSON)
  const f = params.filters
  if (f) {
    if ('areas' in f && f.areas?.length) result.areas = f.areas.join(',')
    if ('developers' in f && f.developers?.length) result.developers = f.developers.join(',')
    if ('propertyTypes' in f && f.propertyTypes?.length) result.propertyTypes = f.propertyTypes.join(',')
    if ('ids' in f && f.ids?.length) result.ids = f.ids.join(',')
    if ('handover' in f && f.handover?.length) result.handover = f.handover.join(',')
    if ('categories' in f && f.categories?.length) result.categories = f.categories.join(',')
    if ('beds' in f && f.beds?.length) result.beds = f.beds.join(',')
    if ('baths' in f && f.baths?.length) result.baths = f.baths.join(',')
    if ('price' in f && f.price) result.price = `${f.price[0]}-${f.price[1]}`
    if ('completion' in f && f.completion) result.completion = f.completion
    if ('furnished' in f && f.furnished) result.furnished = f.furnished
    if ('search' in f && f.search) result.search = f.search
  }

  return result
}

export async function getProjects(
  params: PenthouseListingsProjectsParams = {},
): Promise<PenthouseListingsProjectsResponse> {
  const { data } = await strapiClient.get<PenthouseListingsProjectsResponse>(
    '/api/catalog/projects',
    { params: buildListingsParams(params) },
  )
  return data
}

export async function searchProjects(
  query: string,
  options: { locale?: string; filters?: PenthouseProjectFilters } = {},
): Promise<PenthouseSearchResponse> {
  const params: Record<string, string> = { query }
  if (options.locale) params.locale = options.locale
  if (options.filters) params.filters = JSON.stringify(options.filters)

  const { data } = await strapiClient.get<PenthouseSearchResponse>(
    '/api/catalog/projects/search',
    { params },
  )
  return data
}

export async function getProperty(
  params: PenthouseListingsPropertyParams = {},
): Promise<PenthouseListingsPropertyResponse> {
  const { data } = await strapiClient.get<PenthouseListingsPropertyResponse>(
    '/api/catalog/property',
    { params: buildListingsParams(params) },
  )
  return data
}

export async function searchProperty(
  query: string,
  options: { locale?: string; filters?: PenthousePropertyFilters } = {},
): Promise<PenthouseSearchResponse> {
  const params: Record<string, string> = { query }
  if (options.locale) params.locale = options.locale
  if (options.filters) params.filters = JSON.stringify(options.filters)

  const { data } = await strapiClient.get<PenthouseSearchResponse>(
    '/api/catalog/property/search',
    { params },
  )
  return data
}

export async function getSimilar(
  params: PenthouseSimilarParams,
): Promise<PenthouseSimilarResponse> {
  const queryParams: Record<string, string> = {
    type: params.type,
    id: String(params.id),
  }
  if (params.locale) queryParams.locale = params.locale
  if (params.currency) queryParams.currency = params.currency

  const { data } = await strapiClient.get<PenthouseSimilarResponse>(
    '/api/catalog/similar',
    { params: queryParams },
  )
  return data
}
