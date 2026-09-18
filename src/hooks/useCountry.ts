'use client'

import { useState, useEffect } from 'react'
import type { Country } from 'react-phone-number-input/min'

// Module-level cache: fetch fires only once per browser session
let cached: Promise<Country> | null = null

function fetchCountry(): Promise<Country> {
  if (!cached) {
    cached = fetch('https://api.country.is/')
      .then(r => r.json())
      .then(d => (d?.country as Country) || 'AE')
      .catch(() => 'AE' as Country)
  }
  return cached
}

export function useCountry(): Country {
  const [country, setCountry] = useState<Country>('AE')

  useEffect(() => {
    fetchCountry().then(setCountry)
  }, [])

  return country
}
