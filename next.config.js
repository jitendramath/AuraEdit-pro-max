/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true  <-- YE LINE HATA DI HUMNE (Kyunki ye ab default hai)
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);

