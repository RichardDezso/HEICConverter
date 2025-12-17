import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { DisplayAd } from '@/components/AdUnit';
import './BlogPost.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      // Add cache busting parameter
      const timestamp = new Date().getTime();
      const response = await fetch(`${BACKEND_URL}/api/guides/posts/${id}?v=${timestamp}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post && !loading) {
      // Set page title (include focus keyword if available)
      const titleSuffix = post.focusKeyword ? ` | ${post.focusKeyword}` : '';
      document.title = `${post.title}${titleSuffix} - HEIC Converter`;
      
      // Set meta description (use custom meta description if available, fallback to excerpt)
      const description = post.metaDescription || post.excerpt;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
      
      // Set meta keywords if available
      if (post.keywords || post.focusKeyword) {
        const keywords = [post.focusKeyword, post.keywords].filter(Boolean).join(', ');
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', keywords);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'keywords';
          meta.content = keywords;
          document.head.appendChild(meta);
        }
      }
    }
  }, [post, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderTextWithLinks = (text) => {
    // Check if text contains HTML tags - if so, render as HTML
    if (/<[^>]+>/.test(text)) {
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    }
    
    // Pattern to match [link text](url) format (markdown style)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the link - internal links don't need target blank
      const isInternal = match[2].startsWith('/');
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          className="text-primary hover:underline font-medium"
          {...(!isInternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (item, index) => {
    switch (item.type) {
      case 'paragraph':
        return <p key={index} className="text-muted-foreground mb-6 leading-relaxed text-lg">{renderTextWithLinks(item.text)}</p>;
      case 'heading':
        return <h2 key={index} className="text-3xl font-semibold mb-4 mt-8">{item.text}</h2>;
      case 'list':
        return (
          <ul key={index} className="space-y-3 mb-6">
            {item.items.map((listItem, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-lg">{renderTextWithLinks(listItem)}</span>
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
                  {item.headers.map((header, i) => (
                    <th key={i} className="border border-border px-4 py-3 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row, i) => (
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
      default:
        return null;
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/guides')}
          className="gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Guides
        </Button>

        <article>
          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-muted/30">
              <img 
                src={post.image} 
                alt={post.imageAlt || post.title}
                className="w-full max-h-[500px] object-contain"
              />
            </div>
          )}

          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          </div>

          {/* Ad Placement - Guide Content Top */}
          <div className="my-8">
            <DisplayAd slot="5872210483" />
          </div>

          {/* Post Content */}
          <Card className="shadow-lg">
            <CardContent className="pt-8">
              {typeof post.content === 'string' ? (
                // New format: HTML content with enhanced styling
                <div 
                  className="blog-content"
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.75rem',
                    color: 'hsl(var(--muted-foreground))'
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                // Old format: JSON array
                post.content.map((item, index) => renderContent(item, index))
              )}
            </CardContent>
          </Card>

          {/* Ad Placement - Guide Content Bottom */}
          <div className="my-8">
            <DisplayAd slot="1585481113" />
          </div>

          {/* CTA Section */}
          <div className="mt-12">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Need to Convert HEIC Files?</h3>
                <p className="text-muted-foreground mb-6">
                  Try our free online converter to transform your HEIC files instantly
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
