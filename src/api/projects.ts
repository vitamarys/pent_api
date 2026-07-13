import qs from 'qs'
import strapiClient from '@/lib/axios'
import type { StrapiProject, StrapiListResponse, StrapiGlobalBlockSlot } from '@/types/strapi'
import { MOCK_PROJECTS } from '@/data/mock'

const SECTIONS_POPULATE = {
  sections: {
    on: {
      'sections.hero-project': { populate: { image: true } },
      'sections.project-promo': { populate: { decorativeImage: true } },
      'sections.project-info': { populate: { mainImage: true, images: true, details: true } },
      'sections.project-keys': { populate: { points: true } },
      'sections.project-floor-plan': {
        populate: { cards: { populate: { image: true } } },
      },
      'sections.project-payment-plan': {
        populate: { versions: { populate: { stages: true } } },
      },
      'sections.project-brand': { populate: { logo: true, image: true } },
      'sections.project-amenities': {
        populate: { items: { populate: { image: true } } },
      },
      'sections.project-guide': { populate: { image: true } },
      'sections.project-form': {
        populate: { agent: { populate: { image: true } } },
      },
      'sections.project-dev': true,
      'sections.project-team': { populate: { image: true, stats: true } },
      'sections.project-awards': {
        populate: { awards: { populate: { image: true, bgImage: true } } },
      },
      'sections.project-services': {
        populate: { services: { populate: { image: true } } },
      },
      'sections.project-accordion': { populate: { items: true } },
      'sections.project-location': { populate: { proximity: true } },
      'sections.project-banner': { populate: { image: true } },
      'sections.project-map': { populate: { proximity: true } },
    },
  },
}

const PROJECT_POPULATE = {
  ...SECTIONS_POPULATE,
  developer: { populate: { logo: true, imageBg: true, stats: true } },
  district: true,
  propertyTypes: true,
  images: true,
}

export async function getProjectBySlug(slug: string): Promise<StrapiProject | null> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: PROJECT_POPULATE,
    },
    { encodeValuesOnly: true },
  )

  try {
    const { data } = await strapiClient.get<StrapiListResponse<StrapiProject>>(
      `/api/projects?${query}`,
    )
    if (data.data[0]) return data.data[0]
  } catch {
    // fall through to mock data
  }

  return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null
}

export async function getProjectsByDistrictSlug(districtSlug: string): Promise<StrapiProject[]> {
  const query = qs.stringify(
    {
      filters: { district: { slug: { $eq: districtSlug } } },
      populate: {
        developer: true,
        district: true,
        images: true,
      },
    },
    { encodeValuesOnly: true },
  )

  try {
    const { data } = await strapiClient.get<StrapiListResponse<StrapiProject>>(
      `/api/projects?${query}`,
    )
    if (data.data.length > 0) return data.data
  } catch {
    // fall through to mock data
  }

  return MOCK_PROJECTS.filter((p) => p.district?.slug === districtSlug)
}

export async function getProjectsByDeveloperSlug(developerSlug: string): Promise<StrapiProject[]> {
  const query = qs.stringify(
    {
      filters: { developer: { slug: { $eq: developerSlug } } },
      populate: {
        developer: true,
        district: true,
        images: true,
      },
    },
    { encodeValuesOnly: true },
  )

  try {
    const { data } = await strapiClient.get<StrapiListResponse<StrapiProject>>(
      `/api/projects?${query}`,
    )
    if (data.data.length > 0) return data.data
  } catch {
    // fall through to mock data
  }

  return MOCK_PROJECTS.filter((p) => p.developer?.slug === developerSlug)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getTemplateGlobalBlockSlots(_templateDocumentId: string): Promise<StrapiGlobalBlockSlot[]> {
  return []
}

export async function getProjectSlugs(): Promise<{ slug: string }[]> {
  const query = qs.stringify(
    { fields: ['slug'] },
    { encodeValuesOnly: true },
  )

  try {
    const { data } = await strapiClient.get<StrapiListResponse<StrapiProject>>(
      `/api/projects?${query}`,
    )
    if (data.data.length > 0) return data.data.map((p) => ({ slug: p.slug }))
  } catch {
    // fall through to mock data
  }

  return MOCK_PROJECTS.map((p) => ({ slug: p.slug }))
}
