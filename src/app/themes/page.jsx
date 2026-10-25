"use client";
import { useStore } from "@/providers/StoreProvider";
import ThemeCard from "@/components/ThemeCard";
import { FaSpinner, FaBolt, FaStar, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

function ThemesContent() {
  const { themes, isLoading } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get("category");
  const [filter, setFilter] = useState(categoryParam || "All");
  const [categories, setCategories] = useState([]);

  // ডাটাবেস থেকে ক্যাটাগরি লোড
  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from("categories").select("*").order("order_index");
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (categoryParam) setFilter(categoryParam);
    else setFilter("All");
  }, [categoryParam]);

  const handleFilterClick = (slug) => {
    setFilter(slug);
    if (slug === "All") router.push("/themes");
    else router.push(`/themes?category=${slug}`);
  };

  const mainCategories = categories.filter(c => !c.parent_id);

  const filteredThemes = filter === "All" 
    ? themes 
    : themes.filter(t => {
        const selectedCat = categories.find(c => c.slug === filter || c.name === filter);
        if (selectedCat) {
          const subCatIds = categories.filter(c => c.parent_id === selectedCat.id).map(c => c.id);
          return t.category_id === selectedCat.id || subCatIds.includes(t.category_id) || t.category === selectedCat.name;
        }
        return t.category === filter;
      });

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] relative overflow-hidden pt-20 transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Discover Our <span className="text-transparent bg-clip-text bg-gold-gradient">Masterpieces</span>
          </h1>
        </motion.div>

        {/* ফিল্টার বাটন */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button onClick={() => handleFilterClick("All")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
              filter === "All" ? "bg-brand-gold text-black border-brand-gold shadow-lg" : "bg-white dark:bg-[#121214] text-gray-600 dark:text-brand-muted border-gray-200 dark:border-white/10 hover:border-brand-gold/50"
            }`}
          >
            All
          </button>
          {mainCategories.map((cat) => (
            <button key={cat.id} onClick={() => handleFilterClick(cat.slug)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                filter === cat.slug ? "bg-brand-gold text-black border-brand-gold shadow-lg" : "bg-white dark:bg-[#121214] text-gray-600 dark:text-brand-muted border-gray-200 dark:border-white/10 hover:border-brand-gold/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32"><FaSpinner className="text-5xl text-brand-gold animate-spin" /></div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-3xl"><p className="text-gray-500 dark:text-brand-muted text-lg">No themes found in this category.</p></div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center"><FaSpinner className="text-5xl text-brand-gold animate-spin" /></div>}>
      <ThemesContent />
    </Suspense>
  );
}