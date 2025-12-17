// src/lib/config/metadata.ts
import { Metadata } from 'next';

/**
 * Comprehensive application metadata configuration
 * Used globally across the entire application
 */
export const siteMetadata: Metadata = {
  // Basic metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pixio-api-starter.vercel.app'),
  title: {
    default: 'Pixio API Starter',
    template: '%s | Pixio API Starter'
  },
  description: 'Unleash AI creativity with Pixio API for stunning image and video generation, powered by Supabase, NextJS, and Stripe',
  applicationName: 'Pixio API Starter',
  authors: [{ name: 'Alisher Farhadi', url: 'https://pixio-api-starter.vercel.app' }],
  generator: 'Next.js',
  keywords: ['AI', 'image generation', 'video generation', 'Pixio API', 'ComfyUI', 'Supabase', 'SaaS', 'AI media', 'subscription', 'credits', 'artificial intelligence'],
  referrer: 'origin-when-cross-origin',
  creator: 'Alisher Farhadi',
  publisher: 'Alisher Farhadi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  colorScheme: 'light dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/metadata/favicon.ico', sizes: 'any' },
      { url: '/metadata/icon.svg', type: 'image/svg+xml' },
      { url: '/metadata/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/metadata/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/metadata/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/metadata/safari-pinned-tab.svg', color: '#7068F4' },
      { rel: 'apple-touch-startup-image', url: '/metadata/splash.png' }
    ]
  },
  
  // AppLinks (deep linking)
  appleWebApp: {
    title: 'Pixio API Starter',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  
  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'google-site-verification',
    yandex: process.env.YANDEX_VERIFICATION || 'yandex-verification',
    yahoo: process.env.YAHOO_VERIFICATION || 'yahoo-verification',
    other: {
      'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || 'facebook-domain-verification',
      'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION || 'baidu-site-verification',
      'bing-verification': process.env.BING_VERIFICATION || 'bing-verification'
    }
  },
  
  // Open Graph metadata
  openGraph: {
    type: 'website',
    siteName: 'Pixio API Starter',
    title: 'Pixio API Starter - AI Media Generation',
    description: 'Unleash AI creativity with Pixio API for stunning image and video generation, powered by Supabase, NextJS, and Stripe',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'es_ES', 'de_DE'],
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pixio-api-starter.vercel.app',
    images: [
      {
        url: '/metadata/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pixio API Starter - AI Media Generation',
        type: 'image/png',
        secureUrl: '/metadata/og-image.png',
      },
      {
        url: '/metadata/og-square-image.png',
        width: 1080,
        height: 1080,
        alt: 'Pixio API Starter - AI Media Generation Square',
        type: 'image/png',
      }
    ],
    countryName: 'United States',
    determiner: 'the',
    emails: ['alisher.farhadi@gmail.com'],
    phoneNumbers: ['+1-800-123-4567'],
    faxNumbers: ['+1-800-123-4568'],
  },
  
  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    site: '@pixio_ai',
    creator: '@pixio_ai',
    title: 'Pixio API Starter - AI Media Generation',
    description: 'Unleash AI creativity with Pixio API for stunning image and video generation, powered by Supabase, NextJS, and Stripe',
    images: {
      url: '/metadata/twitter-image.png',
      alt: 'Pixio API Starter - AI Media Generation',
    }
  },
  
  // SEO controls
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  
  // Alternate versions
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://pixio-api-starter.vercel.app',
    languages: {
      'en-US': 'https://pixio-api-starter.vercel.app/en-US',
      'fr-FR': 'https://pixio-api-starter.vercel.app/fr-FR',
      'es-ES': 'https://pixio-api-starter.vercel.app/es-ES',
    },
    media: {
      'only screen and (max-width: 600px)': 'https://pixio-api-starter.vercel.app/mobile',
    },
    types: {
      'application/rss+xml': 'https://pixio-api-starter.vercel.app/rss',
    }
  },
  

  
  // Other custom metadata
  other: {
    'msapplication-TileColor': '#7068F4',
    'msapplication-config': '/browserconfig.xml',
    'apple-itunes-app': 'app-id=123456789, app-argument=https://pixio-api-starter.vercel.app',
    'google-play-app': 'app-id=com.pixio.api',
    'application-name': 'Pixio API',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Pixio API',
    'theme-color': '#7068F4',
    'format-detection': 'telephone=no',
    'pinterest': process.env.PINTEREST_VERIFICATION || 'pinterest-verification',
    'norton-safeweb-site-verification': process.env.NORTON_VERIFICATION || 'norton-verification',
    
    // Structured data (JSON-LD)
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Pixio API Starter',
      'url': process.env.NEXT_PUBLIC_SITE_URL || 'https://pixio-api-starter.vercel.app',
      'description': 'Unleash AI creativity with powerful machines for stunning image and video generation',
      'applicationCategory': 'MultimediaApplication, AIApplication',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'author': {
        '@type': 'Organization',
        'name': 'Pixio API',
        'url': process.env.NEXT_PUBLIC_SITE_URL || 'https://pixio-api-starter.vercel.app'
      },
      'potentialAction': {
        '@type': 'ViewAction',
        'target': [
          process.env.NEXT_PUBLIC_SITE_URL || 'https://pixio-api-starter.vercel.app'
        ]
      },
      'sameAs': [
        'https://twitter.com/pixioapi',
        'https://github.com/afarhadi99/pixio-api-starter',
        'https://www.instagram.com/pixioapi'
      ]
    })
  }
};
