// src/app/sitemap.js
import { createClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const supabase = await createClient();
  const baseUrl = "https://themes-store.vercel.app"; // আপনার ডোমেইন

  // ডাটাবেস থেকে সব থিমের slug আনা
  const { data: themes } = await supabase.from("themes").select("slug, created_at");

  const themeUrls = (themes || []).map((theme) => ({
    url: `${baseUrl}/themes/${theme.slug}`,
    lastModified: theme.created_at ? new Date(theme.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // স্ট্যাটিক পেজগুলো
  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/themes`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticUrls, ...themeUrls];
}