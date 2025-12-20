import { ConverterTool } from '@/components/ConverterTool';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'HEIC to PDF Converter – Convert HEIC Files to PDF Online Free',
  description: 'Convert HEIC to PDF online for free. Upload HEIC photos, change them to PDF in seconds, and download ready-to-share documents that open on any device.',
  keywords: ['HEIC to PDF', 'HEIC to PDF converter', 'convert HEIC to PDF', 'iPhone photos to PDF'],
  alternates: {
    canonical: 'https://www.heicconverteronline.com/heic-to-pdf',
  },
  openGraph: {
    title: 'HEIC to PDF Converter – Convert HEIC Files to PDF Online Free',
    description: 'Convert HEIC to PDF online for free. Upload HEIC photos and download PDFs instantly.',
    url: 'https://www.heicconverteronline.com/heic-to-pdf',
    type: 'website',
  },
};

export default function HeicToPdfPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">HEIC to PDF Converter</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert your iPhone photos from HEIC to PDF format quickly and easily. 
            Create shareable documents that open on any device.
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
              <h2 className="text-2xl font-semibold mb-4">Why Convert HEIC to PDF?</h2>
              <p className="text-muted-foreground mb-6">
                HEIC (High Efficiency Image Container) is the format newer iPhones and iPads use for photos. 
                It's efficient and high quality, but not every device or app supports it. PDF, on the other hand, 
                opens almost everywhere: Windows, macOS, iOS, Android, browsers, email clients, and document tools.
              </p>

              <h3 className="text-xl font-semibold mb-3">Converting HEIC to PDF is useful when you:</h3>
              <ul className="space-y-2 mb-6">
                {[
                  'Need a photo embedded in a report or document',
                  'Want consistent printing results',
                  'Share images with people who can\'t open HEIC',
                  'Need a format that keeps layout and page size predictable',
                  'Submit documents to businesses or institutions'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mb-4">How to Convert HEIC to PDF Online</h2>
              <ol className="space-y-3 mb-6 list-decimal list-inside text-muted-foreground">
                <li>Upload your HEIC files using the converter above</li>
                <li>Select PDF as the output format</li>
                <li>Click Convert and wait a few seconds</li>
                <li>Download your converted PDF files</li>
              </ol>

              <p className="text-muted-foreground mb-6">
                The converter preserves original image resolution and color accuracy, so your PDFs look just like the source images. 
                For more details on maintaining quality, see our <Link href="/guides/heic-to-pdf-quality-guide" className="text-primary hover:underline">HEIC to PDF quality guide</Link>.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Convert Multiple HEIC Files to PDF</h2>
              <p className="text-muted-foreground mb-6">
                You can convert several HEIC files at once. Each image can be saved as its own PDF, 
                or combined into a single multi-page document. This works well for photo albums, receipts, invoices, 
                and documentation captured on an iPhone.
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
            <h3 className="font-semibold mb-2">How do I turn a HEIC into a PDF?</h3>
            <p className="text-muted-foreground">Use our HEIC to PDF converter: upload the file, choose PDF as the output, convert, and download. The process usually takes just a few seconds.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Can I convert HEIC to PDF on my iPhone?</h3>
            <p className="text-muted-foreground">Yes! This converter works on iPhone and iPad using Safari or any mobile browser. Upload photos directly from your Photos app.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Will converting HEIC to PDF reduce quality?</h3>
            <p className="text-muted-foreground">No visible quality loss occurs when conversion is done properly. The PDF embeds your image at full resolution.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Is this HEIC to PDF converter free?</h3>
            <p className="text-muted-foreground">Yes! All conversions are completely free with no signup required.</p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Related Guides</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/guides/heic-to-pdf-converter" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Complete HEIC to PDF Guide</h3>
                <p className="text-sm text-muted-foreground">In-depth guide to converting HEIC to PDF.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/heic-to-pdf-quality-guide" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">HEIC to PDF Quality Guide</h3>
                <p className="text-sm text-muted-foreground">Maintain image resolution during conversion.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/heic-to-pdf-troubleshooting" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Troubleshooting Guide</h3>
                <p className="text-sm text-muted-foreground">Fix common conversion problems.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
