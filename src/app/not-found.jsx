"use client";
import Link from "next/link";
import { FaHome, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* আইকন */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full animate-pulse"></div>
          <div className="relative w-full h-full bg-[#121214] border border-brand-gold/30 rounded-full flex items-center justify-center text-brand-gold text-4xl shadow-2xl">
            <FaExclamationTriangle />
          </div>
        </div>
        
        {/* 404 টেক্সট */}
        <h1 className="text-[120px] md:text-[160px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none tracking-tighter mb-4 select-none">
          4<span className="text-brand-gold">0</span>4
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-brand-muted max-w-md mx-auto mb-10 leading-relaxed">
          Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
        </p>

        {/* অ্যাকশন বাটন */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
          >
            <FaHome /> Back to Home
          </Link>
          <Link
            href="/themes"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <FaSearch /> Explore Themes
          </Link>
        </div>

        {/* বটম নোট */}
        <p className="mt-12 text-xs text-brand-muted/50 font-mono">
          Error Code: 404 | Requested URL not found
        </p>
      </motion.div>
    </div>
  );
}