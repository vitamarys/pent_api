import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Prata } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.scss'
import Providers from './providers'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import TrackingInit from '@/components/ui/TrackingInit'

const prata = Prata({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-prata',
})

const sfProDisplay = localFont({
  src: [
    {
      path: '../styles/fonts/sf-pro-display/sf-pro-display-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/sf-pro-display/sf-pro-display-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../styles/fonts/sf-pro-display/sf-pro-display-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro',
  display: 'optional',
})


export const metadata: Metadata = {
  title: {
    template: '%s | PentTest',
    default: 'PentTest — Buy, Rent & Sell Properties',
  },
  description: 'Find your dream property. Apartments, villas, townhouses for sale and rent.',
  openGraph: {
    type: 'website',
    siteName: 'PentTest',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${prata.variable} ${sfProDisplay.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <Suspense fallback={null}>
            <TrackingInit />
          </Suspense>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
