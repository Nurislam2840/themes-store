"use client";
import Link from "next/link";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ErrorPage({ error, reset }) {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10 max-w-lg"
      >
        <div className="w-24 h-24 mx-auto mb-8 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 text-4xl">
          <FaExclamationTriangle />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Something went <span className="text-red-400">wrong</span>
        </h1>
        <p className="text-brand-muted max-w-md mx-auto mb-10 leading-relaxed">
          We encountered an unexpected error. Please try again or head back to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => reset()}
            className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <FaRedo /> Try Again
          </button>
          <Link href="/" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2">
            <FaHome /> Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}