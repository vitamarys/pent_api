const TRACKING_KEY = '_pent_tracking'

const TRACKED_URL_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'li_fat_id', 'yclid',
]

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  )
  return m ? decodeURIComponent(m[1]) : undefined
}

function loadStoredTracking(): Record<string, string> {
  try {
    const raw = localStorage.getItem(TRACKING_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

/** Call on every page navigation to persist URL tracking params into localStorage. */
export function persistTrackingParams(): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const found: Record<string, string> = {}
  for (const key of TRACKED_URL_KEYS) {
    const val = url.searchParams.get(key)
    if (val) found[key] = val
  }
  if (Object.keys(found).length === 0) return
  const merged = { ...loadStoredTracking(), ...found }
  try {
    localStorage.setItem(TRACKING_KEY, JSON.stringify(merged))
  } catch {
    // ignore
  }
}

export function getLeadExtraData(): Record<string, unknown> {
  if (typeof window === 'undefined') return {}

  const extraData: Record<string, unknown> = {
    page_url: window.location.href,
  }

  const url = new URL(window.location.href)

  // Stored tracking (persisted from first landing with params)
  const stored = loadStoredTracking()
  Object.assign(extraData, stored)

  // Chat2Desk UTM fallback (legacy)
  if (!stored.utm_source) {
    try {
      const chat2desk = localStorage.getItem('UTM_STORAGE_KEY')
      if (chat2desk) {
        const utms = JSON.parse(chat2desk) as Record<string, string>
        Object.assign(extraData, utms)
      }
    } catch {
      // ignore
    }
  }

  // Current URL params always override stored values
  for (const key of TRACKED_URL_KEYS) {
    const val = url.searchParams.get(key)
    if (val) extraData[key] = val
  }

  // Google Analytics client ID from _ga cookie
  const gaCookie = readCookie('_ga')
  if (gaCookie) {
    const parts = gaCookie.split('.')
    if (parts.length >= 4) extraData.ga_client_id = `${parts[2]}.${parts[3]}`
  }

  // Google Click ID from cookie (fallback if not captured yet)
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

  // Yandex click ID from cookie (fallback)
  if (!extraData.yclid) {
    const yclid = readCookie('yclid')
    if (yclid) extraData.yclid = yclid
  }

  // PostHog distinct ID
  try {
    const ph = (window as unknown as Record<string, unknown>).posthog
    if (ph && typeof (ph as Record<string, unknown>).get_distinct_id === 'function') {
      const phId = (ph as { get_distinct_id: () => string }).get_distinct_id()
      if (phId) extraData.posthog_id = phId
    }
  } catch {
    // ignore
  }

  return extraData
}
