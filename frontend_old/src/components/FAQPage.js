import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: "About HEIC Format",
    questions: [
      {
        q: "What is a HEIC file?",
        a: "HEIC (High Efficiency Image Container) is a modern image format developed by Apple. It uses advanced compression to create smaller files while maintaining excellent image quality. Since iOS 11 (2017), iPhones save photos in HEIC format by default."
      },
      {
        q: "What is the difference between HEIC and HEIF?",
        a: "HEIF (High Efficiency Image Format) is the broader format standard, while HEIC specifically refers to HEIF files that use HEVC compression. In practice, the terms are often used interchangeably. Files may have .heic or .heif extensions."
      },
      {
        q: "Why does my iPhone save photos as HEIC?",
        a: "Apple chose HEIC because it saves significant storage space—HEIC files are about 50% smaller than equivalent JPG files while maintaining the same visual quality. This helps you store more photos on your device and in iCloud."
      },
      {
        q: "Why can't Windows open my HEIC files?",
        a: "Windows doesn't natively support HEIC format. Microsoft requires users to install the 'HEIF Image Extensions' from the Microsoft Store (which may require a small fee for the HEVC codec). The easiest solution is to convert HEIC to JPG or PNG using our free converter."
      }
    ]
  },
  {
    category: "Using Our Converter",
    questions: [
      {
        q: "How do I convert HEIC to JPG, PNG, or PDF?",
        a: "It's simple: 1) Go to our homepage, 2) Drag and drop your HEIC files or click to browse, 3) Select your desired output format (JPG, PNG, or PDF), 4) Click Convert, 5) Download your converted files. The whole process takes just seconds."
      },
      {
        q: "Is this HEIC converter completely free?",
        a: "Yes, 100% free. There are no hidden fees, no premium tiers, and no limits on how many files you can convert. We don't require sign-ups or accounts either."
      },
      {
        q: "Can I convert multiple HEIC files at once?",
        a: "Yes! Our batch conversion feature lets you select and convert multiple files simultaneously. Users regularly convert 50+ photos at once. For very large files (like 48MP ProRAW), we recommend batches of 20-30 files for best performance."
      },
      {
        q: "What's the maximum file size I can upload?",
        a: "We support files up to 50MB each, which covers even the highest resolution photos from iPhone Pro models. Most standard iPhone photos are 2-5MB, so you'll rarely encounter this limit."
      },
      {
        q: "How long does conversion take?",
        a: "Most single-file conversions complete in 2-5 seconds. Batch conversions depend on the number and size of files, but typically finish within 30-60 seconds for 20-30 photos. Your internet connection speed also affects upload/download times."
      },
      {
        q: "Can I use this converter on my phone?",
        a: "Absolutely! Our converter works in any modern mobile browser. On iPhone, open Safari and visit our site. On Android, use Chrome or any browser. You can upload photos directly from your gallery and download converted files to your device."
      }
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        q: "Is my data safe when using this converter?",
        a: "Yes. Your files are uploaded over a secure HTTPS connection, processed on our servers, and automatically deleted immediately after conversion. We never store, view, share, or sell your photos. Your privacy is our priority."
      },
      {
        q: "Do you keep copies of my photos?",
        a: "No. All uploaded files and converted outputs are automatically deleted from our servers immediately after you download them. We have no access to your photos and maintain no backups of user files."
      },
      {
        q: "Can I use this for sensitive or private photos?",
        a: "Yes. Since we don't store files and all transfers are encrypted, you can safely convert personal photos. However, for extremely sensitive documents, you may prefer offline conversion software for maximum security."
      }
    ]
  },
  {
    category: "Output Formats",
    questions: [
      {
        q: "Which format should I choose: JPG, PNG, or PDF?",
        a: "Choose JPG for: sharing on social media, email attachments, web uploads, and general use (smallest file size). Choose PNG for: images needing transparency, graphics, screenshots, or when you need lossless quality. Choose PDF for: documents, printing, archiving, or when you need to combine multiple images."
      },
      {
        q: "Will converting HEIC reduce my photo quality?",
        a: "It depends on the format. PNG conversion is lossless—no quality loss at all. JPG uses compression, so there's minimal quality reduction (usually unnoticeable). PDF preserves high quality suitable for printing. For most uses, you won't see any difference from the original."
      },
      {
        q: "Can I convert HEIC to other formats like GIF or TIFF?",
        a: "Currently, we support conversion to JPG, PNG, and PDF—the three most commonly needed formats. These cover 99% of use cases. We may add more formats in the future based on user demand."
      }
    ]
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        q: "Why won't my file upload?",
        a: "Make sure your file has a .heic or .heif extension. If it's named differently (like .jpg but is actually HEIC), rename it. Also check that the file isn't corrupted—try opening it on your iPhone first. If problems persist, try a different browser."
      },
      {
        q: "The conversion seems stuck. What should I do?",
        a: "Large files or slow internet connections can cause delays. Wait at least 60 seconds before assuming it's stuck. If it still doesn't complete, refresh the page and try again with fewer files. Make sure you have a stable internet connection."
      },
      {
        q: "My converted file looks different from the original. Why?",
        a: "Color differences can occur due to color profile handling between HEIC (which uses Display P3) and JPG (which typically uses sRGB). This is usually subtle. If you need exact color matching, try PNG format which better preserves color profiles."
      },
      {
        q: "Can I convert photos that were edited on iPhone?",
        a: "Yes! Edited photos, photos with filters, Live Photos (converted as still images), and Portrait mode photos all convert normally. The edits and adjustments you made will be preserved in the converted file."
      }
    ]
  },
  {
    category: "iPhone Settings",
    questions: [
      {
        q: "How do I stop my iPhone from taking HEIC photos?",
        a: "Go to Settings → Camera → Formats → Select 'Most Compatible' instead of 'High Efficiency'. This will make your iPhone save new photos as JPG. Note: This won't convert existing HEIC photos—use our converter for those."
      },
      {
        q: "Can I make iPhone automatically convert when sharing?",
        a: "Yes! Go to Settings → Photos → Transfer to Mac or PC → Select 'Automatic'. This makes iPhone convert HEIC to JPG automatically when you share via AirDrop or transfer to a computer. However, this doesn't help when uploading to websites."
      },
      {
        q: "Should I switch my iPhone to always use JPG?",
        a: "Only if you frequently share with Windows/Android users. HEIC saves about 50% storage space with equal quality. We recommend keeping HEIC enabled and converting only when needed—it's the best of both worlds."
      }
    ]
  },
  {
    category: "Compatibility",
    questions: [
      {
        q: "Does this work on Windows?",
        a: "Yes! Our web-based converter works on any Windows PC with a modern browser (Chrome, Firefox, Edge). No software installation required."
      },
      {
        q: "Does this work on Mac?",
        a: "Yes! While Macs can open HEIC natively, our converter is useful when you need JPG or PNG for websites, email, or sharing with Windows users."
      },
      {
        q: "Does this work on Android?",
        a: "Yes! Open our website in Chrome or any mobile browser on your Android device. You can upload HEIC files received from iPhone users and convert them."
      },
      {
        q: "Does this work on Chromebook?",
        a: "Yes! Chromebooks work great with our converter since it's entirely web-based. Just open Chrome and visit our site."
      }
    ]
  }
];

export const FAQPage = () => {
  useEffect(() => {
    document.title = 'FAQ - HEIC Converter Online';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Frequently asked questions about HEIC files and our free online HEIC to JPG, PNG, and PDF converter. Learn about file formats, privacy, and troubleshooting.');
    }
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about HEIC files and our free converter
          </p>
        </div>

        {/* Quick Links */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-lg">Jump to a topic:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {faqs.map((category, idx) => (
                <a
                  key={idx}
                  href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  {category.category}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        {faqs.map((category, categoryIdx) => (
          <div key={categoryIdx} className="mb-12" id={category.category.toLowerCase().replace(/\s+/g, '-')}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ChevronDown className="w-6 h-6 text-primary" />
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, faqIdx) => (
                <Card key={faqIdx}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20 mt-12">
          <CardContent className="pt-8 pb-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Feel free to reach out to us.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/">
                <Button size="lg">Try the Converter</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
