import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
const ContactHero = dynamic(() => import('@/components/sections/ContactHero'))
import ContactMap from '@/components/sections/ContactMapLazy'

export const metadata: Metadata = {
  title: 'Contact Us | Penthouse.ae',
  description: "Get in touch with Dubai's award-winning real estate specialists for elite services, luxury listings, and professional advice.",
}

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactMap />
    </main>
  )
}
