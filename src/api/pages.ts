import strapiClient from '@/lib/axios'
import type { PenthouseGetPagesResponse, PenthouseGetPageResponse, PenthousePage } from '@/types/penthouse-api'

export async function getPages(): Promise<PenthouseGetPagesResponse | null> {
  try {
    const { data } = await strapiClient.get<PenthouseGetPagesResponse>('/api/get-pages')
    return data
  } catch {
    return null
  }
}

export async function getPageBySlug(slug: string): Promise<PenthousePage | null> {
  try {
    const { data } = await strapiClient.get<PenthouseGetPageResponse>('/api/get-page', {
      params: { slug },
    })
    return data.page ?? null
  } catch {
    return null
  }
}

export async function getPageSlugs(): Promise<string[]> {
  const data = await getPages()
  if (!data) return []
  return data.pages
    .filter((p) => p.pageStatus === 'PUBLISH' && !p.deleted)
    .map((p) => p.url.url)
}
