import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      // Add your Supabase project URL here (without https://)
      'yxuoskvkwyvzgykialtb.supabase.co',
      // If you're using custom domains add them here
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/generated-media/**',
      },
    ],
  },};

export default nextConfig;
