import type { Metadata } from 'next'
import { Prata } from 'next/font/google'
import './globals.scss'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import Providers from './providers'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

const prata = Prata({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-prata',
})

export const metadata: Metadata = {
  title: {
    template: '%s | OPR Real Estate',
    default: 'OPR Real Estate — Buy, Rent & Sell Properties',
  },
  description: 'Find your dream property. Apartments, villas, townhouses for sale and rent.',
  openGraph: {
    type: 'website',
    siteName: 'OPR Real Estate',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${prata.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
