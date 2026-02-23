import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LoadingOverlay } from '@/components/loading-overlay'
import { RoutingLoader } from '@/components/routing-loader'
import { Suspense } from 'react'
import { Analytics } from '@/components/analytics'

import { StarrySkyWrapper } from "@/components/three/starry-sky-wrapper"
import { AuthBootstrap } from '@/components/auth/auth-bootstrap'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'SmartPark - Intelligent Parking Solutions',
  description: 'Find and book parking spots securely with our AI-powered platform.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthBootstrap />
          <Suspense fallback={null}>
            <RoutingLoader />
          </Suspense>
          <LoadingOverlay />
          <StarrySkyWrapper />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
