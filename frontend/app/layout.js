import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';

export const metadata = {
  metadataBase: new URL('https://heicconverteronline.com'),
  title: {
    default: 'HEIC Converter Online - Convert HEIC to JPG, PNG, PDF Free',
    template: '%s | HEIC Converter Online',
  },
  description: 'Free online HEIC converter. Convert HEIC files to JPG, PNG, or PDF format instantly. Batch conversion supported. No signup required.',
  keywords: ['HEIC converter', 'HEIC to JPG', 'HEIC to PNG', 'HEIC to PDF', 'convert HEIC', 'iPhone photos'],
  authors: [{ name: 'HEIC Converter Online' }],
  creator: 'HEIC Converter Online',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heicconverteronline.com',
    siteName: 'HEIC Converter Online',
    title: 'HEIC Converter Online - Convert HEIC to JPG, PNG, PDF Free',
    description: 'Free online HEIC converter. Convert HEIC files to JPG, PNG, or PDF format instantly.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC Converter Online',
    description: 'Free online HEIC converter. Convert HEIC files to JPG, PNG, or PDF.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://heicconverteronline.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232563eb' rx='20'/><text x='50' y='75' font-size='70' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-weight='bold'>H</text></svg>" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <noscript>
          <p style={{padding: '20px', textAlign: 'center'}}>Please enable JavaScript for full functionality.</p>
        </noscript>
      </body>
    </html>
  );
}
