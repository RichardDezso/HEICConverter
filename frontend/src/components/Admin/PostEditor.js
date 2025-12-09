import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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
    metaDescription: '',
    focusKeyword: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seoScore, setSeoScore] = useState(0);
  
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // SEO Analysis
  useEffect(() => {
    if (formData.title || formData.excerpt || quillRef.current) {
      calculateSeoScore();
    }
  }, [formData.title, formData.excerpt, formData.focusKeyword, formData.metaDescription]);

  const calculateSeoScore = () => {
    let score = 0;
    const content = quillRef.current ? quillRef.current.getText() : '';
    const focusKeyword = formData.focusKeyword.toLowerCase();
    
    // Title checks (30 points)
    if (formData.title.length >= 40 && formData.title.length <= 60) score += 10;
    if (focusKeyword && formData.title.toLowerCase().includes(focusKeyword)) score += 20;
    
    // Meta description (20 points)
    if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) score += 10;
    if (focusKeyword && formData.metaDescription.toLowerCase().includes(focusKeyword)) score += 10;
    
    // Excerpt (10 points)
    if (formData.excerpt.length >= 100 && formData.excerpt.length <= 160) score += 10;
    
    // Content checks (25 points)
    if (content.length >= 300) score += 10; // Minimum content length
    if (focusKeyword && content.toLowerCase().includes(focusKeyword)) score += 15;
    
    // Image (10 points)
    if (formData.image) score += 5;
    if (formData.imageAlt) score += 5;
    
    // URL slug (5 points)
    if (formData.id && formData.id.length <= 50) score += 5;
    
    setSeoScore(score);
  };

  const getSeoColor = () => {
    if (seoScore >= 80) return 'text-green-600';
    if (seoScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeoRecommendations = () => {
    const recommendations = [];
    const content = quillRef.current ? quillRef.current.getText() : '';
    const focusKeyword = formData.focusKeyword.toLowerCase();
    
    if (!formData.focusKeyword) {
      recommendations.push('⚠️ Add a focus keyword for better targeting');
    }
    
    if (formData.title.length < 40) {
      recommendations.push('⚠️ Title is too short (aim for 40-60 characters)');
    } else if (formData.title.length > 60) {
      recommendations.push('⚠️ Title is too long (aim for 40-60 characters)');
    }
    
    if (!formData.metaDescription) {
      recommendations.push('⚠️ Add a meta description (120-160 characters)');
    } else if (formData.metaDescription.length < 120) {
      recommendations.push('⚠️ Meta description is too short');
    } else if (formData.metaDescription.length > 160) {
      recommendations.push('⚠️ Meta description is too long (will be cut off in search results)');
    }
    
    if (focusKeyword && !formData.title.toLowerCase().includes(focusKeyword)) {
      recommendations.push('⚠️ Include focus keyword in title');
    }
    
    if (focusKeyword && formData.metaDescription && !formData.metaDescription.toLowerCase().includes(focusKeyword)) {
      recommendations.push('⚠️ Include focus keyword in meta description');
    }
    
    if (content.length < 300) {
      recommendations.push('⚠️ Content is too short (aim for 300+ words)');
    }
    
    if (!formData.image) {
      recommendations.push('⚠️ Add a featured image');
    }
    
    if (formData.image && !formData.imageAlt) {
      recommendations.push('⚠️ Add alt text to your image for accessibility and SEO');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ Great! Your post is well-optimized for SEO');
    }
    
    return recommendations;
  };

  const getAuthHeader = () => {
    const credentials = sessionStorage.getItem('adminAuth');
    if (!credentials) {
      navigate('/admin');
      return null;
    }
    return { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' };
  };

  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ];

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog post content here...',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler
            }
          }
        }
      });

      // Set initial content
      quillRef.current.root.innerHTML = '<p>Start writing your blog post here...</p>';
    }
  }, []);

  // Load post data for editing
  useEffect(() => {
    if (isEdit && quillRef.current) {
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
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          image: post.image || '',
          imageAlt: post.imageAlt || '',
          keywords: post.keywords || ''
        });

        // Set editor content
        if (quillRef.current) {
          quillRef.current.root.innerHTML = contentHtml;
        }
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

  // Handler for featured image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large! Maximum size is 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      const headers = getAuthHeader();
      if (!headers) return;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/api/admin/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': headers.Authorization
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handler for inserting images into Quill editor
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large! Maximum size is 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Uploading image...');

      try {
        const headers = getAuthHeader();
        if (!headers) return;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BACKEND_URL}/api/admin/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': headers.Authorization
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          
          // Insert image into editor at cursor position
          const range = quillRef.current.getSelection();
          quillRef.current.insertEmbed(range.index, 'image', data.url);
          
          // Move cursor after image
          quillRef.current.setSelection(range.index + 1);
          
          toast.dismiss(loadingToast);
          toast.success('Image inserted!');
        } else {
          toast.dismiss(loadingToast);
          toast.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.dismiss(loadingToast);
        toast.error('Failed to upload image');
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = getAuthHeader();
      if (!headers) return;

      // Get HTML content from Quill
      const htmlContent = quillRef.current.root.innerHTML;

      const postData = {
        id: formData.id,
        title: formData.title,
        excerpt: formData.excerpt,
        date: formData.date,
        image: formData.image || undefined,
        imageAlt: formData.imageAlt || undefined,
        keywords: formData.keywords || undefined,
        content: htmlContent,
        contentType: 'html'
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
                <label className="text-sm font-medium mb-2 block">Featured Image (optional)</label>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Image preview or upload button */}
                {formData.image ? (
                  <div className="space-y-2">
                    <div className="relative border rounded-md p-2 flex items-center gap-3">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate">{formData.image}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Or paste a URL:
                    </p>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Or paste image URL:
                    </p>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Max file size: 5MB • Formats: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Image Alt Text (optional)</label>
                <Input
                  value={formData.imageAlt}
                  onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              {/* SEO Section */}
              <Card className="mt-6 bg-blue-50/50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>🎯 SEO Optimization</span>
                    <span className={`text-2xl font-bold ${getSeoColor()}`}>
                      {seoScore}/100
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Focus Keyword <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.focusKeyword}
                      onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                      placeholder="e.g., heic to jpg converter"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Main keyword you want to rank for in Google
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Meta Description <span className="text-red-500">*</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({formData.metaDescription.length}/160)
                      </span>
                    </label>
                    <Textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      rows={2}
                      placeholder="Brief description that appears in Google search results (120-160 characters)"
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This appears in Google search results. Include your focus keyword!
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Additional Keywords</label>
                    <Input
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Related keywords (comma-separated)
                    </p>
                  </div>

                  {/* SEO Recommendations */}
                  <div className="mt-4 p-4 bg-white rounded-md border">
                    <h4 className="font-semibold mb-2">📊 SEO Checklist:</h4>
                    <ul className="space-y-1 text-sm">
                      {getSeoRecommendations().map((rec, index) => (
                        <li key={index} className="text-muted-foreground">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">Content</label>
                <div className="border rounded-md overflow-hidden bg-white" style={{ minHeight: '400px' }}>
                  <div ref={editorRef} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Toolbar Guide:</strong> Use the formatting buttons above the editor. Select text to format it.
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
