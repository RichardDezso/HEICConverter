import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const credentials = sessionStorage.getItem('adminAuth');
    if (!credentials) {
      navigate('/admin');
      return null;
    }
    return { 'Authorization': `Basic ${credentials}` };
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const headers = getAuthHeader();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/posts`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const headers = getAuthHeader();
      if (!headers) return;

      const response = await fetch(`${BACKEND_URL}/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        fetchPosts();
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background\">
      <div className=\"container mx-auto px-4 py-8 max-w-6xl\">
        <div className=\"flex justify-between items-center mb-8\">
          <h1 className=\"text-4xl font-bold\">Blog Admin</h1>
          <div className=\"flex gap-3\">
            <Button onClick={() => navigate('/admin/post/new')}>
              <Plus className=\"w-4 h-4 mr-2\" />
              New Post
            </Button>
            <Button variant=\"outline\" onClick={handleLogout}>
              <LogOut className=\"w-4 h-4 mr-2\" />
              Logout
            </Button>
          </div>
        </div>

        <div className=\"space-y-4\">
          {posts.length === 0 ? (
            <Card>
              <CardContent className=\"pt-8 pb-8 text-center\">
                <p className=\"text-muted-foreground\">No blog posts yet. Create your first one!</p>
                <Button className=\"mt-4\" onClick={() => navigate('/admin/post/new')}>
                  <Plus className=\"w-4 h-4 mr-2\" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className=\"pt-6\">
                  <div className=\"flex items-start justify-between\">
                    <div className=\"flex-1\">
                      <h3 className=\"text-xl font-semibold mb-2\">{post.title}</h3>
                      <p className=\"text-sm text-muted-foreground mb-2\">{post.excerpt}</p>
                      <p className=\"text-xs text-muted-foreground\">
                        Date: {post.date} • ID: {post.id}
                      </p>
                    </div>
                    <div className=\"flex gap-2 ml-4\">
                      <Button
                        variant=\"outline\"
                        size=\"sm\"
                        onClick={() => navigate(`/admin/post/edit/${post.id}`)}
                      >
                        <Edit className=\"w-4 h-4\" />
                      </Button>
                      <Button
                        variant=\"outline\"
                        size=\"sm\"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className=\"w-4 h-4\" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
