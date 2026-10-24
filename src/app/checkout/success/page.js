"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { FaCheckCircle, FaDownload, FaSpinner, FaBoxOpen, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const clearCart = useCartWishlistStore((s) => s.clearCart);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
    const fetchOrder = async () => {
      if (tranId) {
        const { data } = await supabase.from("orders").select("*").eq("transaction_id", tranId).single();
        setOrder(data);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [tranId, clearCart]);

  if (loading) return <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-4"><FaSpinner className="text-4xl text-brand-gold animate-spin" /><p className="text-brand-muted text-sm">Verifying your order...</p></div>;

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-brand-card border border-brand-border rounded-3xl p-10 text-center shadow-2xl relative z-10">
        <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"><FaCheckCircle /></div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Payment Successful!</h2>
        <p className="text-brand-muted mb-8 leading-relaxed text-sm">Your order has been confirmed and the themes are now available in your dashboard.</p>

        {order && (
          <div className="bg-brand-dark border border-white/5 rounded-2xl p-4 mb-8 text-left">
            <div className="flex items-center gap-2 mb-2"><FaBoxOpen className="text-brand-gold" /><span className="text-xs text-brand-muted">Order Details</span></div>
            <p className="text-white font-semibold truncate mb-1">{order.theme_title}</p>
            <div className="flex justify-between text-xs text-brand-muted">
              <span>Order ID: {order.transaction_id}</span>
              <span className="text-brand-gold font-bold">৳{order.price}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/my-downloads" className="w-full bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"><FaDownload /> Go to My Downloads</Link>
          <Link href="/" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">Continue Shopping <FaArrowRight size={12} /></Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}