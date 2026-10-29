// src/app/themes/[slug]/page.js
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaCheckCircle, FaExternalLinkAlt, FaCode, FaLayerGroup, 
  FaMobileAlt, FaFileArchive, FaChrome, FaInfinity, 
  FaCalendarAlt, FaShieldAlt, FaCrown, FaCheck, FaTools, 
  FaFileAlt, FaStar, FaDownload, FaHome, FaChevronRight
} from "react-icons/fa";
import ThemeDetailActions from "@/components/ThemeDetailActions";
import ReviewSection from "@/components/ReviewSection";
import GallerySection from "@/components/GallerySection";
import { getTechIcon, getTechColor } from "@/lib/iconMapper";

async function getTheme(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("themes")
    .select(`*, categories (name)`)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  
  return {
    ...data,
    category: data.categories?.name || data.category || "Uncategorized",
  };
}

// ✅ রিভিউ কাউন্ট আনার জন্য নতুন ফাংশন
async function getReviewStats(themeId) {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("theme_id", themeId);
  
  // রেটিং এভারেজ বের করা (যদি রিভিউ থাকে)
  let avgRating = 5.0;
  if (data && data.length > 0) {
    const total = data.reduce((acc, curr) => acc + curr.rating, 0);
    avgRating = (total / data.length).toFixed(1);
  }

  return { count: count || 0, avgRating };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const theme = await getTheme(resolvedParams.slug);
  if (!theme) return { title: "Theme Not Found | ThemesStore" };
  return {
    title: `${theme.title} | Premium Themes`,
    description: theme.description?.substring(0, 160) || "Buy premium themes.",
    openGraph: { title: theme.title, images: [{ url: theme.image_url }] },
  };
}

export default async function ThemeDetailsPage({ params }) {
  const resolvedParams = await params;
  const theme = await getTheme(resolvedParams.slug);

  if (!theme) notFound();

  // ✅ রিভিউ ডাটা আনা
  const reviewStats = await getReviewStats(theme.id);

  const features = theme.features || [];
  const technologies = theme.technologies || [];
  const galleryImages = theme.gallery_images || [];
  const filesIncluded = (theme.file_included || "HTML, CSS, JS").split(',').map(f => f.trim());

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#09090B] text-gray-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20 w-full flex-grow relative z-10">
        
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-brand-muted mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-brand-gold transition-colors flex items-center gap-1"><FaHome /> Home</Link>
          <FaChevronRight size={10} />
          <Link href="/themes" className="hover:text-brand-gold transition-colors">Themes</Link>
          <FaChevronRight size={10} />
          <Link href={`/themes?category=${theme.category.toLowerCase()}`} className="hover:text-brand-gold transition-colors">{theme.category}</Link>
          <FaChevronRight size={10} />
          <span className="text-brand-gold font-medium truncate">{theme.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 mb-16 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl group bg-white dark:bg-[#121214]">
              <img src={theme.image_url} alt={theme.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                {theme.is_premium ? (
                  <span className="bg-brand-gold text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"><FaCrown size={10} /> PREMIUM</span>
                ) : (
                  <span className="bg-green-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg">FREE</span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center text-lg"><FaFileAlt /></div>
                <h2 className="text-xl font-bold">Description</h2>
              </div>
              <p className="text-gray-600 dark:text-brand-muted text-sm md:text-base leading-relaxed whitespace-pre-wrap">{theme.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center text-lg"><FaLayerGroup /></div>
                  <h2 className="text-lg font-bold">Key Features</h2>
                </div>
                <ul className="space-y-3">
                  {features.length > 0 ? features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-brand-muted">
                      <FaCheckCircle className="text-brand-gold mt-0.5 flex-shrink-0" size={14} />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  )) : <p className="text-gray-500 text-sm">No features listed.</p>}
                </ul>
              </div>

              <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center text-lg"><FaCode /></div>
                  <h2 className="text-lg font-bold">Technology Stack</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {technologies.length > 0 ? technologies.map((tech, i) => (
                    <span key={i} className={`bg-gray-50 dark:bg-[#09090B] border border-gray-200 dark:border-white/10 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${getTechColor(tech)}`}>
                      {getTechIcon(tech)} {tech}
                    </span>
                  )) : <p className="text-gray-500 text-sm">No tech stack listed.</p>}
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-brand-muted">
                    <span className="flex items-center gap-2"><FaMobileAlt className="text-brand-gold" /> Responsive</span>
                    <span className="font-bold text-gray-900 dark:text-white">{theme.responsive || "Yes"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-brand-muted">
                    <span className="flex items-center gap-2"><FaChrome className="text-brand-gold" /> Browser Support</span>
                    <span className="font-bold text-gray-900 dark:text-white">{theme.browser_support || "All"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-brand-muted">
                    <span className="flex items-center gap-2"><FaInfinity className="text-brand-gold" /> Updates</span>
                    <span className="font-bold text-gray-900 dark:text-white">{theme.updates || "Lifetime"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center text-lg"><FaFileArchive /></div>
                <h2 className="text-lg font-bold">What's Included</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filesIncluded.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-[#09090B] border border-gray-200 dark:border-white/10 px-3 py-2 rounded-xl">
                    <FaCheck className="text-green-500 text-[12px]" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{file}</span>
                  </div>
                ))}
              </div>
            </div>

            {galleryImages.length > 0 && <GallerySection images={galleryImages} />}
            <ReviewSection themeId={theme.id} />

          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                
                <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">{theme.category}</p>
                <h1 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight">{theme.title}</h1>
                
                {/* ✅ ডাইনামিক রিভিউ কাউন্ট */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex text-brand-gold text-sm">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-brand-muted font-medium">
                    ({reviewStats.avgRating} / {reviewStats.count} Reviews)
                  </span>
                </div>

                <div className="mb-6 border-y border-gray-100 dark:border-white/5 py-6">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl md:text-5xl font-extrabold text-brand-gold">
                      <span className="text-2xl text-brand-gold/70 mr-1">৳</span>{theme.price}
                    </span>
                    {theme.old_price && theme.old_price > theme.price && (
                      <span className="text-lg text-gray-400 dark:text-brand-muted line-through mb-1">৳{theme.old_price}</span>
                    )}
                  </div>
                  {theme.old_price && theme.old_price > theme.price && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-green-500/10 text-green-500 px-2.5 py-1 rounded-lg text-xs font-bold">
                      Save ৳{theme.old_price - theme.price} ({Math.round(((theme.old_price - theme.price) / theme.old_price) * 100)}% OFF)
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <ThemeDetailActions theme={theme} />
                  <a href={theme.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-brand-gold hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    <FaExternalLinkAlt size={14} /> Live Preview
                  </a>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-brand-muted">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0"><FaDownload size={12} /></div>
                    <span>Instant Download Access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-brand-muted">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0"><FaCalendarAlt size={12} /></div>
                    <span>Lifetime Free Updates</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-brand-muted">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0"><FaShieldAlt size={12} /></div>
                    <span>Secure Payment Gateway</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}