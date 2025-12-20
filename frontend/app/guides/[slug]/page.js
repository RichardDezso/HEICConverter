import { getGuides, getGuideBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import '@/app/guides/[slug]/guide.css';
import fallbackGuides from '@/data/guides-fallback.json';

// Generate static params for all guides - use fallback data for build safety
export async function generateStaticParams() {
  try {
    const guides = await getGuides();
    return guides.map((guide) => ({
      slug: guide.id,
    }));
  } catch (error) {
    // Use fallback data if DB is unavailable during build
    console.log('Using fallback data for generateStaticParams');
    return fallbackGuides.map((guide) => ({
      slug: guide.id,
    }));
  }
}

// Allow dynamic params for guides not in fallback data
export const dynamicParams = true;

// Generate metadata for each guide
export async function generateMetadata({ params }) {
  const guide = await getGuideBySlug(params.slug);
  
  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  return {
    title: guide.title,
    description: guide.metaDescription || guide.excerpt,
    keywords: guide.keywords,
    alternates: {
      canonical: `https://heicconverteronline.com/guides/${guide.id}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.metaDescription || guide.excerpt,
      url: `https://heicconverteronline.com/guides/${guide.id}`,
      type: 'article',
      images: guide.image ? [{ url: guide.image }] : [],
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

// Helper to render HTML content safely
function renderTextWithLinks(text) {
  if (!text) return null;
  
  // If text contains HTML tags, render as HTML
  if (/<[^>]+>/.test(text)) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }
  
  return text;
}

// Render content based on type
function renderContent(item, index) {
  switch (item.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-muted-foreground mb-6 leading-relaxed">
          {renderTextWithLinks(item.text)}
        </p>
      );
    case 'heading':
      return (
        <h2 key={index} className="text-2xl font-semibold mb-4 mt-8 text-foreground">
          {item.text}
        </h2>
      );
    case 'list':
      return (
        <ul key={index} className="space-y-3 mb-6">
          {item.items.map((listItem, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{renderTextWithLinks(listItem)}</span>
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div key={index} className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                {item.headers?.map((header, i) => (
                  <th key={i} className="border border-border px-4 py-3 text-left font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.rows?.map((row, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/50">
                  {row.map((cell, j) => (
                    <td key={j} className="border border-border px-4 py-3 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'faq':
      return (
        <div key={index} className="mb-6 p-5 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">{item.question}</h3>
          <p className="text-muted-foreground leading-relaxed">{renderTextWithLinks(item.answer)}</p>
        </div>
      );
    default:
      return null;
  }
}

export default async function GuidePage({ params }) {
  const guide = await getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const content = Array.isArray(guide.content) ? guide.content : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/guides">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Guides
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{guide.title}</h1>
          
          {/* Excerpt */}
          {guide.excerpt && (
            <p className="text-xl text-muted-foreground mb-8">{guide.excerpt}</p>
          )}

          {/* Featured Image */}
          {guide.image && (
            <figure className="mb-8">
              <div className="rounded-lg overflow-hidden bg-muted/30">
                <img
                  src={guide.image}
                  alt={guide.imageAlt || guide.title}
                  className="w-full max-h-[500px] object-contain"
                />
              </div>
              {guide.imageCaption && (
                <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                  {guide.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Main Content */}
          <Card className="shadow-lg">
            <CardContent className="pt-8 guide-content">
              {content.map((item, index) => renderContent(item, index))}
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">Ready to Convert Your Files?</h3>
              <p className="text-muted-foreground mb-6">
                Use our free online converter to transform your HEIC files instantly.
              </p>
              <Link href="/">
                <Button size="lg">Start Converting Now</Button>
              </Link>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
