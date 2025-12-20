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
      // Redirect www to non-www (non-www is canonical)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.heicconverteronline.com' }],
        destination: 'https://heicconverteronline.com/:path*',
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
