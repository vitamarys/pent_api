import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Prata } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.scss'
import Providers from './providers'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import TrackingInit from '@/components/ui/TrackingInit'
import AnimationInit from '@/components/ui/AnimationInit'

const GTM_ID = 'GTM-PHG3W22'

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
      <head>
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className={`${prata.variable} ${sfProDisplay.variable} font-sans antialiased`} suppressHydrationWarning>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <Suspense fallback={null}>
            <TrackingInit />
          </Suspense>
          <AnimationInit />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
