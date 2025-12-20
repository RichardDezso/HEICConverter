/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'customer-assets.emergentagent.com',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect non-www to www (www is primary)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'heicconverteronline.com' }],
        destination: 'https://www.heicconverteronline.com/:path*',
        permanent: true,
      },
      // Redirect old blog routes
      {
        source: '/blog',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/guides/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
