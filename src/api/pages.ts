import { unstable_cache } from 'next/cache'
import strapiClient from '@/lib/axios'
import type { PenthouseGetPagesResponse, PenthouseGetPageResponse, PenthousePage } from '@/types/penthouse-api'

export const getPages = unstable_cache(
  async (): Promise<PenthouseGetPagesResponse | null> => {
    try {
      const { data } = await strapiClient.get<PenthouseGetPagesResponse>('/api/get-pages')
      return data
    } catch {
      return null
    }
  },
  ['pages'],
  { revalidate: 300, tags: ['pages'] },
)

export const getPageBySlug = unstable_cache(
  async (slug: string): Promise<PenthousePage | null> => {
    try {
      const { data } = await strapiClient.get<PenthouseGetPageResponse>('/api/get-page', {
        params: { slug },
      })
      return data.page ?? null
    } catch {
      return null
    }
  },
  ['page-by-slug'],
  { revalidate: 300, tags: ['pages'] },
)

export async function getPageSlugs(): Promise<string[]> {
  const data = await getPages()
  if (!data) return []
  return data.pages
    .filter((p) => p.pageStatus === 'PUBLISH' && !p.deleted)
    .map((p) => p.url.url)
}
