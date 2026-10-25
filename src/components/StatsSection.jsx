"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import * as FaIcons from "react-icons/fa";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

const Counter = ({ to, duration = 2, suffix = "", decimals = 0 }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  useEffect(() => { if (inView) animate(count, Number(to), { duration, ease: "easeOut" }); }, [inView, count, to, duration]);
  return <span ref={nodeRef} className="flex items-baseline"><motion.span>{rounded}</motion.span><span>{suffix}</span></span>;
};

export default function StatsSection() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from("stats").select("*").order("order_index");
      if (data) setStats(data);
    };
    fetchStats();
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="w-full bg-white dark:bg-[#0C0C0E] border-y border-gray-100 dark:border-white/5 py-16 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-brand-gold/5 dark:bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none w-[800px] mx-auto h-[200px] top-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((stat, i) => {
            const Icon = FaIcons[stat.icon_name] || FaIcons.FaStar;
            return (
              <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-brand-gold text-3xl mb-4 group-hover:scale-110 group-hover:border-brand-gold/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
                  <Icon />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
                  <Counter to={Number(stat.value)} suffix={stat.suffix} decimals={Number(stat.decimals)} />
                </h3>
                <p className="text-gray-500 dark:text-brand-muted text-xs md:text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}