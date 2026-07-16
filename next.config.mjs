/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local assets served from /public/assets — no remote patterns needed.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
