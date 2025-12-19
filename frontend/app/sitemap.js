import { getGuides } from '@/lib/db';
import fallbackGuides from '@/data/guides-fallback.json';

const SITE_URL = 'https://heicconverteronline.com';

export default async function sitemap() {
  let guides = [];
  
  try {
    guides = await getGuides();
  } catch (error) {
    console.log('Using fallback data for sitemap');
    guides = fallbackGuides;
  }
  
  // Ensure we always have guide data
  if (!guides || guides.length === 0) {
    guides = fallbackGuides;
  }

  const guideUrls = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/heic-to-pdf`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/heic-to-png`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/heic-to-jpg`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...guideUrls,
  ];
}
