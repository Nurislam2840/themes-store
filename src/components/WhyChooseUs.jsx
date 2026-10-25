"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import * as FaIcons from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("why_choose_us").select("*").order("order_index");
      if (data) setFeatures(data);
    };
    fetchData();
  }, []);

  if (features.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Why Choose <span className="text-transparent bg-clip-text bg-gold-gradient">ThemesStore</span>
        </h2>
        <p className="text-gray-500 dark:text-brand-muted max-w-2xl mx-auto text-sm md:text-lg">We provide industry-leading digital products with unmatched quality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {features.map((feature, i) => {
          const Icon = FaIcons[feature.icon_name] || FaIcons.FaStar;
          // লাইট মোডে আইকনের ব্যাকগ্রাউন্ড হালকা, ডার্ক মোডে গাঢ়
          const bgClass = `bg-${feature.color_theme}-50 dark:bg-${feature.color_theme}-500/10`;
          const colorClass = `text-${feature.color_theme}-500 dark:text-${feature.color_theme}-400`;
          
          return (
            <motion.div key={feature.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group relative bg-white dark:bg-[#121214]/60 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-2xl"
            >
              <div className={`relative w-14 h-14 rounded-2xl ${bgClass} ${colorClass} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform border border-transparent group-hover:border-${feature.color_theme}-200`}>
                <Icon />
              </div>
              <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="relative text-gray-500 dark:text-brand-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}