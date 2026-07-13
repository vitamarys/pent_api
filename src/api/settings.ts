import strapiClient from '@/lib/axios'
import type {
  PenthouseGlobalSettingsResponse,
  PenthouseCurrencyRatesResponse,
  PenthouseRedirectsResponse,
  PenthouseRobotsTxtResponse,
} from '@/types/penthouse-api'

export async function getGlobalSettings(): Promise<PenthouseGlobalSettingsResponse | null> {
  try {
    const { data } = await strapiClient.get<PenthouseGlobalSettingsResponse>('/api/global-settings')
    return data
  } catch {
    return null
  }
}

export async function getCurrencyRates(): Promise<PenthouseCurrencyRatesResponse | null> {
  try {
    const { data } = await strapiClient.get<PenthouseCurrencyRatesResponse>('/api/currency-rates')
    return data
  } catch {
    return null
  }
}

export async function getRedirects(): Promise<PenthouseRedirectsResponse | null> {
  try {
    const { data } = await strapiClient.get<PenthouseRedirectsResponse>('/api/redirects', {
      params: { getAll: 'true' },
    })
    return data
  } catch {
    return null
  }
}

export async function getRobotsTxt(): Promise<PenthouseRobotsTxtResponse | null> {
  try {
    const { data } = await strapiClient.get<PenthouseRobotsTxtResponse>('/api/robots-txts')
    return data
  } catch {
    return null
  }
}
