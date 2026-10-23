"use client";
import { useState } from "react";
import Link from "next/link";
import { FaCheck, FaCrown, FaRocket, FaGem, FaArrowRight, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState("Bundle Pack");

  const plans = [
    {
      id: "single",
      name: "Single Theme",
      price: "$49",
      description: "Perfect for personal or small-scale projects.",
      icon: <FaGem />,
      features: ["1 Premium Theme", "Lifetime Free Updates", "6 Months Support", "Personal License"],
      href: "/themes",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      id: "bundle",
      name: "Bundle Pack",
      price: "$199",
      description: "Best value for developers and agencies.",
      icon: <FaCrown />,
      features: ["Access to 5 Themes", "Lifetime Free Updates", "1 Year Priority Support", "Commercial License", "Figma Files Included"],
      href: "/themes",
      highlighted: true,
      color: "text-brand-gold",
      bg: "bg-brand-gold/10",
    },
    {
      id: "lifetime",
      name: "Lifetime Access",
      price: "$499",
      description: "Unlimited access to everything, forever.",
      icon: <FaRocket />,
      features: ["All Current & Future Themes", "Lifetime Priority Support", "Unlimited Commercial Use", "Custom Dev Discounts"],
      href: "/contact",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] relative overflow-hidden pt-32 pb-20 px-6">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gold-gradient">Pricing</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Choose the plan that scales with your business. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.name;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative rounded-[2rem] p-8 bg-[#121214]/80 backdrop-blur-xl border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-brand-gold shadow-[0_0_50px_rgba(245,158,11,0.15)] scale-[1.03] z-10"
                    : "border-white/5 hover:border-white/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-gold to-yellow-300 text-black text-xs font-extrabold px-6 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-2xl ${plan.bg} ${plan.color}`}>
                  {plan.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-brand-muted text-sm mb-6 h-10">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-white/5">
                  <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-brand-muted text-sm">/one-time</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.bg} ${plan.color}`}>
                        <FaCheck size={8} />
                      </div>
                      <span className="text-brand-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all ${
                    isSelected
                      ? "bg-brand-gold text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {isSelected ? "Selected" : "Choose Plan"} 
                  {isSelected ? <FaLock size={12} /> : <FaArrowRight size={12} />}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <p className="text-brand-muted text-sm">
            Need a custom solution? <Link href="/contact" className="text-brand-gold font-semibold hover:underline">Contact Sales</Link>
          </p>
        </div>
      </div>
    </div>
  );
}