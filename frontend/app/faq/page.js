import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about HEIC conversion, file formats, and how to use our free online converter.',
  alternates: {
    canonical: 'https://www.heicconverteronline.com/faq',
  },
};

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is a HEIC file?',
        a: 'HEIC (High Efficiency Image Container) is the default image format used by Apple devices since iOS 11. It offers better compression than JPG while maintaining high image quality.',
      },
      {
        q: 'Why convert HEIC to other formats?',
        a: 'While HEIC is efficient, not all devices and applications support it. Converting to JPG, PNG, or PDF ensures your images can be opened and shared anywhere.',
      },
      {
        q: 'Is this converter free?',
        a: 'Yes! All conversions are completely free with no limits or hidden fees.',
      },
    ],
  },
  {
    category: 'Conversion',
    questions: [
      {
        q: 'How do I convert HEIC to JPG?',
        a: 'Upload your HEIC file to our converter, select JPG as the output format, click convert, and download your image.',
      },
      {
        q: 'Can I convert multiple files at once?',
        a: 'Yes! You can upload and convert multiple HEIC files in a single batch.',
      },
      {
        q: 'Will converting reduce image quality?',
        a: 'For JPG, there is slight compression but it\'s typically unnoticeable. PNG conversion is lossless. PDF embeds images at full resolution.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    questions: [
      {
        q: 'Are my files safe?',
        a: 'Yes. Files are processed securely and deleted immediately after conversion. We never store or share your images.',
      },
      {
        q: 'Do you store my photos?',
        a: 'No. All uploaded files are automatically deleted after conversion.',
      },
    ],
  },
  {
    category: 'Device Support',
    questions: [
      {
        q: 'Can I use this on my iPhone?',
        a: 'Yes! Our converter works in Safari and other mobile browsers. Upload directly from your Photos app.',
      },
      {
        q: 'Does it work on Windows?',
        a: 'Yes. The converter works on any device with a modern web browser.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-center text-muted-foreground mb-12">
          Find answers to common questions about HEIC conversion.
        </p>

        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-2xl font-semibold mb-4">{section.category}</h2>
              <div className="space-y-4">
                {section.questions.map((faq, faqIndex) => (
                  <Card key={faqIndex}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              We're here to help. Reach out through our contact page.
            </p>
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact Us →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
