import { createClient } from "@/lib/supabase/server";
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

export default async function ThemeDetailsPage({ params }) {
  const resolvedParams = await params;
  const theme = await getTheme(resolvedParams.slug);

  if (!theme) notFound();

  const features = theme.features || [];
  const technologies = theme.technologies || [];
  const galleryImages = theme.gallery_images || [];
  
  const filesIncluded = (theme.file_included || "HTML, CSS, JS").split(',').map(f => f.trim());

  return (
    <main className="min-h-screen bg-white dark:bg-[#09090B] text-gray-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-32 pb-20 w-full flex-grow relative z-10">
        
        <Link href="/themes" className="inline-flex items-center gap-2 text-gray-500 dark:text-brand-muted hover:text-brand-gold transition-colors mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Themes
        </Link>

        {/* হিরো সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl group">
            <img src={theme.image_url} alt={theme.title} className="w-full h-[300px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap gap-2 z-20">
              {theme.is_premium ? (
                <span className="bg-gradient-to-r from-brand-gold to-yellow-300 text-white dark:text-black text-[10px] md:text-xs font-extrabold px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 shadow-lg"><FaCrown size={10} /> PRO</span>
              ) : (
                <span className="bg-green-500 text-white text-[10px] md:text-xs font-extrabold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">FREE</span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-brand-gold text-xs md:text-sm font-bold uppercase tracking-widest mb-3">{theme.category}</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{theme.title}</h1>
            
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-white/5 pb-6">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"><span className="text-xl md:text-2xl text-gray-500 dark:text-brand-muted mr-1">৳</span>{theme.price}</span>
                  {theme.old_price && theme.old_price > theme.price && (<span className="text-lg text-gray-400 dark:text-brand-muted line-through">৳{theme.old_price}</span>)}
                </div>
                {theme.old_price && theme.old_price > theme.price && (<span className="text-green-500 dark:text-green-400 font-bold text-xs md:text-sm mt-1">Save ৳{theme.old_price - theme.price} ({Math.round(((theme.old_price - theme.price) / theme.old_price) * 100)}% OFF)</span>)}
              </div>
            </div>

            <p className="text-gray-600 dark:text-brand-muted leading-relaxed mb-6 text-base md:text-lg">{theme.description}</p>

            <div className="mb-6"><ThemeDetailActions theme={theme} /></div>

            <a href={theme.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-brand-gold hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
              <FaExternalLinkAlt /> Live Preview
            </a>
          </div>
        </div>

        {/* স্পেসিফিকেশন কার্ড */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-4 md:p-5 text-center">
            <div className="text-brand-gold text-xl md:text-2xl mb-2 flex justify-center"><FaFileArchive /></div>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-brand-muted uppercase mb-1">File Included</p>
            <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{theme.file_included || "HTML, CSS, JS"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-4 md:p-5 text-center">
            <div className="text-brand-gold text-xl md:text-2xl mb-2 flex justify-center"><FaMobileAlt /></div>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-brand-muted uppercase mb-1">Responsive</p>
            <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{theme.responsive || "Mobile"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-4 md:p-5 text-center">
            <div className="text-brand-gold text-xl md:text-2xl mb-2 flex justify-center"><FaChrome /></div>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-brand-muted uppercase mb-1">Browser</p>
            <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{theme.browser_support || "All"}</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-4 md:p-5 text-center">
            <div className="text-brand-gold text-xl md:text-2xl mb-2 flex justify-center"><FaInfinity /></div>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-brand-muted uppercase mb-1">Updates</p>
            <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{theme.updates || "Lifetime"}</p>
          </div>
        </div>

        {/* মোবাইলের জন্য আলাদা ৩টি সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          
          {/* Key Features */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-200 dark:border-white/5 pb-3">
              <div className="w-9 h-9 bg-brand-gold/10 text-brand-gold rounded-lg flex items-center justify-center text-base"><FaLayerGroup /></div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Key Features</h2>
            </div>
            <ul className="space-y-3">
              {features.length > 0 ? features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-600 dark:text-brand-muted">
                  <FaCheckCircle className="text-brand-gold mt-0.5 flex-shrink-0" size={13} />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              )) : <p className="text-gray-500 text-sm">No features.</p>}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-200 dark:border-white/5 pb-3">
              <div className="w-9 h-9 bg-cyan-500/10 text-cyan-500 rounded-lg flex items-center justify-center text-base"><FaCode /></div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Tech Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.length > 0 ? technologies.map((tech, i) => (
                <span key={i} className="bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-[11px] md:text-xs font-semibold">{tech}</span>
              )) : <p className="text-gray-500 text-sm">No tech stack.</p>}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 dark:text-brand-muted"><FaCalendarAlt className="text-brand-gold" /> Updated: {new Date().toLocaleDateString()}</div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 dark:text-brand-muted"><FaShieldAlt className="text-brand-gold" /> Verified & Secure</div>
            </div>
          </div>

          {/* Tools Used */}
          <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-200 dark:border-white/5 pb-3">
              <div className="w-9 h-9 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center text-base"><FaTools /></div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Tools Used</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
               {technologies.length > 0 ? technologies.map((tech, i) => (
                 <div key={i} className="flex items-center gap-2.5 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 rounded-lg p-2">
                   <div className="w-7 h-7 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center text-brand-gold flex-shrink-0"><FaCode size={12} /></div>
                   <span className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">{tech}</span>
                 </div>
               )) : <p className="text-gray-500 text-sm">No tools listed.</p>}
            </div>
          </div>
        </div>

        {/* File Included Details */}
        <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl p-6 mb-8">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4">File Included</h3>
          <div className="flex flex-wrap gap-2">
            {filesIncluded.map((file, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg shadow-sm">
                <FaCheck className="text-green-500 text-[10px]" />
                <span className="text-xs font-medium text-gray-900 dark:text-white">{file}</span>
              </div>
            ))}
          </div>
        </div>

        {galleryImages.length > 0 && <GallerySection images={galleryImages} />}
        <ReviewSection themeId={theme.id} />

      </div>
    </main>
  );
}