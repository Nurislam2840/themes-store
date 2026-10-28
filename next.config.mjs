// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { 
        protocol: "https", 
        hostname: "**.supabase.co",
        pathname: "/**" 
      },
      { 
        protocol: "https", 
        hostname: "images.unsplash.com",
        pathname: "/**" 
      },
      // ✅ নতুন ইমেজ হোস্ট ডোমেইন যোগ করা হলো
      { 
        protocol: "https", 
        hostname: "i.postimg.cc",
        pathname: "/**" 
      },
      { 
        protocol: "https", 
        hostname: "i.ibb.co",
        pathname: "/**" 
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});