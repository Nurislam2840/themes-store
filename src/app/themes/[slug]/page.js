import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaCheckCircle, FaExternalLinkAlt, FaArrowLeft, FaCode, FaLayerGroup, 
  FaMobileAlt, FaSearch, FaMoon, FaRocket, FaFileArchive, FaChrome, 
  FaInfinity, FaCalendarAlt, FaShieldAlt, FaCrown, FaCheck, FaTools
} from "react-icons/fa";
import ThemeDetailActions from "@/components/ThemeDetailActions";
import ReviewSection from "@/components/ReviewSection";
import GallerySection from "@/components/GallerySection";

async function getTheme(slug) {
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

export default async function ThemeDetailsPage({ params }) {
  const resolvedParams = await params;
  const theme = await getTheme(resolvedParams.slug);

  if (!theme) notFound();

  const features = theme.features || [];
  const technologies = theme.technologies || [];
  const galleryImages = theme.gallery_images || [];
  
  // Files Included কে কমা দিয়ে ভাগ করা
  const filesIncluded = (theme.file_included || "HTML, CSS, JS").split(',').map(f => f.trim());

  return (
    <main className="min-h-screen bg-white dark:bg-[#09090B] text-gray-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 w-full flex-grow relative z-10">
        
        <Link href="/themes" className="inline-flex items-center gap-2 text-gray-500 dark:text-brand-muted hover:text-brand-gold transition-colors mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Themes
        </Link>

        {/* হিরো সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl group">
            <img src={theme.image_url} alt={theme.title} className="w-full h-[350px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-20">
              {theme.is_premium ? (
                <span className="bg-gradient-to-r from-brand-gold to-yellow-300 text-white dark:text-black text-xs font-extrabold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg"><FaCrown size={10} /> PRO</span>
              ) : (
                <span className="bg-green-500 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-lg">FREE</span>
              )}
              <div className="bg-black/60 backdrop-blur-md border border-white/10 text-brand-gold text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2"><FaRocket /> Latest Version</div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-3">{theme.category}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">{theme.title}</h1>
            
            <div className="flex items-center gap-6 mb-6 border-b border-gray-200 dark:border-white/5 pb-6">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white"><span className="text-2xl text-gray-500 dark:text-brand-muted mr-1">৳</span>{theme.price}</span>
                  {theme.old_price && theme.old_price > theme.price && (<span className="text-xl text-gray-400 dark:text-brand-muted line-through">৳{theme.old_price}</span>)}
                </div>
                {theme.old_price && theme.old_price > theme.price && (<span className="text-green-500 dark:text-green-400 font-bold text-sm mt-1">You save ৳{theme.old_price - theme.price} ({Math.round(((theme.old_price - theme.price) / theme.old_price) * 100)}% OFF)</span>)}
              </div>
              <span className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-4 py-2 rounded-full border border-green-200 dark:border-green-500/20 flex items-center gap-2 font-bold self-start mt-2"><FaCheckCircle /> Lifetime Access</span>
            </div>

            <p className="text-gray-600 dark:text-brand-muted leading-relaxed mb-8 text-lg">{theme.description}</p>

            <div className="mb-6"><ThemeDetailActions theme={theme} /></div>

            <a href={theme.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-brand-gold hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
              <FaExternalLinkAlt /> Live Preview
            </a>
          </div>
        </div>

        {/* ৪টি স্পেসিফিকেশন কার্ড */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-5 text-center hover:border-brand-gold/30 transition-colors">
            <div className="text-brand-gold text-2xl mb-3 flex justify-center"><FaFileArchive /></div>
            <p className="text-xs text-gray-500 dark:text-brand-muted uppercase tracking-wider mb-1">File Included</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{theme.file_included || "HTML, CSS, JS, Figma"}</p>
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

        {/* ৩ কলামের ডিটেইলস গ্রিড (Features, Tech, Tools) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          
          {/* কলাম ১: Key Features */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
              <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center text-lg"><FaLayerGroup /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Key Features</h2></div>
            </div>
            <ul className="space-y-3 flex-grow">
              {features.length > 0 ? features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-brand-muted">
                  <FaCheckCircle className="text-brand-gold mt-0.5 flex-shrink-0" size={14} />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              )) : (
                <p className="text-gray-500 text-sm">No features listed.</p>
              )}
            </ul>
          </div>

          {/* কলাম ২: Technology Stack */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center text-lg"><FaCode /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Tech Stack</h2></div>
            </div>
            <div className="flex flex-wrap gap-2 flex-grow content-start">
              {technologies.length > 0 ? technologies.map((tech, i) => (
                <span key={i} className="bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                  {tech}
                </span>
              )) : (
                <p className="text-gray-500 text-sm">No tech stack listed.</p>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-brand-muted"><FaCalendarAlt className="text-brand-gold" /> Updated: {new Date().toLocaleDateString()}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-brand-muted"><FaShieldAlt className="text-brand-gold" /> Verified & Secure</div>
            </div>
          </div>

          {/* কলাম ৩: Tools & Software */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center text-lg"><FaTools /></div>
              <div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Tools Used</h2></div>
            </div>
            <div className="grid grid-cols-1 gap-3 flex-grow content-start">
               {technologies.length > 0 ? technologies.map((tech, i) => (
                 <div key={i} className="flex items-center gap-3 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 rounded-xl p-2.5">
                   <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-brand-gold flex-shrink-0">
                     <FaCode size={14} />
                   </div>
                   <span className="text-sm font-semibold text-gray-900 dark:text-white">{tech}</span>
                 </div>
               )) : (
                 <p className="text-gray-500 text-sm">No tools listed.</p>
               )}
            </div>
          </div>
        </div>

        {/* File Included Details (প্রফেশনাল ব্যাজ) */}
        <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">File Included</h3>
          <div className="flex flex-wrap gap-3">
            {filesIncluded.map((file, i) => (
              <div key={i} className="flex items-center gap-2 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl shadow-sm">
                <FaCheck className="text-green-500 text-xs" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{file}</span>
              </div>
            ))}
          </div>
        </div>

        {/* গ্যালারি সেকশন */}
        {galleryImages.length > 0 && (
          <GallerySection images={galleryImages} />
        )}

        {/* রিভিউ সেকশন */}
        <ReviewSection themeId={theme.id} />

      </div>
    </main>
  );
}