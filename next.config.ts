import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: process.env.R2_PUBLIC_URL?.replace("https://", "") || "r2.dev",
      },
    ],
  },
};

export default nextConfig;
