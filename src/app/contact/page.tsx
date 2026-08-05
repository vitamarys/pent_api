import type { Metadata } from 'next'
import ContactHero from '@/components/sections/ContactHero'
import ContactMap from '@/components/sections/ContactMap'

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
