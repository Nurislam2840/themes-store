"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FaCheck, FaCrown, FaRocket, FaGem, FaArrowRight, FaSpinner, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase.from("pricing_plans").select("*").order("created_at", { ascending: true });
      if (data) {
        setPlans(data);
        const popular = data.find(p => p.is_popular);
        setSelectedPlan(popular ? popular.name : (data[0]?.name || ""));
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>;
  }

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
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative rounded-[2rem] p-8 bg-[#121214]/80 backdrop-blur-xl border cursor-pointer transition-all duration-300 ${
                  plan.is_popular
                    ? "border-brand-gold/50 shadow-[0_0_50px_rgba(245,158,11,0.1)] scale-[1.03] z-10"
                    : isSelected ? "border-brand-gold shadow-[0_0_50px_rgba(245,158,11,0.15)] scale-[1.03] z-10" : "border-white/5 hover:border-white/20"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-gold to-yellow-300 text-black text-xs font-extrabold px-6 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-2xl bg-brand-gold/10 text-brand-gold`}>
                  {plan.name.includes("Single") ? <FaGem /> : plan.name.includes("Bundle") ? <FaCrown /> : <FaRocket />}
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
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-brand-gold/10 text-brand-gold`}>
                        <FaCheck size={8} />
                      </div>
                      <span className="text-brand-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/themes"
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
      </div>
    </div>
  );
}