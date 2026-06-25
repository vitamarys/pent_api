// ── Strapi media ──────────────────────────────────────────────────────────────

export interface StrapiMedia {
  id: number
  url: string
  alternativeText?: string
  width?: number
  height?: number
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }
}

// ── Shared sub-components ─────────────────────────────────────────────────────

export interface StrapiDetailItem {
  id: number
  label: string
  value?: string
  type?: 'text' | 'link' | 'info'
  href?: string
}

export interface StrapiKeyPoint {
  id: number
  title: string
  description: string
}

export interface StrapiFloorPlanCard {
  id: number
  title: string
  type: 'apartment' | 'duplex' | 'penthouse'
  optionsLabel?: string
  image?: StrapiMedia
  startingPrice: string
  livingArea: string
  costPerSqm?: string
}

export interface StrapiPaymentStage {
  id: number
  title: string
  subtitle?: string
  percentage: string
  paymentsLabel?: string
}

export interface StrapiPaymentVersion {
  id: number
  label: string
  stages: StrapiPaymentStage[]
}

export interface StrapiAmenityItem {
  id: number
  label: string
  image?: StrapiMedia
}

export interface StrapiAwardItem {
  id: number
  image?: StrapiMedia
  bgImage?: StrapiMedia
  value: string
  label: string
}

export interface StrapiServiceItem {
  id: number
  title: string
  description: string
  image?: StrapiMedia
}

export interface StrapiAccordionItem {
  id: number
  question: string
  answer: string
}

export interface StrapiStatItem {
  id: number
  label: string
  value: string
}

export interface StrapiAgentInfo {
  id: number
  name: string
  role?: string
  image?: StrapiMedia
}

// ── Section base ──────────────────────────────────────────────────────────────

interface StrapiSectionBase {
  id: number
  visible?: boolean
}

// ── Section components ────────────────────────────────────────────────────────

export interface StrapiHeroProject extends StrapiSectionBase {
  __component: 'sections.hero-project'
  id: number
  title: string
  location: string
  description?: string
  image?: StrapiMedia
  startingPrice?: string
  handover?: string
  numberOfUnits?: string
}

export interface StrapiProjectPromo extends StrapiSectionBase {
  __component: 'sections.project-promo'
  id: number
  titleHighlight: string
  titleRest: string
  description?: string
  decorativeImage?: StrapiMedia
}

export interface StrapiProjectInfo extends StrapiSectionBase {
  __component: 'sections.project-info'
  id: number
  title: string
  description?: string
  mainImage?: StrapiMedia
  images?: StrapiMedia[]
  videoUrl?: string
  photosCount?: number
  details?: StrapiDetailItem[]
}

export interface StrapiProjectKeys extends StrapiSectionBase {
  __component: 'sections.project-keys'
  id: number
  sectionTitle?: string
  points?: StrapiKeyPoint[]
}

export interface StrapiProjectFloorPlan extends StrapiSectionBase {
  __component: 'sections.project-floor-plan'
  id: number
  sectionTitle?: string
  cards?: StrapiFloorPlanCard[]
}

export interface StrapiProjectPaymentPlan extends StrapiSectionBase {
  __component: 'sections.project-payment-plan'
  id: number
  sectionTitle?: string
  description?: string
  versions?: StrapiPaymentVersion[]
  ctaLabel?: string
}

export interface StrapiProjectBrand extends StrapiSectionBase {
  __component: 'sections.project-brand'
  id: number
  devName: string
  description: string
  logo?: StrapiMedia
  logoText?: string
  image?: StrapiMedia
}

export interface StrapiProjectAmenities extends StrapiSectionBase {
  __component: 'sections.project-amenities'
  id: number
  sectionTitle?: string
  items?: StrapiAmenityItem[]
  totalCount?: number
  showAllLabel?: string
}

export interface StrapiProjectGuide extends StrapiSectionBase {
  __component: 'sections.project-guide'
  id: number
  title?: string
  description?: string
  buttonLabel?: string
  image?: StrapiMedia
}

export interface StrapiProjectForm extends StrapiSectionBase {
  __component: 'sections.project-form'
  id: number
  sectionTitle?: string
  description?: string
  submitLabel?: string
  privacyNote?: string
  consentLabel?: string
  agent?: StrapiAgentInfo
}

export interface StrapiProjectDev extends StrapiSectionBase {
  __component: 'sections.project-dev'
  id: number
}

export interface StrapiProjectTeam extends StrapiSectionBase {
  __component: 'sections.project-team'
  id: number
  title?: string
  description?: string
  image?: StrapiMedia
  stats?: StrapiStatItem[]
  ctaLabel?: string
  ctaHref?: string
}

export interface StrapiProjectAwards extends StrapiSectionBase {
  __component: 'sections.project-awards'
  id: number
  sectionLabel?: string
  awards?: StrapiAwardItem[]
}

export interface StrapiProjectServices extends StrapiSectionBase {
  __component: 'sections.project-services'
  id: number
  sectionTitle?: string
  services?: StrapiServiceItem[]
}

export interface StrapiProjectAccordion extends StrapiSectionBase {
  __component: 'sections.project-accordion'
  id: number
  sectionTitle?: string
  items?: StrapiAccordionItem[]
}

