import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'AED'): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatCompactPrice(price: number, currency = 'AED'): string {
  if (price >= 1_000_000) return `${currency} ${+(price / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (price >= 1_000) return `${currency} ${+(price / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return `${currency} ${price}`
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat('en-AE').format(area)} sq.ft`
}

export function getStrapiImageUrl(url: string): string {
  if (url.startsWith('http')) return url
  return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`
}
