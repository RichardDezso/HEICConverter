import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for HEIC Converter Online. Learn how we handle your data and protect your privacy.',
  alternates: {
    canonical: 'https://heicconverteronline.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          for HEIC Converter Online · Last Updated: December 2025
        </p>

        {/* Key Points */}
        <Card className="shadow-lg mb-8 border-primary/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🔑 Key Points at a Glance
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl">🗑️</div>
                <div>
                  <h4 className="font-semibold">Files Deleted Immediately</h4>
                  <p className="text-sm text-muted-foreground">Your uploaded files are automatically deleted right after conversion.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="font-semibold">No Personal Data Required</h4>
                  <p className="text-sm text-muted-foreground">Use our converter without registration or sharing personal info.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl">📊</div>
                <div>
                  <h4 className="font-semibold">Anonymous Analytics Only</h4>
                  <p className="text-sm text-muted-foreground">We use Google Analytics for anonymous usage statistics.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl">🇪🇺</div>
                <div>
                  <h4 className="font-semibold">GDPR Compliant</h4>
                  <p className="text-sm text-muted-foreground">EU users have full rights to access, correct, and delete data.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardContent className="pt-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-6">
              This Privacy Policy explains how HEIC Converter Online ("Service", "we", "us", or "our") collects, uses, and protects information when you use our HEIC image conversion tool at heicconverteronline.com.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">2.1 HEIC Files and Converted Images</h3>
            <p className="text-muted-foreground mb-4">When you use the Service to convert HEIC images:</p>
            <ul className="space-y-2 mb-6 text-muted-foreground">
              <li>• Your uploaded files are processed on our secure servers</li>
              <li>• Files are automatically deleted immediately after conversion</li>
              <li>• We do not store, share, or access your files for any secondary purpose</li>
              <li>• We do not claim ownership of any files you upload</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Contact Information</h3>
            <p className="text-muted-foreground mb-6">
              If you contact us through our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>, we collect your name, email, and message to respond to your inquiry.
            </p>

            <h2 className="text-2xl font-semibold mb-4">3. Cookies</h2>
            <p className="text-muted-foreground mb-6">
              We use cookies for analytics (Google Analytics) and to remember your preferences. You can control cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground mb-6">
              We use HTTPS encryption, secure server infrastructure, and automatic file deletion to protect your data. However, no method of internet transmission is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold mb-4">5. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground mb-4">If you're in the EU, you have the right to:</p>
            <ul className="space-y-2 mb-6 text-muted-foreground">
              <li>• Access your personal data</li>
              <li>• Correct inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Object to data processing</li>
              <li>• Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              Questions about this policy? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.
            </p>

            <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>© 2025 HEIC Converter Online. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
