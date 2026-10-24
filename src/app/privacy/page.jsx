"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaArrowLeft, FaShieldAlt, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("pages").select("content").eq("slug", "privacy").single();
      if (data) setContent(data.content);
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <main className="min-h-screen bg-[#09090B] relative overflow-hidden pt-32 pb-20 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Store
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6">
            <FaShieldAlt /> Legal Document
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gold-gradient">Policy</span>
          </h1>
        </motion.div>

        <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          {loading ? (
            <div className="flex justify-center py-10"><FaSpinner className="text-3xl text-brand-gold animate-spin" /></div>
          ) : (
            <div className="text-brand-muted leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {content}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}