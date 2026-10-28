// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { 
        protocol: "https", 
        hostname: "**.supabase.co",
        pathname: "/**" // ইমেজ পাথের জন্য ওয়াইল্ডকার্ড
      },
      { 
        protocol: "https", 
        hostname: "images.unsplash.com",
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