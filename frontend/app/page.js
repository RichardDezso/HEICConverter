import { ConverterTool } from '@/components/ConverterTool';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, Briefcase, GraduationCap, Smartphone } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'HEIC Converter Online - Convert HEIC to JPG, PNG, PDF Free',
  description: 'Free online HEIC converter. Convert HEIC files to JPG, PNG, or PDF format instantly. Batch conversion supported. Works on any device.',
  alternates: {
    canonical: 'https://www.heicconverteronline.com',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">HEIC Converter Online</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert HEIC images to JPG, PNG, or PDF instantly. Free, fast, and works on any device.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ConverterTool />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our HEIC Converter?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <CheckCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">100% Free</h3>
              <p className="text-sm text-muted-foreground">No hidden fees, no subscriptions. Convert unlimited files for free.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Smartphone className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Works Everywhere</h3>
              <p className="text-sm text-muted-foreground">Use on Windows, Mac, iPhone, Android, or any device with a browser.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <CheckCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">Files are deleted immediately after conversion. We never store your photos.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Who Uses Section */}
      <section className="container mx-auto px-4 py-12 bg-muted/30">
        <h2 className="text-2xl font-bold text-center mb-8">Who Uses Our Tool?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">iPhone Users</h3>
            <p className="text-sm text-muted-foreground">Convert photos for sharing</p>
          </div>
          <div className="text-center">
            <Briefcase className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Professionals</h3>
            <p className="text-sm text-muted-foreground">Create documents and reports</p>
          </div>
          <div className="text-center">
            <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Students</h3>
            <p className="text-sm text-muted-foreground">Submit assignments easily</p>
          </div>
          <div className="text-center">
            <Smartphone className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Everyone</h3>
            <p className="text-sm text-muted-foreground">Simple, fast conversion</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="font-semibold mb-2">What is a HEIC file?</h3>
            <p className="text-muted-foreground">HEIC is the default image format used by modern iPhones. It saves space while keeping image quality high.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How do I convert HEIC to JPG?</h3>
            <p className="text-muted-foreground">Upload your HEIC files to our converter, select JPG as the output format, and download your converted images instantly.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is this converter free?</h3>
            <p className="text-muted-foreground">Yes! All conversions are completely free with no limits.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Are my files safe?</h3>
            <p className="text-muted-foreground">Yes. Files are processed securely and deleted immediately after conversion. We never store your photos.</p>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="container mx-auto px-4 py-12 bg-muted/30">
        <h2 className="text-2xl font-bold text-center mb-8">Learn More</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/guides/heic-vs-jpg-comparison" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">HEIC vs JPG: Which Format?</h3>
                <p className="text-sm text-muted-foreground">Compare formats and choose the right one for your needs.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/how-to-convert-heic-to-jpg" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How to Convert HEIC to JPG</h3>
                <p className="text-sm text-muted-foreground">Step-by-step guide with multiple methods.</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/guides/what-is-heic-file-complete-guide" className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What is a HEIC File?</h3>
                <p className="text-sm text-muted-foreground">Complete guide to Apple's image format.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
