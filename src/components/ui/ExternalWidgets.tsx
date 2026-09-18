'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// ── WhatsApp widget ────────────────────────────────────────────────────────────
const WA_SCRIPT_ID = 'wa-widget-script'
const WA_SCRIPT_SRC = 'https://mpp.agency/widget/v2/index.js'
const WA_PHONE = '+971501893886'

// ── Ringostat calltracking ─────────────────────────────────────────────────────
const CT_SCRIPT_ID = 'ringostat-script'
const CT_SCRIPT_SRC = 'https://mpp.agency/ringostat/v1/ringostat.js'
const CT_BUTTONS = '.col-btn'
const CT_BUTTONS_WHITE = 'white-btn'
const CT_DEFAULT_NUMBER = '+971 58 5577888'
const CT_CLASSNAME = 'ringo_abudhabi'

declare global {
  interface Window {
    global_lang?: string
    waCustomPhone?: string
    waCustomMsgs?: Record<string, string>
    ct_buttons?: string
    ct_buttons_white?: string
    ct_lang?: string
    ct_default_number?: string
    ct_classname?: string
  }
}

function buildWaMsgs(pageUrl: string): Record<string, string> {
  return {
    en: `Hi, I am Interested in properties from ${pageUrl}.`,
    ar: `مرحباً! أنا مهتم بالعقار على ${pageUrl}.`,
    ru: `Здравствуйте! Меня заинтересовало предложение с сайта ${pageUrl}.`,
  }
}

function injectScript(id: string, src: string) {
  if (document.getElementById(id)) return
  const sc = document.createElement('script')
  sc.id = id
  sc.async = true
  sc.src = src
  document.body.appendChild(sc)
}

export default function ExternalWidgets() {
  const pathname = usePathname()

  useEffect(() => {
    const pageUrl = `${window.location.origin}${window.location.pathname}`

    // Widgets read their config from globals — keep them in sync with the current page
    window.waCustomPhone = WA_PHONE
    window.waCustomMsgs = buildWaMsgs(pageUrl)

    window.ct_buttons = CT_BUTTONS
    window.ct_buttons_white = CT_BUTTONS_WHITE
    window.ct_lang = window.global_lang || document.documentElement.lang || 'en'
    window.ct_default_number = CT_DEFAULT_NUMBER
    window.ct_classname = CT_CLASSNAME

    // Injected after the globals above, so both scripts see the config on load
    injectScript(WA_SCRIPT_ID, WA_SCRIPT_SRC)
    injectScript(CT_SCRIPT_ID, CT_SCRIPT_SRC)
  }, [pathname])

  return null
}
