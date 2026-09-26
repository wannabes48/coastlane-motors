import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Nav } from '@/components/nav';
import { CookieBanner } from '@/components/cookie-banner';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Coastlane Motors — Used & New Cars for Sale in Kenya', template: '%s | Coastlane Motors' },
  description: 'Browse verified used and new cars for sale in Kenya. Clear prices, full photos, duty paid. WhatsApp us to view or reserve.',
  openGraph: { type: 'website', locale: 'en_KE', siteName: 'Coastlane Motors' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

import { getConditionCounts } from '@/lib/queries';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const counts = await getConditionCounts({}).catch(() => ({ used: 0, new: 0 }));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AutoDealer',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#dealer`,
        name: 'Coastlane Motors',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        telephone: process.env.NEXT_PUBLIC_PHONE,
        image: `${process.env.NEXT_PUBLIC_SITE_URL}/icon.svg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Haile Sellassie Avenue',
          addressLocality: 'Mombasa',
          addressCountry: 'KE'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -4.0628,
          longitude: 39.6706
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '08:00',
            closes: '18:00'
          }
        ],
        sameAs: [
          'https://facebook.com/coastlanemotors',
          'https://instagram.com/coastlanemotors'
        ]
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#business`,
        name: 'Coastlane Motors',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        telephone: process.env.NEXT_PUBLIC_PHONE,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Haile Sellassie Avenue',
          addressLocality: 'Mombasa',
          addressCountry: 'KE'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -4.0628,
          longitude: 39.6706
        },
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-BJ56VFTZQ0" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BJ56VFTZQ0');
          `}
        </Script>
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Nav counts={counts} />
        
        <main className="flex-1 flex flex-col pt-14">
          {children}
        </main>
        
        <footer className="bg-ink text-white py-12 lg:py-16 mt-auto">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-6"><Logo variant="dark" className="opacity-90" /></div>
              <p className="text-white/80 mb-2">Haile Sellassie Avenue<br/>Mombasa, Kenya</p>
              <p className="text-white/80 mb-2">0800 hours - 1800 hours</p>
              <p className="text-white/80 text-sm mt-4">We deliver across East Africa.</p>
            </div>
            <div>
              <h3 className="font-sans font-bold text-xl mb-4">Contact</h3>
              <p className="text-white/80 mb-2">
                <a href={`tel:${process.env.NEXT_PUBLIC_PHONE}`} className="hover:text-white">{process.env.NEXT_PUBLIC_PHONE}</a>
              </p>
              <p className="text-white/80 mb-2">
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} className="hover:text-white" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
              </p>
              <p className="text-white/80">
                <a href={`mailto:${process.env.SALES_INBOX}`} className="hover:text-white">{process.env.SALES_INBOX}</a>
              </p>
            </div>
            <div>
              <h3 className="font-sans font-bold text-xl mb-4">Quick Links</h3>
              <nav className="flex flex-col gap-2 text-white/80">
                <Link href="/used" className="hover:text-white w-fit">Used Cars</Link>
                <Link href="/new" className="hover:text-white w-fit">New Cars</Link>
                <Link href="/about" className="hover:text-white w-fit">About Us</Link>
                <Link href="/contact" className="hover:text-white w-fit">Contact</Link>
              </nav>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
            <p>&copy; {new Date().getFullYear()} Coastlane Motors. All rights reserved.</p>
          </div>
        </footer>
        <CookieBanner />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
