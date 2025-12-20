export async function GET() {
  const robots = `User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://heicconverteronline.com/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
