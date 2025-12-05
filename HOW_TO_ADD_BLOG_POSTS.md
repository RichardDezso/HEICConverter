# How to Add Blog Posts

This guide shows you how to add new blog posts to your HEIC Converter blog.

## Adding a New Blog Post

Blog posts are managed through a simple JSON file. No coding required!

### Step 1: Open the Blog Posts File

Open `/app/frontend/src/data/blogPosts.json`

### Step 2: Add Your New Post

Add a new object to the array:

```json
{
  "id": "your-post-url-slug",
  "title": "Your Blog Post Title",
  "excerpt": "A short 1-2 sentence description that appears on the blog listing page",
  "date": "2024-12-05",
  "image": "https://your-image-url.com/image.jpg",
  "content": [
    {
      "type": "paragraph",
      "text": "Your first paragraph goes here..."
    },
    {
      "type": "heading",
      "text": "Section Heading"
    },
    {
      "type": "list",
      "items": [
        "List item 1",
        "List item 2",
        "List item 3"
      ]
    }
  ]
}
```

### Step 3: Save and Done!

Your blog post will be immediately available at `yourdomain.com/blog/your-post-url-slug`

## Field Explanations

### Required Fields:

- **id**: URL-friendly slug (use lowercase and hyphens)
  - Example: `"how-to-convert-heic"`
  - This becomes the URL: `/blog/how-to-convert-heic`

- **title**: The main headline of your post
  - Example: `"How to Convert HEIC Files to JPG"`

- **excerpt**: Short description for the blog listing page
  - Keep it under 160 characters
  - Example: `"Learn the easiest ways to convert HEIC to JPG format"`

- **date**: Publication date in YYYY-MM-DD format
  - Example: `"2024-12-05"`
  - Posts are sorted by date (newest first)

- **content**: Array of content blocks (see below)

### Optional Fields:

- **image**: Featured image URL
  - Recommended size: 800x400 pixels
  - Use Unsplash for free high-quality images
  - Example: `"https://images.unsplash.com/photo-123456"`

## Content Block Types

### 1. Paragraph
```json
{
  "type": "paragraph",
  "text": "Your paragraph text here. Can be multiple sentences."
}
```

### 2. Heading (Section Title)
```json
{
  "type": "heading",
  "text": "Your Section Heading"
}
```

### 3. Bullet List (with checkmarks)
```json
{
  "type": "list",
  "items": [
    "First point",
    "Second point",
    "Third point"
  ]
}
```

## Finding Free Images

### Unsplash (Recommended)
1. Go to https://unsplash.com
2. Search for your topic (e.g., "technology", "phone", "computer")
3. Click on an image
4. Copy the image URL
5. Add `?w=800&h=400&fit=crop` to resize it

**Example:**
```
https://images.unsplash.com/photo-1234567?w=800&h=400&fit=crop
```

### Other Free Image Sources:
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

## Example Complete Blog Post

```json
{
  "id": "5-tips-better-iphone-photos",
  "title": "5 Tips for Taking Better iPhone Photos",
  "excerpt": "Improve your iPhone photography with these simple tips and tricks.",
  "date": "2024-12-05",
  "image": "https://images.unsplash.com/photo-1234567?w=800&h=400&fit=crop",
  "content": [
    {
      "type": "paragraph",
      "text": "Your iPhone is a powerful camera. Here are 5 simple tips to take better photos."
    },
    {
      "type": "heading",
      "text": "1. Use Natural Light"
    },
    {
      "type": "paragraph",
      "text": "Natural light is your best friend when taking photos. Try to shoot during golden hour."
    },
    {
      "type": "heading",
      "text": "2. Clean Your Lens"
    },
    {
      "type": "paragraph",
      "text": "A dirty lens can ruin your photos. Wipe it with a soft cloth before shooting."
    },
    {
      "type": "heading",
      "text": "Quick Tips Checklist"
    },
    {
      "type": "list",
      "items": [
        "Use the rule of thirds",
        "Tap to focus on your subject",
        "Avoid using digital zoom",
        "Take multiple shots",
        "Edit your photos"
      ]
    }
  ]
}
```

## Blog Post Ideas

1. "Understanding HEIC Format: A Beginner's Guide"
2. "HEIC vs PNG: Which Format is Better?"
3. "How to Batch Convert HEIC Files"
4. "Why Can't I Open HEIC Files on Windows?"
5. "The History of Image Formats"
6. "Best Practices for iPhone Photo Storage"
7. "Converting HEIC to PDF: When and Why"
8. "How to Free Up iPhone Storage Space"
9. "Image Format Comparison Chart"
10. "Common HEIC Conversion Errors and Fixes"

## SEO Tips

1. **Use keywords in title**: Include terms people search for
2. **Write compelling excerpts**: This is what appears in search results
3. **Use descriptive IDs**: URL slugs should indicate content
4. **Add relevant images**: Images improve engagement
5. **Write longer posts**: 1000+ words rank better
6. **Link to other pages**: Link to your converter and other blog posts
7. **Update dates**: Fresh content ranks higher

## Publishing Schedule

For best results:
- Publish consistently (e.g., every Tuesday and Thursday)
- Aim for 2-3 posts per week
- Mix tutorial and informational content
- Update old posts with new information

## Need Help?

- All blog code is in `/app/frontend/src/components/Blog.js` and `BlogPost.js`
- Blog data is in `/app/frontend/src/data/blogPosts.json`
- Blog routes are in `/app/frontend/src/App.js`
