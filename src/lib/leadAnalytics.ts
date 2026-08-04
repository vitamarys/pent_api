function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  )
  return m ? decodeURIComponent(m[1]) : undefined
}

export function getLeadExtraData(): Record<string, unknown> {
  if (typeof window === 'undefined') return {}

  const extraData: Record<string, unknown> = {
    page_url: window.location.href,
  }

  const url = new URL(window.location.href)

  // UTM from current URL
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  let hasUrlUtm = false
  for (const key of utmKeys) {
    const val = url.searchParams.get(key)
    if (val) { extraData[key] = val; hasUrlUtm = true }
  }

  // UTM from localStorage (Chat2Desk fallback)
  if (!hasUrlUtm) {
    try {
      const stored = localStorage.getItem('UTM_STORAGE_KEY')
      if (stored) {
        const utms = JSON.parse(stored) as Record<string, string>
        Object.assign(extraData, utms)
      }
    } catch {
      // ignore
    }
  }

  // Ad click IDs from URL (URL has priority over cookies)
  const urlClickKeys = ['fbclid', 'gclid', 'gad_source', 'li_fat_id', 'yclid']
  for (const key of urlClickKeys) {
    const val = url.searchParams.get(key)
    if (val) extraData[key] = val
  }

  // Google Analytics client ID from _ga cookie
  const gaCookie = readCookie('_ga')
  if (gaCookie) {
    const parts = gaCookie.split('.')
    if (parts.length >= 4) extraData.ga_client_id = `${parts[2]}.${parts[3]}`
  }

  // Google Click ID from cookie (fallback if not in URL)
  if (!extraData.gclid) {
    const gclAw = readCookie('_gcl_aw')
    if (gclAw) {
      const parts = gclAw.split('.')
      extraData.gclid = parts.length >= 3 ? parts[2] : gclAw
    } else {
      const gclk = readCookie('_gclk_id')
      if (gclk) extraData.gclid = gclk
    }
  }

  // Facebook click ID from cookie _fbc
  const fbc = readCookie('_fbc')
  if (fbc) extraData.fbc = fbc

  // Yandex Metrika
  const ymuid = readCookie('_ym_uid')
  if (ymuid) extraData.ym_uid = ymuid

  // Yandex click ID from cookie (fallback if not in URL)
  if (!extraData.yclid) {
    const yclid = readCookie('yclid')
    if (yclid) extraData.yclid = yclid
  }

  // PostHog distinct ID
  try {
    const ph = (window as Record<string, unknown>).posthog
    if (ph && typeof (ph as Record<string, unknown>).get_distinct_id === 'function') {
      const phId = (ph as { get_distinct_id: () => string }).get_distinct_id()
      if (phId) extraData.posthog_id = phId
    }
  } catch {
    // ignore
  }

  return extraData
}
