import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BUSINESS_CONFIG } from '@kittu-cafe/shared';

export const metadata: Metadata = {
  title: 'Kittu Cafe — Production Food Ordering & Cafe Management | Dausa, Rajasthan',
  description:
    'Order fresh handcrafted coffee, gourmet burgers, stone-baked pizzas, and reserve tables at Kittu Cafe, Shiv Colony, Mariyara Wale, Dausa, Rajasthan 303303.',
  keywords: ['Kittu Cafe', 'Cafe Dausa', 'Coffee shop Dausa Rajasthan', 'Food ordering Dausa', 'Kittu Cafe menu'],
  openGraph: {
    title: 'Kittu Cafe — Artisanal Coffee & Kitchen | Dausa',
    description: 'Experience warm hospitality, handcrafted beverages, and fresh flavors in Dausa, Rajasthan.',
    url: 'https://kittucafe.in',
    siteName: 'Kittu Cafe',
    locale: 'en_IN',
    type: 'website',
  },
};

import { WhatsAppChatbot } from '../components/WhatsAppChatbot';
import { MobileQuickBar } from '../components/MobileQuickBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org Restaurant Structured Data for Local SEO
  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: BUSINESS_CONFIG.name,
    image: 'https://kittucafe.in/logo.png',
    telephone: BUSINESS_CONFIG.contactNumber,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'W82P+3P7, Shiv Colony, Mariyara Wale',
      addressLocality: 'Dausa',
      addressRegion: 'Rajasthan',
      postalCode: '303303',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_CONFIG.coordinates.latitude,
      longitude: BUSINESS_CONFIG.coordinates.longitude,
    },
    url: 'https://kittucafe.in',
    servesCuisine: ['Cafe', 'Fast Food', 'Beverages', 'Italian', 'Indian'],
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '22:30',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFEFA] text-[#231709] antialiased selection:bg-[#FBECE7] selection:text-[#C86D51]">
        <Navbar />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <Footer />
        <WhatsAppChatbot />
        <MobileQuickBar />
      </body>
    </html>
  );
}
