import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'About HEIC Converter Online',
  description: 'Learn about HEIC Converter Online - a free tool to convert HEIC images to JPG, PNG, or PDF format.',
  alternates: {
    canonical: 'https://www.heicconverteronline.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">About HEIC Converter Online</h1>
        
        <Card className="shadow-lg">
          <CardContent className="pt-8 prose prose-slate max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              HEIC Converter Online is a free, browser-based tool designed to help you convert HEIC images to more widely compatible formats like JPG, PNG, and PDF.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              We believe converting image files should be simple, fast, and free. Our goal is to provide the easiest way to convert HEIC files without requiring software downloads, account signups, or technical knowledge.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Why We Built This Tool</h2>
            <p className="text-muted-foreground mb-6">
              HEIC (High Efficiency Image Container) is the default image format on modern iPhones and iPads. While it offers excellent compression and quality, many devices, websites, and applications don't support it. We created this converter to bridge that gap.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
            <p className="text-muted-foreground mb-6">
              Your privacy matters. All file conversions happen securely, and files are automatically deleted after conversion. We don't store, share, or analyze your images. Read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for more details.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              Have questions or feedback? We'd love to hear from you. Visit our <Link href="/contact" className="text-primary hover:underline">Contact page</Link> to get in touch.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
