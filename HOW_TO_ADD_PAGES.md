# How to Add New Content Pages

This guide explains how to add new keyword/SEO pages and static pages to your HEIC Converter site.

## Adding Keyword/SEO Pages (Super Easy!)

Keyword pages are perfect for SEO and targeting specific search terms like "HEIC to JPG", "HEIC to PNG", etc.

### Step 1: Edit the JSON file

Open `/app/frontend/src/data/keywordPages.json` and add a new page object:

```json
{
  "slug": "your-page-url",
  "title": "Page Title - Appears in Browser Tab",
  "metaDescription": "Meta description for SEO (shows in Google search results)",
  "heading": "Main Heading on Page",
  "description": "Subheading/description text",
  "content": [
    {
      "type": "paragraph",
      "text": "Your paragraph text here..."
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

### Step 2: That's it!

The page will automatically be available at `yourdomain.com/your-page-url`

### Content Types Available:

1. **Paragraph**: 
```json
{
  "type": "paragraph",
  "text": "Your text here"
}
```

2. **Heading**:
```json
{
  "type": "heading",
  "text": "Your heading"
}
```

3. **List** (with checkmark icons):
```json
{
  "type": "list",
  "items": ["Item 1", "Item 2", "Item 3"]
}
```

## Examples of Keyword Pages to Create

Here are some keyword page ideas for better SEO:

1. `/heic-converter-online` - "Free Online HEIC Converter"
2. `/iphone-photo-converter` - "Convert iPhone Photos Online"
3. `/heic-to-jpeg-converter` - "HEIC to JPEG Converter"
4. `/batch-heic-converter` - "Batch HEIC Converter"
5. `/heic-file-converter` - "HEIC File Converter - Free Tool"

## Adding Static Pages (About, Contact, etc.)

Static pages are already created in `/app/frontend/src/components/StaticPage.js`

### Existing Static Pages:
- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy Policy page

### To Add a New Static Page:

1. Open `/app/frontend/src/components/StaticPage.js`
2. Copy the `AboutPage` component and modify it
3. Export your new component
4. Add the route in `/app/frontend/src/App.js`:

```javascript
<Route path="/your-new-page" element={<YourNewPage />} />
```

## Adding Pages to Navigation

### Header Navigation

Edit `/app/frontend/src/components/Header.js`:

```javascript
<Link 
  to="/your-page-slug" 
  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
>
  Your Page Name
</Link>
```

### Footer Navigation

Edit `/app/frontend/src/components/Footer.js`:

```javascript
<li>
  <Link to="/your-page-slug" className="text-sm text-muted-foreground hover:text-primary transition-colors">
    Your Page Name
  </Link>
</li>
```

## SEO Tips

1. **Use descriptive slugs**: `/heic-to-jpg` is better than `/page1`
2. **Write compelling meta descriptions**: Keep them under 160 characters
3. **Include keywords naturally**: Don't stuff keywords, write for humans
4. **Create unique content**: Each page should target different keywords
5. **Add internal links**: Link between your pages for better SEO

## Need More Help?

- All page files are in `/app/frontend/src/components/`
- Keyword page data is in `/app/frontend/src/data/keywordPages.json`
- Routes are defined in `/app/frontend/src/App.js`
