"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { FaSearch, FaArrowRight, FaBolt } from "react-icons/fa";
import { useStore } from "@/providers/StoreProvider";
import ThemeCard from "@/components/ThemeCard";
import HeroBanner from "@/components/HeroBanner";
import StatsSection from "@/components/StatsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import { motion } from "framer-motion";

export default function Home() {
  const { themes, isLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(themes.map((t) => t.category))];

  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const matchesSearch = theme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (theme.description && theme.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || theme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [themes, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col items-center w-full bg-white dark:bg-[#09090B] overflow-hidden transition-colors duration-300">
      
      <div className="w-full">
        <HeroBanner />
      </div>

      <StatsSection />

      <div id="themes" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[400px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] md:text-xs font-bold mb-3 md:mb-4">
              <FaBolt /> Curated Collection
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-3 tracking-tight text-gray-900 dark:text-white">
              Explore Our <span className="text-transparent bg-clip-text bg-gold-gradient">Collection</span>
            </h2>
            <p className="text-gray-600 dark:text-brand-muted text-sm md:text-lg">Find the perfect theme for your business.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-brand-muted" />
            <input 
              type="text" 
              placeholder="Search by keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-brand-gold transition-colors"
            />
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
                selectedCategory === cat
                  ? "bg-brand-gold text-black border-brand-gold shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "bg-gray-50 dark:bg-[#121214] text-gray-600 dark:text-brand-muted border-gray-200 dark:border-white/10 hover:border-brand-gold/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-3xl"><p className="text-gray-500 dark:text-brand-muted text-sm md:text-base">No themes found.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredThemes.slice(0, 6).map((theme, index) => (
              <ThemeCard key={theme.id} theme={theme} index={index} />
            ))}
          </div>
        )}

        {filteredThemes.length > 6 && (
          <div className="text-center mt-12">
            <Link href="/themes" className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:border-brand-gold font-bold py-4 px-10 rounded-xl transition-all">
              View All Themes <FaArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      <WhyChooseUs />
    </div>
  );
}