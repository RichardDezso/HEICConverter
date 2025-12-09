import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import keywordPages from '@/data/keywordPages.json';
import { BatchConvertPage } from '@/components/pages/BatchConvertPage';
import { QualityGuidePage } from '@/components/pages/QualityGuidePage';
import { BusinessPage } from '@/components/pages/BusinessPage';
import { ComparisonPage } from '@/components/pages/ComparisonPage';
import { TroubleshootingPage } from '@/components/pages/TroubleshootingPage';

export const KeywordPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Check if this is one of our converter guide pages
  const converterPages = {
    'batch-convert-heic-to-pdf': BatchConvertPage,
    'heic-pdf-quality-guide': QualityGuidePage,
    'heic-pdf-business': BusinessPage,
    'heic-vs-jpeg-pdf': ComparisonPage,
    'heic-pdf-troubleshooting': TroubleshootingPage
  };
  
  // If slug matches a converter guide page, render that component
  if (converterPages[slug]) {
    const ConverterPage = converterPages[slug];
    return <ConverterPage />;
  }
  
  const page = keywordPages.find(p => p.slug === slug);

  useEffect(() => {
    if (page) {
      document.title = page.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', page.metaDescription);
      }
    }
  }, [page]);

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = (item, index) => {
    switch (item.type) {
      case 'paragraph':
        return <p key={index} className="text-muted-foreground mb-6 leading-relaxed">{item.text}</p>;
      case 'heading':
        return <h2 key={index} className="text-2xl font-semibold mb-4 mt-8">{item.text}</h2>;
      case 'list':
        return (
          <ul key={index} className="space-y-3 mb-6">
            {item.items.map((listItem, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{listItem}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Converter
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article>
          <h1 className="text-5xl font-bold mb-4">{page.heading}</h1>
          <p className="text-xl text-muted-foreground mb-12">{page.description}</p>

          <Card className="shadow-lg">
            <CardContent className="pt-8">
              {page.content.map((item, index) => renderContent(item, index))}
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-semibold mb-4">Ready to Convert Your Files?</h3>
                <p className="text-muted-foreground mb-6">
                  Use our free online converter to transform your HEIC files instantly
                </p>
                <Button size="lg" onClick={() => navigate('/')}>Start Converting Now</Button>
              </CardContent>
            </Card>
          </div>
        </article>
      </div>
    </div>
  );
};