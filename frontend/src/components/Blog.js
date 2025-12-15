import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { DisplayAd } from '@/components/AdUnit';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const BlogListPage = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Guides - HEIC Converter';
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Add cache busting parameter
      const timestamp = new Date().getTime();
      const response = await fetch(`${BACKEND_URL}/api/guides/posts?v=${timestamp}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Fetched ${data.length} blog posts from API`);
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  console.log(`Rendering ${sortedPosts.length} sorted blog posts`);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p>Loading...</p>
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

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">HEIC Conversion Guides</h1>
          <p className="text-xl text-muted-foreground">
            Expert guides and tutorials for converting HEIC files to PDF, JPG, and PNG
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
          {sortedPosts.map((post) => (
            <Card 
              key={post.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/guides/${post.id}`)}
            >
              <div className="md:flex">
                {post.image && (
                  <div className="md:w-80 md:flex-shrink-0 bg-muted/30 flex items-center justify-center">
                    <img 
                      src={post.image} 
                      alt={post.imageAlt || post.title}
                      className="w-full h-48 md:h-full object-contain p-4"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-2xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>
                    <Button variant="ghost" className="gap-2 p-0 h-auto">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}

          {sortedPosts.length === 0 && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No guides yet. Check back soon!</p>
              </CardContent>
            </Card>
          )}
          </div>

          {/* Sidebar with Ad */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <DisplayAd slot="6645417862" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
