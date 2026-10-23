import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaCheckCircle, FaExternalLinkAlt, FaArrowLeft,
  FaCode, FaLayerGroup, FaMobileAlt, FaSearch,
  FaMoon, FaRocket, FaFileArchive, FaChrome,
  FaInfinity, FaCalendarAlt, FaShieldAlt, FaCrown, FaImage
} from "react-icons/fa";
import ThemeDetailActions from "@/components/ThemeDetailActions";
import ReviewSection from "@/components/ReviewSection";
import SlidingFeatures from "@/components/SlidingFeatures";
import ToolsSection from "@/components/ToolsSection";

async function getTheme(slug) {
  const { data, error } = await supabase.from("themes").select("*").eq("slug", slug).single();
  if (error || !data) return null;
  return data;
}

export default async function ThemeDetailsPage({ params }) {
  const resolvedParams = await params;
  const theme = await getTheme(resolvedParams.slug);

  if (!theme) notFound();

  const features = theme.features || [];
  const technologies = theme.technologies || [];
  const galleryImages = theme.gallery_images || []; // গ্যালারি অ্যারে

  return (
    <main className="min-h-screen bg-[#09090B] text-white flex flex-col relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 w-full flex-grow relative z-10">
        
        <Link href="/themes" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-colors mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Themes
        </Link>

        {/* হিরো সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
            <img 
              src={theme.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"} 
              alt={theme.title} 
              className="w-full h-[350px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-20">
              {theme.is_premium ? (
                <span className="bg-gradient-to-r from-brand-gold to-yellow-300 text-black text-xs font-extrabold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                  <FaCrown size={10} /> PRO
                </span>
              ) : (
                <span className="bg-green-500 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-lg">FREE</span>
              )}
              
              <div className="bg-black/60 backdrop-blur-md border border-white/10 text-brand-gold text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                <FaRocket /> Latest Version
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-3">{theme.category}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">{theme.title}</h1>
            
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
              <span className="text-5xl font-extrabold text-white">
                <span className="text-lg text-brand-muted mr-1 align-top">USD</span>${theme.price}
              </span>
              <span className="bg-green-500/10 text-green-400 text-xs px-4 py-2 rounded-full border border-green-500/20 flex items-center gap-2 font-bold">
                <FaCheckCircle /> Lifetime Access
              </span>
            </div>

            <p className="text-brand-muted leading-relaxed mb-8 text-lg">{theme.description}</p>

            <div className="mb-6"><ThemeDetailActions theme={theme} /></div>

            <a href={theme.demo_url || "#"} target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 border border-white/10 hover:border-brand-gold hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
              <FaExternalLinkAlt /> Live Preview
            </a>
          </div>
        </div>

        {/* প্রফেশনাল স্পেসিফিকেশন গ্রিড */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <FaFileArchive />, label: "File Included", value: "HTML, CSS, JS, Figma" },
            { icon: <FaMobileAlt />, label: "Responsive", value: "Mobile & Tablet" },
            { icon: <FaChrome />, label: "Browser Support", value: "Chrome, Safari, Edge" },
            { icon: <FaInfinity />, label: "Updates", value: "Lifetime Free" },
          ].map((item, i) => (
            <div key={i} className="bg-[#121214] border border-white/5 rounded-2xl p-5 text-center hover:border-brand-gold/30 transition-colors">
              <div className="text-brand-gold text-2xl mb-3 flex justify-center">{item.icon}</div>
              <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ফিচার ও টেকনোলজি */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center text-lg"><FaLayerGroup /></div>
              <div><h2 className="text-xl font-bold text-white">Key Features</h2><p className="text-brand-muted text-xs">What's included</p></div>
            </div>
            <SlidingFeatures features={features} />
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center text-lg"><FaCode /></div>
              <div><h2 className="text-xl font-bold text-white">Technology Stack</h2><p className="text-brand-muted text-xs">Built with modern tech</p></div>
            </div>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, i) => (
                <span key={i} className="bg-[#09090B] border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-brand-gold/50 transition-colors">{tech}</span>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-sm text-brand-muted mb-3"><FaCalendarAlt className="text-brand-gold" /> Last Updated: {new Date().toLocaleDateString()}</div>
              <div className="flex items-center gap-3 text-sm text-brand-muted"><FaShieldAlt className="text-brand-gold" /> Quality Checked & Verified</div>
            </div>
          </div>
        </div>

        <ToolsSection technologies={technologies} />

        {/* নতুন: গ্যালারি সেকশন */}
        {galleryImages.length > 0 && (
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="w-10 h-10 bg-pink-500/10 text-pink-400 rounded-xl flex items-center justify-center text-lg"><FaImage /></div>
              <div><h2 className="text-xl font-bold text-white">Screenshots</h2><p className="text-brand-muted text-xs">Preview inside the theme</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden border border-white/5 group cursor-pointer">
                  <img src={img} alt={`Screenshot ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* এক্সট্রা ফিচার */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 text-center hover:border-brand-gold/20 transition-colors"><FaMobileAlt className="text-brand-gold text-3xl mx-auto mb-3" /><p className="text-sm font-bold text-white">Fully Responsive</p></div>
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 text-center hover:border-green-500/20 transition-colors"><FaSearch className="text-green-400 text-3xl mx-auto mb-3" /><p className="text-sm font-bold text-white">SEO Optimized</p></div>
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 text-center hover:border-purple-500/20 transition-colors"><FaMoon className="text-purple-400 text-3xl mx-auto mb-3" /><p className="text-sm font-bold text-white">Dark Mode Ready</p></div>
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 text-center hover:border-orange-500/20 transition-colors"><FaRocket className="text-orange-400 text-3xl mx-auto mb-3" /><p className="text-sm font-bold text-white">Blazing Fast</p></div>
        </div>

        <ReviewSection themeId={theme.id} />

      </div>
    </main>
  );
}