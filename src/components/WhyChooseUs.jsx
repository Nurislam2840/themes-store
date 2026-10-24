"use client";
import { FaBolt, FaShieldAlt, FaInfinity, FaHeadset } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const features = [
    { icon: <FaBolt />, title: "Lightning Fast", desc: "Optimized for Core Web Vitals with 90+ performance scores." },
    { icon: <FaShieldAlt />, title: "Secure Payment", desc: "256-bit SSL encryption powered by SSLCommerz." },
    { icon: <FaInfinity />, title: "Lifetime Updates", desc: "Buy once and get free updates forever." },
    { icon: <FaHeadset />, title: "24/7 Support", desc: "Dedicated support team ready to help you anytime." },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          Why Choose <span className="text-transparent bg-clip-text bg-gold-gradient">ThemesStore</span>
        </h2>
        <p className="text-brand-muted max-w-2xl mx-auto">We provide industry-leading digital products with unmatched quality and support.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-[#121214] border border-white/5 rounded-3xl p-8 hover:border-brand-gold/30 hover:bg-white/[0.02] transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-black transition-all">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-brand-muted text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}