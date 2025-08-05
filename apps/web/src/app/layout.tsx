import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://autoshow.ai'
  ),
  title: {
    template: '%s | AutoShow',
    default: 'AutoShow - AI-Powered Show Notes Generator',
  },
  description:
    'Transform audio and video content into professional show notes using advanced AI. Support for multiple languages, custom templates, and seamless integration.',
  keywords: [
    'AI transcription',
    'show notes',
    'podcast automation',
    'audio processing',
    'video transcription',
    'content generation',
  ],
  authors: [{ name: 'AutoShow Team' }],
  creator: 'AutoShow',
  publisher: 'AutoShow',
  category: 'Technology',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      zh: '/zh',
      'x-default': '/en',
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'AutoShow',
    title: 'AutoShow - AI-Powered Show Notes Generator',
    description:
      'Transform audio and video content into professional show notes using advanced AI.',
    images: [
      {
        url: '/og/en/home.png',
        width: 1200,
        height: 630,
        alt: 'AutoShow - AI-Powered Show Notes Generator',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'AutoShow - AI-Powered Show Notes Generator',
    description:
      'Transform audio and video content into professional show notes using advanced AI.',
    images: ['/og/en/home.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
