export default function sitemap() {
  const baseUrl = 'https://heicconverteronline.com';
  
  // Static routes
  const staticRoutes = [
    '',
    '/heic-to-jpg',
    '/heic-to-png',
    '/heic-to-pdf',
    '/guides',
    '/about',
    '/contact',
    '/privacy',
    '/faq',
  ];

  // Guide slugs
  const guideSlugs = [
    'convert-heic-to-pdf-easy-steps',
    'what-is-heic-file-complete-guide',
    'how-to-convert-heic-to-jpg',
    'heic-vs-jpg-comparison',
    'heic-to-pdf-converter',
    'how-to-batch-convert-heic-to-pdf',
    'heic-to-pdf-quality-guide',
    'heic-to-pdf-for-business',
    'heic-pdf-vs-jpeg-pdf',
    'heic-to-pdf-troubleshooting',
    'heic-to-png-converter-guide',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/heic-to') ? 0.9 : 0.7,
  }));

  const guideUrls = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticUrls, ...guideUrls];
}
