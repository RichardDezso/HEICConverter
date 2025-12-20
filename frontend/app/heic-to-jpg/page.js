import { ConverterTool } from '@/components/ConverterTool';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'HEIC to JPG Converter – Convert HEIC to JPEG Online Free',
  description: 'Convert HEIC to JPG format instantly. Free online HEIC to JPEG converter with batch processing support. Works on any device.',
  keywords: ['HEIC to JPG', 'HEIC to JPEG', 'convert HEIC to JPG', 'iPhone photos to JPG'],
  alternates: {
    canonical: 'https://www.heicconverteronline.com/heic-to-jpg',
  },
  openGraph: {
    title: 'HEIC to JPG Converter – Convert HEIC to JPEG Online Free',
    description: 'Convert HEIC to JPG format instantly. Free online converter.',
    url: 'https://www.heicconverteronline.com/heic-to-jpg',
    type: 'website',
  },
};

export default function HeicToJpgPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">HEIC to JPG Converter</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert your iPhone photos from HEIC to JPG format quickly and easily. 
            JPG is universally compatible and works everywhere.
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
              <h2 className="text-2xl font-semibold mb-4">Why Convert HEIC to JPG?</h2>
              <p className="text-muted-foreground mb-6">
                HEIC (High Efficiency Image Container) is the default image format used by Apple devices since iOS 11. 
                While HEIC offers better compression and quality, JPG is more widely supported across different platforms, 
                devices, and applications.
              </p>

              <h3 className="text-xl font-semibold mb-3">Benefits of Converting to JPG</h3>
              <ul className="space-y-2 mb-6">
                {[
                  'Universal compatibility with all devices and platforms',
                  'Easy sharing on social media and websites',
                  'Opens in any image viewer or editor',
                  'Widely accepted for uploads and submissions',
                  'Works with older software and systems'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mb-4">How to Convert HEIC to JPG</h2>
              <ol className="space-y-3 mb-6 list-decimal list-inside text-muted-foreground">
                <li>Upload your HEIC files using the converter above</li>
                <li>Select JPG/JPEG as the output format</li>
                <li>Click Convert and wait a few seconds</li>
                <li>Download your converted JPG images</li>
              </ol>

              <p className="text-muted-foreground mb-6">
                Our converter preserves image quality while producing smaller file sizes. 
                For a detailed comparison of formats, check our <Link href="/guides/heic-vs-jpg-comparison" className="text-primary hover:underline">HEIC vs JPG comparison guide</Link>.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Batch Conversion Support</h2>
              <p className="text-muted-foreground mb-6">
                Need to convert multiple photos? Upload several HEIC files at once and convert them all 
                in a single batch. Download individually or get all files as a ZIP archive.
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
            <h3 className="font-semibold mb-2">Will converting HEIC to JPG reduce quality?</h3>
            <p className="text-muted-foreground">There's a small amount of compression, but it's typically not noticeable for everyday use.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Can I convert HEIC to JPG on my iPhone?</h3>
            <p className="text-muted-foreground">Yes! This converter works in Safari and other mobile browsers. Upload directly from your Photos app.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Is HEIC better than JPG?</h3>
            <p className="text-muted-foreground">HEIC offers better compression and quality, but JPG has universal compatibility. Choose based on your needs.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">How many files can I convert at once?</h3>
            <p className="text-muted-foreground">You can upload and convert multiple files in a single batch. There's no strict limit.</p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Related Guides</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/guides/how-to-convert-heic-to-jpg" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How to Convert HEIC to JPG</h3>
                <p className="text-sm text-muted-foreground">Step-by-step guide with multiple methods.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/heic-vs-jpg-comparison" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">HEIC vs JPG Comparison</h3>
                <p className="text-sm text-muted-foreground">Which format should you use?</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/what-is-heic-file-complete-guide" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What is HEIC?</h3>
                <p className="text-sm text-muted-foreground">Complete guide to Apple's image format.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
