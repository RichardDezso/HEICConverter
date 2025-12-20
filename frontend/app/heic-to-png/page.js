import { ConverterTool } from '@/components/ConverterTool';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'HEIC to PNG Converter – Convert HEIC to PNG Online Free',
  description: 'Convert HEIC to PNG format with lossless quality. Free online converter supporting transparency and batch conversion. No signup required.',
  keywords: ['HEIC to PNG', 'HEIC to PNG converter', 'convert HEIC to PNG', 'lossless conversion'],
  alternates: {
    canonical: 'https://www.heicconverteronline.com/heic-to-png',
  },
  openGraph: {
    title: 'HEIC to PNG Converter – Convert HEIC to PNG Online Free',
    description: 'Convert HEIC to PNG with lossless quality. Free online converter.',
    url: 'https://www.heicconverteronline.com/heic-to-png',
    type: 'website',
  },
};

export default function HeicToPngPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">HEIC to PNG Converter</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert HEIC images to PNG format while preserving quality and transparency. 
            Perfect for graphics and images that need lossless compression.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ConverterTool />
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="pt-8 prose prose-slate max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Why Convert HEIC to PNG?</h2>
              <p className="text-muted-foreground mb-6">
                PNG (Portable Network Graphics) is an excellent format when you need lossless compression 
                and transparency support. Converting HEIC to PNG is ideal for graphics, logos, screenshots, 
                and images where quality is paramount.
              </p>

              <h3 className="text-xl font-semibold mb-3">Benefits of PNG Format</h3>
              <ul className="space-y-2 mb-6">
                {[
                  'Lossless compression – no quality loss during conversion',
                  'Transparency support (alpha channel) for overlays and graphics',
                  'Better for text, screenshots, and images with sharp edges',
                  'Widely supported across all platforms and browsers',
                  'Ideal for design work and editing'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mb-4">How to Convert HEIC to PNG</h2>
              <ol className="space-y-3 mb-6 list-decimal list-inside text-muted-foreground">
                <li>Upload your HEIC files using the converter above</li>
                <li>Select PNG as the output format</li>
                <li>Click Convert and wait a few seconds</li>
                <li>Download your lossless PNG images</li>
              </ol>

              <h2 className="text-2xl font-semibold mb-4">When to Choose PNG Over JPG</h2>
              <p className="text-muted-foreground mb-6">
                PNG is the better choice when you need:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Screenshots and UI captures with text',
                  'Images with transparency requirements',
                  'Graphics, logos, and illustrations',
                  'Images that will be edited multiple times',
                  'Maximum quality without compression artifacts'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground">
                For a detailed comparison, see our <Link href="/guides/heic-vs-jpg-comparison" className="text-primary hover:underline">HEIC vs JPG comparison guide</Link>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12 bg-muted/30">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Does converting HEIC to PNG reduce quality?</h3>
            <p className="text-muted-foreground">No. PNG uses lossless compression, so image detail remains completely intact.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Why is the PNG file larger than HEIC?</h3>
            <p className="text-muted-foreground">PNG preserves more raw image data for lossless quality, which increases file size compared to HEIC's efficient compression.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Can I convert HEIC to PNG on my phone?</h3>
            <p className="text-muted-foreground">Yes! This converter works on any device with a modern browser, including iPhones and Android phones.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Do I need to install anything?</h3>
            <p className="text-muted-foreground">No installation needed. Everything runs directly in your browser.</p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Related Guides</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/guides/heic-to-png-converter-guide" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Complete HEIC to PNG Guide</h3>
                <p className="text-sm text-muted-foreground">Everything you need to know about PNG conversion.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/heic-vs-jpg-comparison" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">HEIC vs JPG Comparison</h3>
                <p className="text-sm text-muted-foreground">Compare image formats and choose wisely.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/what-is-heic-file-complete-guide" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What is HEIC?</h3>
                <p className="text-sm text-muted-foreground">Complete guide to the HEIC format.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
