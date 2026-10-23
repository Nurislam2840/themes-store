"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaCode, FaReact, FaWordpress, FaHtml5, FaLayerGroup } from "react-icons/fa";

export default function NavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "All Themes", icon: <FaLayerGroup />, href: "/themes", color: "text-brand-gold" },
    { name: "Next.js Themes", icon: <FaCode />, href: "/themes?category=Next.js", color: "text-white" },
    { name: "React Themes", icon: <FaReact />, href: "/themes?category=React", color: "text-cyan-400" },
    { name: "WordPress Themes", icon: <FaWordpress />, href: "/themes?category=WordPress", color: "text-blue-400" },
    { name: "HTML/CSS Templates", icon: <FaHtml5 />, href: "/themes?category=HTML", color: "text-orange-400" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors ${
          isOpen ? "text-brand-gold" : "text-brand-muted hover:text-white"
        }`}
      >
        Themes
        <FaChevronDown size={10} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-[#121214]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
          >
            <div className="px-4 py-2 mb-2 border-b border-white/5">
              <p className="text-[10px] text-brand-muted uppercase tracking-widest font-bold">Browse Categories</p>
            </div>
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="font-medium">{cat.name}</span>
              </Link>
            ))}
            <div className="mt-2 px-4 py-2 border-t border-white/5">
              <Link href="/themes" onClick={() => setIsOpen(false)} className="text-xs text-brand-gold hover:underline">
                View All Themes &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}