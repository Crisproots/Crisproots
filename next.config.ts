import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint errors won't fail the Vercel build (they show as warnings)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript errors won't fail the Vercel build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
