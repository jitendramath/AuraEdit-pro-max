/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Dev mein PWA disable rakho taaki reload fast ho
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Vercel optimization ON
  images: {
    unoptimized: true, // Static export compatibility (agar future mein chahiye ho)
  },
};

module.exports = withPWA(nextConfig);
