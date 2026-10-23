"use client";
import { useStore } from "@/providers/StoreProvider";
import ThemeCard from "@/components/ThemeCard";
import { FaSpinner, FaBolt, FaStar, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ThemesContent() {
  const { themes, isLoading } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get("category");
  const [filter, setFilter] = useState(categoryParam || "All");

  useEffect(() => {
    if (categoryParam) {
      setFilter(categoryParam);
    } else {
      setFilter("All");
    }
  }, [categoryParam]);

  const handleFilterClick = (category) => {
    setFilter(category);
    if (category === "All") {
      router.push("/themes");
    } else {
      router.push(`/themes?category=${category}`);
    }
  };

  const categories = ["All", ...new Set(themes.map((t) => t.category))];
  const filteredThemes = filter === "All" ? themes : themes.filter(t => t.category === filter);

  return (
    <div className="min-h-screen bg-[#09090B] relative overflow-hidden pt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6">
            <FaBolt /> Premium Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Discover Our <span className="text-transparent bg-clip-text bg-gold-gradient">Masterpieces</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Beautifully crafted, highly optimized, and fully dynamic themes for modern businesses and developers.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12 border-y border-white/5 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold"><FaStar /></div>
              <div className="text-left"><p className="text-white font-bold text-lg leading-tight">4.9/5</p><p className="text-brand-muted text-xs">Average Rating</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold"><FaShieldAlt /></div>
              <div className="text-left"><p className="text-white font-bold text-lg leading-tight">100% Secure</p><p className="text-brand-muted text-xs">Verified Themes</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold"><FaBolt /></div>
              <div className="text-left"><p className="text-white font-bold text-lg leading-tight">Instant</p><p className="text-brand-muted text-xs">Download Access</p></div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => handleFilterClick(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                filter === cat ? "bg-brand-gold text-black border-brand-gold shadow-[0_0_20px_rgba(245,158,11,0.3)]" : "bg-white/5 text-brand-muted border-white/10 hover:border-brand-gold/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32"><FaSpinner className="text-5xl text-brand-gold animate-spin" /></div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-32 bg-[#121214] border border-white/5 rounded-3xl">
            <p className="text-brand-muted text-lg">No themes found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme, index) => (
              <ThemeCard key={theme.id} theme={theme} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllThemesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090B] flex items-center justify-center"><FaSpinner className="text-5xl text-brand-gold animate-spin" /></div>}>
      <ThemesContent />
    </Suspense>
  );
}