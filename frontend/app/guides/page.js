import { getGuides } from '@/lib/db';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'HEIC Conversion Guides & Tutorials',
  description: 'Learn everything about HEIC conversion. Guides on converting HEIC to JPG, PNG, PDF, troubleshooting tips, and best practices.',
  alternates: {
    canonical: 'https://heicconverteronline.com/guides',
  },
};

// Revalidate every hour
export const revalidate = 3600;

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">HEIC Conversion Guides</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn everything you need to know about converting HEIC files. From basic tutorials to advanced tips.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.id}`} className="block group">
              <Card className="h-full hover:shadow-lg transition-shadow">
                {guide.image && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={guide.image}
                      alt={guide.imageAlt || guide.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {guide.title}
                  </CardTitle>
                  {guide.excerpt && (
                    <CardDescription className="line-clamp-2">
                      {guide.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <span className="text-primary text-sm font-medium flex items-center gap-1">
                    Read more <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
