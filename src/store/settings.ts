import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const CURRENCIES = ['AED', 'USD', 'EUR'] as const
export const METRICS    = ['ft²', 'm²']                         as const

export type Currency = typeof CURRENCIES[number]
export type Metric   = typeof METRICS[number]

interface SettingsState {
  currency:      Currency
  metric:        Metric
  setCurrency:   (c: Currency) => void
  setMetric:     (m: Metric)   => void
  headerHidden:  boolean
  setHeaderHidden: (v: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency:        'AED',
      metric:          'ft²',
      setCurrency:     (currency) => set({ currency }),
      setMetric:       (metric)   => set({ metric }),
      headerHidden:    false,
      setHeaderHidden: (headerHidden) => set({ headerHidden }),
    }),
    { name: 'penthouse-settings', partialize: (s) => ({ currency: s.currency, metric: s.metric }) },
  ),
)
