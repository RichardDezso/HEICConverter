import fallbackGuides from '@/data/guides-fallback.json';

const SITE_URL = 'https://www.heicconverteronline.com';

export default function sitemap() {
  // Use static fallback data - no database calls needed
  const guides = fallbackGuides;

  const guideUrls = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.id}`,
    lastModified: new Date('2025-12-01'),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/heic-to-pdf`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/heic-to-png`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/heic-to-jpg`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...guideUrls,
  ];
}
