"use client";
import { FaLayerGroup, FaUsers, FaDownload, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { icon: <FaLayerGroup />, value: "500+", label: "Premium Themes" },
    { icon: <FaUsers />, value: "10k+", label: "Happy Customers" },
    { icon: <FaDownload />, value: "50k+", label: "Total Downloads" },
    { icon: <FaStar />, value: "4.9/5", label: "Average Rating" },
  ];

  return (
    <section className="w-full bg-[#0C0C0E] border-y border-white/5 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold text-3xl mb-4 group-hover:scale-110 group-hover:border-brand-gold/50 transition-all">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</h3>
              <p className="text-brand-muted text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}