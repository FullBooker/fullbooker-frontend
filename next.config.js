// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "int.onlyplay.net",
      "mowinbet-file-storage.s3.af-south-1.amazonaws.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Other Next.js configurations...
};

module.exports = nextConfig;
