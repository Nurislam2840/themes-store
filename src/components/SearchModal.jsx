// src/components/SearchModal.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image"; // ✅ Next Image
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { FaSearch, FaTimes, FaSpinner, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); } 
    else { setQuery(""); setResults([]); }
  }, [isOpen]);

  useEffect(() => {
    const searchThemes = async () => {
      if (query.length < 2) { setResults([]); return; }
      setLoading(true);
      const { data } = await supabase.from("themes").select("id, title, slug, price, image_url, category, is_premium").ilike("title", `%${query}%`).limit(5);
      setResults(data || []);
      setLoading(false);
    };
    const timeout = setTimeout(searchThemes, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-4 p-5 border-b border-white/10 bg-[#0E0E11]">
            <FaSearch className="text-brand-gold text-xl" />
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search premium themes..." className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-brand-muted" />
            <button onClick={onClose} className="text-brand-muted hover:text-white p-2 bg-white/5 rounded-lg transition-colors"><FaTimes /></button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3"><FaSpinner className="animate-spin text-brand-gold text-3xl" /><p className="text-brand-muted text-sm">Searching...</p></div>
            ) : query.length < 2 ? (
              <div className="text-center py-12"><FaSearch className="text-brand-gold/20 text-5xl mx-auto mb-4" /><p className="text-brand-muted text-sm">Type at least 2 characters to start searching</p></div>
            ) : results.length === 0 ? (
              <div className="text-center py-12"><p className="text-brand-muted text-sm">No themes found for "<span className="text-white font-bold">{query}</span>"</p></div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-brand-muted uppercase tracking-wider px-3 py-2">Top Results</p>
                {results.map((theme) => (
                  <Link key={theme.id} href={`/themes/${theme.slug}`} onClick={onClose} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      {/* ✅ Next Image ফিক্স */}
                      <Image src={theme.image_url} alt={theme.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold truncate group-hover:text-brand-gold transition-colors">{theme.title}</p>
                        {theme.is_premium && <span className="bg-brand-gold text-black text-[8px] font-bold px-1.5 py-0.5 rounded">PRO</span>}
                      </div>
                      <p className="text-xs text-brand-muted">{theme.category}</p>
                    </div>
                    <p className="text-brand-gold font-bold">৳{theme.price}</p>
                    <FaArrowRight className="text-brand-muted group-hover:text-brand-gold transition-colors" size={12} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}