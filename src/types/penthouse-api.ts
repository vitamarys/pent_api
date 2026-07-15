// ── Shared ────────────────────────────────────────────────────────────────────

export interface PenthouseMeta {
  page: number
  pageSize: number
  total: number
  pageCount: number
}

export interface PenthouseImage {
  url: string
  alternativeText?: string
  width?: number
  height?: number
}

// ── GET /get-pages ────────────────────────────────────────────────────────────

export type PenthousePageType =
  | 'MAIN'
  | 'SECONDARY'
  | 'OFF_PLAN'
  | 'AREA'
  | 'AGENT'
  | 'ARTICLE'
  | 'DEVELOPER'
  | 'STATIC'

export interface PenthouseBlock {
  __component: string
  id?: number
  [key: string]: unknown
}

export interface PenthousePage {
  id: number
  title: string
  type: PenthousePageType
  pageStatus: 'PUBLISH' | string
  locale?: string
  deleted?: boolean
  indexing?: boolean
  following?: boolean
  leadBitrixId?: string | null
  propCRMName?: string | null
  url: { id: number; url: string; isExternal?: boolean }
  seo?: {
    title?: string
    metaDescription?: string
    previewImage?: PenthouseImage
  }
  blocks: PenthouseBlock[]
  associatedEntity?: Array<{
    __component: string
    id?: number
    [key: string]: unknown
  }>
  localizations?: unknown[]
}

export interface PenthouseGetPageResponse {
  page: PenthousePage
}

export interface PenthouseGetPagesResponse {
  pages: PenthousePage[]
  scripts: Array<{ name: string; content: string; rank: number }>
  globalSettings: {
    favicon?: PenthouseImage
    formData: Array<{ key: string; value: string }>
    notificationsTexts: Array<{ key: string; value: string }>
  }
  course: {
    rates: Record<string, number>
    availableCurrencies: string[]
    lastUpdated: string
  }
}

// ── GET /listings/projects ────────────────────────────────────────────────────

export interface PenthouseProjectFilters {
  ids?: number[]
  areas?: number[]
  propertyTypes?: number[]
  price?: [number, number]
  handover?: string[]
  developers?: number[]
  categories?: string[]
}

export interface PenthouseListingsProjectsParams {
  locale?: string
  currency?: string
  page?: number
  pageSize?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
  search?: string
  filters?: PenthouseProjectFilters
}

export interface PenthouseFacetItem {
  id: number
  label: string
  count: number
}

export interface PenthouseFacetResult {
  data: PenthouseFacetItem[]
  meta: PenthouseMeta
}

export interface PenthouseProjectItem {
  id: number
  title?: string
  slug?: string
  [key: string]: unknown
}

export interface OffPlanProjectCard {
  id: number
  title: string | null
  price: number | null
  priceFrom: string | null
  minPrice: number | null
  maxPrice: number | null
  currency: string | null
  handover: string | null
  handoverValue: string | null
  paymentPlan: string | null
  roi: string | null
  completion: 'COMPLETED' | 'UNDER_CONSTRUCTION' | null
  saleType: 'DEVELOPER' | 'RESALE' | null
  featured: boolean
  floorArea: string | null
  areaValue: number | null
  areaUnit: 'SQ_FT' | 'METERS' | null
  numberOfUnits: number | null
  floors: string | null
  previewImage: unknown | null
  previewImageFile: PenthouseImage | null
  videoURL: string | null
  brochureURL: string | null
  titleLevel: number
  leadEntity: string
  leadProjectId: string | null
  mapLocation: string | null
  brandCollaboration: string | null
  pageUrl: { url: string; isExternal: boolean } | null
  projectTypes: Array<{ name: string }>
  area: { title: string } | null
  developer: {
    name: string
    image: unknown | null
    pageUrl: { url: string; isExternal: boolean } | null
  } | null
  agent: {
    pageUrl: { url: string; isExternal: boolean } | null
  } | null
  coordinates: { lat: number; lng: number } | null
  beds: { title: string; values: string[] } | null
}

export interface PenthouseListingsProjectsResponse {
  result: { data: OffPlanProjectCard[]; meta: PenthouseMeta }
  areaResult: PenthouseFacetResult
  propertyTypeResult: PenthouseFacetResult
  developerResult: PenthouseFacetResult
  agentResult: PenthouseFacetResult
  handoverResult: PenthouseFacetResult
  categoryResult: PenthouseFacetResult
  priceResult: { min: number; max: number }
}

