'use client'

import { useSettingsStore } from '@/store/settings'

// 1 sq.ft = 0.0929 m²
const SQ_FT_TO_M2 = 0.0929

// Курси AED → валюта
const RATES: Record<string, number> = {
  USD: 0.2723,
  EUR: 0.2506,
}

export function useDisplayFormat() {
  const { currency, metric } = useSettingsStore()

  const rate = currency === 'AED' ? 1 : (RATES[currency] ?? null)

  function convertAED(priceAED: number): number {
    return rate != null ? priceAED * rate : priceAED
  }

  /** Компактний формат: 1.5M, 250K, etc. */
  function formatPrice(priceAED: number | null | undefined): string {
    if (priceAED == null) return ''
    const val = convertAED(priceAED)
    const cur = rate != null ? currency : 'AED'
    if (val >= 1_000_000) return `${cur} ${+(val / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    if (val >= 1_000)     return `${cur} ${+(val / 1_000).toFixed(1).replace(/\.0$/, '')}K`
    return `${cur} ${Math.round(val).toLocaleString('en-US')}`
  }

  /** Повний формат: 1 250 000 AED */
  function formatPriceFull(priceAED: number | null | undefined): string {
    if (priceAED == null) return ''
    const val = convertAED(priceAED)
    const cur = rate != null ? currency : 'AED'
    return `${Math.round(val).toLocaleString('en-US')} ${cur}`
  }

  /** Площа з конвертацією ft² ↔ m² */
  function formatArea(areaSqFt: number | null | undefined): string {
    if (areaSqFt == null) return ''
    if (metric === 'm²') {
      return `${Math.round(areaSqFt * SQ_FT_TO_M2).toLocaleString('en-US')} m²`
    }
    return `${Math.round(areaSqFt).toLocaleString('en-US')} ft²`
  }

  return { formatPrice, formatPriceFull, formatArea, currency, metric }
}
