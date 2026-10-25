"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import Link from "next/link";
import { FaEnvelope, FaArrowLeft, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden pt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        
        <Link href="/account/login" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-8 text-sm font-medium w-full">
          <FaArrowLeft /> Back to Login
        </Link>

        {success ? (
          <div className="py-10">
            <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <FaCheckCircle />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
            <p className="text-brand-muted text-sm mb-8">We have sent a password reset link to <span className="text-white font-semibold">{email}</span></p>
            <a href="https://mail.google.com" target="_blank" className="bg-brand-gold text-black font-bold py-3 px-8 rounded-xl inline-block w-full">Open Gmail</a>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <FaEnvelope />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-brand-muted text-sm mb-8">Enter your email address and we'll send you a link to reset your password.</p>

            <form onSubmit={handleReset} className="space-y-5 text-left">
              <div>
                <label className="block text-sm text-brand-muted mb-2">Email Address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold transition"
                  placeholder="you@example.com"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                {loading ? <FaSpinner className="animate-spin" /> : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}