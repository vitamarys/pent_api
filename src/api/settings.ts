import { unstable_cache } from 'next/cache'
import strapiClient from '@/lib/axios'
import type {
  PenthouseGlobalSettingsResponse,
  PenthouseCurrencyRatesResponse,
  PenthouseRedirectsResponse,
  PenthouseRobotsTxtResponse,
} from '@/types/penthouse-api'

export const getGlobalSettings = unstable_cache(
  async (): Promise<PenthouseGlobalSettingsResponse | null> => {
    try {
      const { data } = await strapiClient.get<PenthouseGlobalSettingsResponse>('/api/global-settings')
      return data
    } catch {
      return null
    }
  },
  ['global-settings'],
  { revalidate: 86400, tags: ['global-settings'] },
)

export const getCurrencyRates = unstable_cache(
  async (): Promise<PenthouseCurrencyRatesResponse | null> => {
    try {
      const { data } = await strapiClient.get<PenthouseCurrencyRatesResponse>('/api/currency-rates')
      return data
    } catch {
      return null
    }
  },
  ['currency-rates'],
  { revalidate: 3600, tags: ['currency-rates'] },
)

export const getRedirects = unstable_cache(
  async (): Promise<PenthouseRedirectsResponse | null> => {
    try {
      const { data } = await strapiClient.get<PenthouseRedirectsResponse>('/api/redirects', {
        params: { getAll: 'true' },
      })
      return data
    } catch {
      return null
    }
  },
  ['redirects'],
  { revalidate: 86400, tags: ['redirects'] },
)

export const getRobotsTxt = unstable_cache(
  async (): Promise<PenthouseRobotsTxtResponse | null> => {
    try {
      const { data } = await strapiClient.get<PenthouseRobotsTxtResponse>('/api/robots-txts')
      return data
    } catch {
      return null
    }
  },
  ['robots-txt'],
  { revalidate: 86400, tags: ['robots-txt'] },
)
