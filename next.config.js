// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "int.onlyplay.net",
      "dev-fullbooker-static.s3.amazonaws.com"
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Other Next.js configurations...
};

module.exports = nextConfig;
