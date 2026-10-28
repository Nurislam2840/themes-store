// src/app/robots.js
export default function robots() {
  const baseUrl = "https://themes-store.vercel.app"; // আপনার ডোমেইন

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/checkout", "/my-downloads", "/account"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}