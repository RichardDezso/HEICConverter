import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    if (post) {
      // Set page title
      document.title = `${post.title} - HEIC Converter Blog`;
      
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.excerpt;
        document.head.appendChild(meta);
      }
      
      // Set meta keywords if available
      if (post.keywords) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', post.keywords);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'keywords';
          meta.content = post.keywords;
          document.head.appendChild(meta);
        }
      }
    }
  }, [post]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderTextWithLinks = (text) => {
    // Pattern to match [link text](url) format
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          className="text-primary hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
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
          onClick={() => navigate('/blog')}
          className="gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
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
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          </div>

          {/* Post Content */}
          <Card className="shadow-lg">
            <CardContent className="pt-8">
              {post.content.map((item, index) => renderContent(item, index))}
            </CardContent>
          </Card>

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