import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Apex Athletics — Premium Sports Marketplace',
    template: '%s | Apex Athletics',
  },
  description: 'Premium multi-vendor sports marketplace connecting athletes with the best performance gear from independent vendors.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://apexathletics.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'Apex Athletics',
    title: 'Apex Athletics — Premium Sports Marketplace',
    description: 'Premium multi-vendor sports marketplace connecting athletes with the best performance gear.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Athletics',
    description: 'Premium multi-vendor sports marketplace.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; frame-src https://checkout.stripe.com https://js.stripe.com;" />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-textMain min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Apex Athletics",
              "url": "https://apexathletics.com",
              "logo": "https://apexathletics.com/logo.png",
              "sameAs": [
                "https://twitter.com/apexathletics",
                "https://instagram.com/apexathletics"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