// ── GET /listings/property ────────────────────────────────────────────────────

export interface PenthousePropertyFilters {
  search?: string[]
  propertyType?: number
  price?: [number, number]
  beds?: string[]
  baths?: string[]
  completion?: 'COMPLETED' | 'UNDER_CONSTRUCTION'
  furnishing?: 'FURNISHED' | 'UNFURNISHED' | 'PARTLY_FURNISHED'
}

export interface PenthouseListingsPropertyParams {
  locale?: string
  currency?: string
  page?: number
  pageSize?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
  filters?: PenthousePropertyFilters
}

export interface PenthousePropertyItem {
  id: number
  title?: string
  slug?: string
  [key: string]: unknown
}

export interface PenthouseListingsPropertyResponse {
  result: { data: PenthousePropertyItem[]; meta: PenthouseMeta }
  propertyTypeResult: PenthouseFacetResult
  bedsResult: PenthouseFacetResult
  bathsResult: PenthouseFacetResult
  completionResult: PenthouseFacetResult
  furnishingResult: PenthouseFacetResult
  priceResult: { min: number; max: number }
}

// ── GET /listings/*/search ────────────────────────────────────────────────────

export interface PenthouseSearchResponse {
  data: Array<{ id: number; label: string }>
  meta: { total: number; pageSize: number; hasMatches: boolean }
}

// ── GET /listings/similar ─────────────────────────────────────────────────────

export interface PenthouseSimilarParams {
  type: 'projects' | 'property'
  id: number
  locale?: string
  currency?: string
}

export interface PenthouseSimilarResponse {
  data: unknown[]
  meta: {
    total: number
    minTarget: number
    maxAllowed: number
    tiersUsed: number[]
  }
}

// ── POST /leads ───────────────────────────────────────────────────────────────

export interface PenthouseLeadData {
  name: string
  email: string
  phone: string
  message?: string
  area?: string
  projectId?: string
  entity?: 'off_plan' | 'secondary'
  agentId?: string
  pageBitrixId?: string
  extraData?: Record<string, unknown>
  recaptcha_response?: string
}

// ── GET /get-areas ────────────────────────────────────────────────────────────

export interface PenthouseAreaItem {
  id: number
  title: string
  subtitle?: string
  description?: string
  previewImage?: PenthouseImage
  pageUrl?: { url: string }
}

export interface PenthouseAreasResponse {
  data: PenthouseAreaItem[]
  meta: PenthouseMeta
}

// ── GET /get-articles ─────────────────────────────────────────────────────────

export interface PenthouseArticleItem {
  id: number
  title: string
  date: string
  summary?: string
  category?: string
  timeToRead?: string
  previewImage?: PenthouseImage
  pageUrl?: { url: string }
}

export interface PenthouseArticlesResponse {
  data: PenthouseArticleItem[]
  meta: PenthouseMeta
}

// ── Article detail (associatedEntity.article) ─────────────────────────────────

export interface ArticleTextSegment {
  type: 'text'
  text: string
  styles?: Record<string, unknown>
}

export interface ArticleTableCell {
  type: 'tableCell'
  props?: Record<string, unknown>
  content?: ArticleTextSegment[]
}

export interface ArticleTableRow {
  cells: ArticleTableCell[]
}

export interface ArticleTableContent {
  type: 'tableContent'
  rows: ArticleTableRow[]
  columnWidths?: (number | null)[]
}

export interface ArticleProjectContent {
  id: number
  title?: string
  url?: string
  areaTitle?: string
  developerName?: string
  minPrice?: number
  maxPrice?: number
}

export interface ArticleContentBlock {
  id: string
  type: string
  props?: Record<string, unknown>
  content?: ArticleTextSegment[] | ArticleTableContent | ArticleProjectContent
  children?: ArticleContentBlock[]
}

export interface PenthouseArticleAuthor {
  id: number
  name: string
  position?: string
  image?: PenthouseImage
  imageFile?: PenthouseImage
}

export interface PenthouseArticleCategory {
  id: number
  name: string
}

export interface PenthouseArticleDetail {
  id: number
  title: string
  date: string
  summary?: string
  timeToRead?: string
  content: ArticleContentBlock[]
  author?: PenthouseArticleAuthor
  editor?: PenthouseArticleAuthor
  category?: PenthouseArticleCategory
  previewImage?: PenthouseImage
  pinned?: boolean
  order?: number
  point?: string | null
}