export interface StrapiProjectLocation extends StrapiSectionBase {
  __component: 'sections.project-location'
  id: number
  sectionTitle?: string
  description?: string
  mapUrl?: string
  address?: string
  proximity?: { id: number; label: string; value: string }[]
  ctaLabel?: string
  ctaHref?: string
}

export interface StrapiProjectBanner extends StrapiSectionBase {
  __component: 'sections.project-banner'
  id: number
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  image?: StrapiMedia
}

export interface StrapiProjectMap extends StrapiSectionBase {
  __component: 'sections.project-map'
  id: number
  sectionTitle?: string
  body?: string
  latitude?: number
  longitude?: number
  zoom?: number
  proximity?: { id: number; label: string; value: string }[]
  ctaLabel?: string
  ctaHref?: string
}

export type StrapiSection =
  | StrapiHeroProject
  | StrapiProjectPromo
  | StrapiProjectInfo
  | StrapiProjectKeys
  | StrapiProjectFloorPlan
  | StrapiProjectPaymentPlan
  | StrapiProjectBrand
  | StrapiProjectAmenities
  | StrapiProjectGuide
  | StrapiProjectForm
  | StrapiProjectDev
  | StrapiProjectTeam
  | StrapiProjectAwards
  | StrapiProjectServices
  | StrapiProjectAccordion
  | StrapiProjectLocation
  | StrapiProjectBanner
  | StrapiProjectMap

// ── Shared sub-components (continued) ────────────────────────────────────────

export interface StrapiFeatureItem {
  id: number
  title: string
  description: string
}

// ── Developer sections ────────────────────────────────────────────────────────

export interface StrapiHeroDeveloperSection extends StrapiSectionBase {
  __component: 'sections.hero-developer'
  ctaLabel?: string
  ctaHref?: string
}

export interface StrapiDeveloperAboutSection extends StrapiSectionBase {
  __component: 'sections.developer-about'
  sectionTitle?: string
  body?: string
  image?: StrapiMedia
  features?: StrapiFeatureItem[]
}

export interface StrapiDeveloperProjectsSection extends StrapiSectionBase {
  __component: 'sections.developer-projects'
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
}

export interface StrapiDeveloperSliderSection extends StrapiSectionBase {
  __component: 'sections.developer-slider'
  sectionTitle?: string
  ctaLabel?: string
  ctaHref?: string
}

export type StrapiDeveloperSection =
  | StrapiHeroDeveloperSection
  | StrapiDeveloperAboutSection
  | StrapiDeveloperProjectsSection
  | StrapiDeveloperSliderSection
  | StrapiProjectForm
  | StrapiProjectAccordion

// ── Developer ────────────────────────────────────────────────────────────────

export interface StrapiDeveloper {
  id: number
  documentId: string
  name: string
  slug: string
  logo?: StrapiMedia
  imageBg?: StrapiMedia
  description?: string
  stats?: StrapiStatItem[]
  sections?: StrapiDeveloperSection[]
}

export interface StrapiOverviewTab {
  id: number
  label: string
  content: string
}

export interface StrapiDistrict {
  id: number
  documentId: string
  name: string
  slug: string
  city: string
  aboutDescription?: string
}

export interface StrapiArea extends StrapiDistrict {
  heroImage?: StrapiMedia
  description?: string
  aboutTitle?: string
  aboutDescription?: string
  features?: StrapiFeatureItem[]
  overviewImage?: StrapiMedia
  overviewTabs?: StrapiOverviewTab[]
  latitude?: number
  longitude?: number
  mapZoom?: number
  mapBody?: string
  mapProximity?: StrapiDetailItem[]
  faqItems?: StrapiAccordionItem[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    ogImage?: StrapiMedia
  }
}

export interface StrapiPropertyType {
  id: number
  documentId: string
  name: string
  slug: string
}


// ── Global Blocks ─────────────────────────────────────────────────────────────

export interface StrapiGlobalBlock {
  id: number
  documentId: string
  name: string
  isDeleted: boolean
  section: StrapiSection[]
}

export interface StrapiGlobalBlockSlot {
  id: number
  globalBlock: StrapiGlobalBlock
  order: number
  defaultVisible: boolean
}

export interface StrapiGlobalBlockOverride {
  id: number
  globalBlock: Pick<StrapiGlobalBlock, 'id' | 'documentId'>
  visible: boolean
  order?: number
}

export interface StrapiTemplate {
  id: number
  documentId: string
  name: string
  slug: string
  description?: string
  globalBlockSlots?: StrapiGlobalBlockSlot[]
}

export interface StrapiProject {
  id: number
  documentId: string
  title: string
  slug: string
  templateConfig?: StrapiTemplate
  globalBlockSlots?: StrapiGlobalBlockSlot[]
  priceFrom?: number
  priceTo?: number
  handover?: string
  developer?: StrapiDeveloper
  district?: StrapiDistrict
  propertyTypes?: string[]
  bedroomTypes?: string[]
  sections: StrapiSection[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  images?: StrapiMedia[]
}

export interface StrapiListResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
