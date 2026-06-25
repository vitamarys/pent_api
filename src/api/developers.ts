import { MOCK_DEVELOPERS } from '@/data/mock'
import type { StrapiDeveloper } from '@/types/strapi'

export async function getDeveloperBySlug(slug: string): Promise<StrapiDeveloper | null> {
  return MOCK_DEVELOPERS.find((d) => d.slug === slug) ?? null
}

export async function getOtherDevelopers(excludeSlug: string): Promise<StrapiDeveloper[]> {
  return MOCK_DEVELOPERS.filter((d) => d.slug !== excludeSlug)
}

export async function getDeveloperSlugs(): Promise<{ slug: string }[]> {
  return MOCK_DEVELOPERS.map((d) => ({ slug: d.slug }))
}
