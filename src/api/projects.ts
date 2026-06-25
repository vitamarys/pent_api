import type { StrapiProject, StrapiGlobalBlockSlot } from '@/types/strapi'
import { MOCK_PROJECTS } from '@/data/mock'

export async function getProjectBySlug(slug: string): Promise<StrapiProject | null> {
  return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null
}

export async function getProjectsByDistrictSlug(districtSlug: string): Promise<StrapiProject[]> {
  return MOCK_PROJECTS.filter((p) => p.district?.slug === districtSlug)
}

export async function getProjectsByDeveloperSlug(developerSlug: string): Promise<StrapiProject[]> {
  return MOCK_PROJECTS.filter((p) => p.developer?.slug === developerSlug)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getTemplateGlobalBlockSlots(_templateDocumentId: string): Promise<StrapiGlobalBlockSlot[]> {
  return []
}

export async function getProjectSlugs(): Promise<{ slug: string }[]> {
  return MOCK_PROJECTS.map((p) => ({ slug: p.slug }))
}
