"use client";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

export default function SlidingFeatures({ features }) {
  if (!features || features.length === 0) {
    return <p className="text-brand-muted text-sm">No features listed.</p>;
  }

  // প্যারেন্ট কন্টেইনার অ্যানিমেশন (Stagger)
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // প্রতিটি ফিচারের মাঝে ১৫০ms গ্যাপ
      }
    }
  };

  // প্রতিটি আইটেমের বাম দিক থেকে স্লাইড হওয়ার অ্যানিমেশন
  const item = {
    hidden: { opacity: 0, x: -40 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring", stiffness: 200, damping: 20 } 
    }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" // পেজ লোড হলে সাথেই স্লাইড শুরু হবে
      className="space-y-3"
    >
      {features.map((feature, i) => (
        <motion.div 
          key={i} 
          variants={item}
          className="flex items-center gap-3 bg-[#09090B] border border-white/5 p-4 rounded-xl hover:border-brand-gold/30 hover:bg-white/5 transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <FaCheckCircle size={12} />
          </div>
          <span className="text-white text-sm font-medium">{feature}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}