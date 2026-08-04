'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { persistTrackingParams } from '@/lib/leadAnalytics'

export default function TrackingInit() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    persistTrackingParams()
  }, [pathname, searchParams])

  return null
}