// ── GET /get-developers ───────────────────────────────────────────────────────

export interface PenthouseDeveloperItem {
  id: number
  name: string
  image?: PenthouseImage
  projectCount: number
  minPrice?: number
  pageUrl?: { url: string }
  offPlanProjects?: unknown[]
  secondaryProjects?: unknown[]
}

export interface PenthouseDevelopersResponse {
  results: PenthouseDeveloperItem[]
  pagination: PenthouseMeta
}

// ── GET /search-agents ────────────────────────────────────────────────────────

export interface PenthouseAgentItem {
  id: number
  name: string
  position?: string
  cardImage?: PenthouseImage
  whatsapp?: string
  phoneNumber?: string
}

export interface PenthouseAgentsResponse {
  data: PenthouseAgentItem[]
  meta: PenthouseMeta
}

// ── GET /favourites ───────────────────────────────────────────────────────────

export type PenthouseFavouritesType = 'off_plan_projects' | 'secondary_projects' | 'areas'

export interface PenthouseFavouritesParams {
  ids: string
  type?: PenthouseFavouritesType
  page?: number
  pageSize?: number
  sort?: 'createdAt:asc' | 'createdAt:desc'
}

export interface PenthouseFavouritesResponse {
  data: unknown[]
  meta: PenthouseMeta
}

// ── GET /global-settings ──────────────────────────────────────────────────────

export interface PenthouseGlobalSettings {
  favicon?: PenthouseImage
  recaptchaPublicKey?: string
  isActiveRecaptcha?: boolean
  defaultWhatsapp?: string
  formData: Array<{ key: string; value: string }>
  notificationsTexts: Array<{ key: string; value: string }>
}

export interface PenthouseGlobalSettingsResponse {
  data: PenthouseGlobalSettings
}

// ── GET /currency-rates ───────────────────────────────────────────────────────

export interface PenthouseCurrencyRatesResponse {
  data: {
    rates: Record<string, number>
    availableCurrencies: string[]
    lastUpdated: string
  }
}

// ── GET /redirects ────────────────────────────────────────────────────────────

export interface PenthouseRedirectItem {
  id: number
  from: string
  to: string
}

export interface PenthouseRedirectsResponse {
  data: PenthouseRedirectItem[]
}

// ── GET /robots-txts ──────────────────────────────────────────────────────────

export interface PenthouseRobotsTxtResponse {
  data: {
    id: number
    Content: string
  }
}

// ── Secondary property (associatedEntity.secondary) ────────────────────────────

export interface SecondaryPropertyImage {
  id: number
  url: string
  alternativeText?: string | null
  formats?: {
    xl_webp?: { url: string; width: number; height: number }
    thumbnail?: { url: string; width: number; height: number }
  }
}

export interface SecondaryPropertyFeature {
  id: number
  value: string
}

export interface SecondaryPropertyDld {
  id: number
  status: string
  start: string
  end: string
  qrcodeUrl: string
}

export interface SecondaryPropertyProject {
  id: number
  title: string | null
  handoverValue: string | null
  paymentPlan: string | null
  floors: string | null
  brandCollaboration: string | null
  videoURL: string | null
  projectTypes: Array<{ id: number; name: string }>
  beds: { multiValue: string[] } | null
  developer: {
    name: string
    pageUrl: { url: string } | null
  } | null
  area: {
    title: string
    pageUrl: { url: string } | null
  } | null
  coordinates: { id: number; lat: number; lng: number } | null
}

export interface SecondaryProperty {
  id: number
  price: number | null
  propertyRefNo: string | null
  unitReferenceNo: string | null
  adType: string | null
  unitType: string | null
  primaryView: string | null
  unitBuiltupArea: number | null
  noOfBathroom: number | null
  propertyTitle: string | null
  webRemarks: string | null
  country: string | null
  emirate: string | null
  community: string | null
  subCommunity: string | null
  propertyName: string | null
  listingAgent: string | null
  listingAgentPhone: string | null
  listingAgentEmail: string | null
  listingDate: string | null
  lastUpdated: string | null
  bedrooms: string | null
  latitude: string | null
  longitude: string | null
  parking: string | null
  permitNumber: string | null
  completionStatus: string | null
  images: SecondaryPropertyImage[]
  features: SecondaryPropertyFeature[]
  dld: SecondaryPropertyDld | null
  pageUrl: { url: string; isExternal: boolean } | null
  project: SecondaryPropertyProject | null
}
