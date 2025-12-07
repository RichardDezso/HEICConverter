import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    imageAlt: '',
    keywords: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const credentials = sessionStorage.getItem('adminAuth');
    if (!credentials) {
      navigate('/admin');
      return null;
    }
    return { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    if (isEdit) {
      fetchPost();
    }
  }, [isEdit, id]);

  const fetchPost = async () => {
    try {
      const headers = getAuthHeader();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/posts/${id}`, {
        headers: { 'Authorization': headers.Authorization }
      });

      if (response.ok) {
        const post = await response.json();
        
        // Handle both HTML content (new) and JSON content (old format)
        let contentHtml = '';
        if (typeof post.content === 'string') {
          // New format: HTML string
          contentHtml = post.content;
        } else if (Array.isArray(post.content)) {
          // Old format: JSON array - convert to HTML
          contentHtml = convertJsonToHtml(post.content);
        }
        
        setFormData({
          ...post,
          content: contentHtml
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
    }
  };

  // Convert old JSON format to HTML for editing
  const convertJsonToHtml = (jsonContent) => {
    let html = '';
    jsonContent.forEach(item => {
      switch (item.type) {
        case 'heading':
          html += `<h2>${item.text}</h2>`;
          break;
        case 'paragraph':
          html += `<p>${item.text}</p>`;
          break;
        case 'list':
          html += '<ul>';
          item.items.forEach(listItem => {
            html += `<li>${listItem}</li>`;
          });
          html += '</ul>';
          break;
        default:
          html += `<p>${item.text || ''}</p>`;
      }
    });
    return html;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = getAuthHeader();
      if (!headers) return;

      const postData = {
        id: formData.id,
        title: formData.title,
        excerpt: formData.excerpt,
        date: formData.date,
        image: formData.image || undefined,
        imageAlt: formData.imageAlt || undefined,
        keywords: formData.keywords || undefined,
        content: formData.content,
        contentType: 'html' // Mark as HTML content
      };

      const url = isEdit
        ? `${BACKEND_URL}/api/admin/posts/${id}`
        : `${BACKEND_URL}/api/admin/posts`;

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        toast.success(isEdit ? 'Post updated!' : 'Post created!');
        navigate('/admin/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  // Rich text editor modules (toolbar configuration)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Post' : 'Create New Post'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Post ID (URL slug)</label>
                <Input
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="my-blog-post-title"
                  required
                  disabled={isEdit}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Short description for blog list"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Image URL (optional)</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Image Alt Text (optional)</label>
                <Input
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Keywords (optional)</label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <div className="border rounded-md overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your blog post content here..."
                    style={{ minHeight: '300px' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use the toolbar to format text, add links, lists, and more
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Post'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
