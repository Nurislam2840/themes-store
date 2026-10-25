import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaCheckCircle, FaExternalLinkAlt, FaArrowLeft,
  FaCode, FaLayerGroup, FaMobileAlt, FaSearch,
  FaMoon, FaRocket, FaFileArchive, FaChrome,
  FaInfinity, FaCalendarAlt, FaShieldAlt, FaCrown
} from "react-icons/fa";
import ThemeDetailActions from "@/components/ThemeDetailActions";
import ReviewSection from "@/components/ReviewSection";
import SlidingFeatures from "@/components/SlidingFeatures";
import ToolsSection from "@/components/ToolsSection";
import GallerySection from "@/components/GallerySection";

async function getTheme(slug) {
  const { data, error } = await supabase
    .from("themes")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  
  // ক্যাটাগরি নামটি রিটার্ন করা
  return {
    ...data,
    category: data.categories?.name || data.category || "Uncategorized",
  };
}

export default async function ThemeDetailsPage({ params }) {
  const resolvedParams = await params;
  const theme = await getTheme(resolvedParams.slug);

  if (!theme) {
    notFound();
  }

  const features = theme.features || [];
  const technologies = theme.technologies || [];
  const galleryImages = theme.gallery_images || [];

  return (
    <main className="min-h-screen bg-white dark:bg-[#09090B] text-gray-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 w-full flex-grow relative z-10">
        
        <Link href="/themes" className="inline-flex items-center gap-2 text-gray-500 dark:text-brand-muted hover:text-brand-gold transition-colors mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Themes
        </Link>

        {/* হিরো সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* ইমেজ সেকশন (PRO/FREE ব্যাজ সহ) */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl group">
            <img 
              src={theme.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"} 
              alt={theme.title} 
              className="w-full h-[350px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            {/* ব্যাজ কন্টেইনার */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-20">
              {theme.is_premium ? (
                <span className="bg-gradient-to-r from-brand-gold to-yellow-300 text-white dark:text-black text-xs font-extrabold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                  <FaCrown size={10} /> PRO
                </span>
              ) : (
                <span className="bg-green-500 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-lg">
                  FREE
                </span>
              )}
              <div className="bg-black/60 backdrop-blur-md border border-white/10 text-brand-gold text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                <FaRocket /> Latest Version
              </div>
            </div>
          </div>

          {/* থিম ইনফো সেকশন */}
          <div className="flex flex-col justify-center">
            <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-3">
              {theme.category}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              {theme.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-6 border-b border-gray-200 dark:border-white/5 pb-6">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                    <span className="text-2xl text-gray-500 dark:text-brand-muted mr-1">৳</span>{theme.price}
                  </span>
                  {theme.old_price && theme.old_price > theme.price && (
                    <span className="text-xl text-gray-400 dark:text-brand-muted line-through">৳{theme.old_price}</span>
                  )}
                </div>
                {theme.old_price && theme.old_price > theme.price && (
                  <span className="text-green-500 dark:text-green-400 font-bold text-sm mt-1">
                    You save ৳{theme.old_price - theme.price} ({Math.round(((theme.old_price - theme.price) / theme.old_price) * 100)}% OFF)
                  </span>
                )}
              </div>
              <span className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-4 py-2 rounded-full border border-green-200 dark:border-green-500/20 flex items-center gap-2 font-bold self-start mt-2">
                <FaCheckCircle /> Lifetime Access
              </span>
            </div>

            <p className="text-gray-600 dark:text-brand-muted leading-relaxed mb-8 text-lg">
              {theme.description}
            </p>

            <div className="mb-6">
              <ThemeDetailActions theme={theme} />
            </div>

            <a 
              href={theme.demo_url || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-brand-gold hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FaExternalLinkAlt /> Live Preview
            </a>
          </div>
        </div>

        {/* প্রফেশনাল স্পেসিফিকেশন গ্রিড (ডাইনামিক) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-5 text-center hover:border-brand-gold/30 transition-colors">
            <div className="text-brand-gold text-2xl mb-3 flex justify-center"><FaFileArchive /></div>
            <p className="text-xs text-gray-500 dark:text-brand-muted uppercase tracking-wider mb-1">File Included</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{theme.file_included || "HTML, CSS, JS, Figma"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-5 text-center hover:border-brand-gold/30 transition-colors">
            <div className="text-brand-gold text-2xl mb-3 flex justify-center"><FaMobileAlt /></div>
            <p className="text-xs text-gray-500 dark:text-brand-muted uppercase tracking-wider mb-1">Responsive</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{theme.responsive || "Mobile & Tablet"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-5 text-center hover:border-brand-gold/30 transition-colors">
            <div className="text-brand-gold text-2xl mb-3 flex justify-center"><FaChrome /></div>
            <p className="text-xs text-gray-500 dark:text-brand-muted uppercase tracking-wider mb-1">Browser Support</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{theme.browser_support || "Chrome, Safari, Edge"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-5 text-center hover:border-brand-gold/30 transition-colors">
            <div className="text-brand-gold text-2xl mb-3 flex justify-center"><FaInfinity /></div>
            <p className="text-xs text-gray-500 dark:text-brand-muted uppercase tracking-wider mb-1">Updates</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{theme.updates || "Lifetime Free"}</p>
          </div>
        </div>

        {/* ফিচার ও টেকনোলজি (২ কলাম) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* স্লাইডিং ফিচারস */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
              <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center text-lg">
                <FaLayerGroup />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Key Features</h2>
                <p className="text-gray-500 dark:text-brand-muted text-xs">What's included</p>
              </div>
            </div>
            <SlidingFeatures features={features} />
          </div>

          {/* টেকনোলজি স্ট্যাক */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 rounded-xl flex items-center justify-center text-lg">
                <FaCode />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Technology Stack</h2>
                <p className="text-gray-500 dark:text-brand-muted text-xs">Built with modern tech</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, i) => (
                <span key={i} className="bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-brand-gold/50 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-brand-muted mb-3">
                <FaCalendarAlt className="text-brand-gold" /> Last Updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-brand-muted">
                <FaShieldAlt className="text-brand-gold" /> Quality Checked & Verified
              </div>
            </div>
          </div>
        </div>

        {/* Tools & Software Section */}
        <ToolsSection technologies={technologies} />

        {/* গ্যালারি সেকশন (লাইটবক্সসহ) */}
        {galleryImages.length > 0 && (
          <GallerySection images={galleryImages} />
        )}

        {/* এক্সট্রা ফিচার আইকন */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 text-center hover:border-brand-gold/20 transition-colors">
            <FaMobileAlt className="text-brand-gold text-3xl mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 dark:text-white">Fully Responsive</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 text-center hover:border-green-500/20 transition-colors">
            <FaSearch className="text-green-500 dark:text-green-400 text-3xl mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 dark:text-white">SEO Optimized</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 text-center hover:border-purple-500/20 transition-colors">
            <FaMoon className="text-purple-500 dark:text-purple-400 text-3xl mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode Ready</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 text-center hover:border-orange-500/20 transition-colors">
            <FaRocket className="text-orange-500 dark:text-orange-400 text-3xl mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-900 dark:text-white">Blazing Fast</p>
          </div>
        </div>

        {/* রিভিউ সেকশন */}
        <ReviewSection themeId={theme.id} />

      </div>
    </main>
  );
}