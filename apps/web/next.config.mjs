/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@kittu-cafe/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
