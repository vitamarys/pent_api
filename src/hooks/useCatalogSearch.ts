'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getProjects, getProperty } from '@/api/listings'
import { useSettingsStore } from '@/store/settings'

// ── helpers ───────────────────────────────────────────────────

function bedOrder(id: string) {
  if (id === 'Studio') return -1
  const n = parseInt(id, 10)
  return isNaN(n) ? 999 : n
}

// ── useCatalogOptions ─────────────────────────────────────────
// Завантажує property types + bed options один раз.
// Кешується 10 хвилин — підходить для будь-якої сторінки з фільтрами.

export function useCatalogOptions(activeTab: 'off-plan' | 'secondary') {
  const currency = useSettingsStore(s => s.currency)

  return useQuery({
    queryKey: ['catalog-options', activeTab, currency],
    queryFn: async () => {
      const res = activeTab === 'off-plan'
        ? await getProjects({ currency })
        : await getProperty({ currency })

      const propertyTypeOptions = (res.propertyTypeResult?.data ?? []).map(t => ({
        id: t.id as number,
        label: t.label,
      }))

      const bedroomOptions = (res.bedsResult?.data ?? [])
        .map(t => ({ id: String(t.id), label: t.label }))
        .sort((a, b) => bedOrder(a.id) - bedOrder(b.id))

      return { propertyTypeOptions, bedroomOptions }
    },
    staleTime: 10 * 60 * 1000,
  })
}

// ── useAvailableBedrooms ──────────────────────────────────────
// Коли обрані типи нерухомості — повертає Set bed-id які мають результати.
// Якщо типи не обрані — повертає null (всі доступні).

export function useAvailableBedrooms(
  activeTab: 'off-plan' | 'secondary',
  selectedTypes: number[],
) {
  const currency = useSettingsStore(s => s.currency)

  return useQuery({
    queryKey: ['available-bedrooms', activeTab, currency, selectedTypes],
    queryFn: async () => {
      if (selectedTypes.length === 0) return null
      const filters = { propertyTypes: selectedTypes }
      const res = activeTab === 'off-plan'
        ? await getProjects({ currency, filters })
        : await getProperty({ currency, filters })
      const ids = (res.bedsResult?.data ?? []).map(t => String(t.id))
      return new Set(ids)
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}

// ── useCatalogCount ───────────────────────────────────────────
// Повертає кількість результатів для поточного набору фільтрів.
// placeholderData зберігає попереднє значення поки йде нова вибірка.

export interface CatalogCountParams {
  activeTab: 'off-plan' | 'secondary'
  selectedTypes: number[]
  selectedBedrooms: string[]
  price: [number, number]
  priceMin: number
  priceMax: number
}

export function useCatalogCount(params: CatalogCountParams) {
  const { activeTab, selectedTypes, selectedBedrooms, price, priceMin, priceMax } = params
  const currency = useSettingsStore(s => s.currency)

  const filters: Record<string, unknown> = {}
  if (selectedTypes.length > 0) filters.propertyTypes = selectedTypes
  if (selectedBedrooms.length > 0) filters.beds = selectedBedrooms
  if (price[0] !== priceMin || price[1] !== priceMax) filters.price = [price[0], price[1]] as [number, number]

  return useQuery({
    queryKey: ['catalog-count', activeTab, currency, selectedTypes, selectedBedrooms, price],
    queryFn: async () => {
      if (activeTab === 'off-plan') {
        const res = await getProjects({ currency, filters })
        return res.result?.meta?.total ?? null
      } else {
        const res = await getProperty({ currency, filters })
        return res.result?.meta?.total ?? null
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  })
}
