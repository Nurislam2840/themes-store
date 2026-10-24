"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FaLock, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // সুপাবেজ URL থেকে এক্সেস টোকেন চেক করে
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // ইউজার রিসেট লিংকে ক্লিক করেছে
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/account/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 pt-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {success ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"><FaCheckCircle /></div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Updated!</h2>
            <p className="text-brand-muted text-sm">Your password has been changed. Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><FaLock /></div>
              <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
              <p className="text-brand-muted text-sm">Please enter your new strong password.</p>
            </div>

            {error && <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-brand-muted mb-2">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold" placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="block text-sm text-brand-muted mb-2">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold" placeholder="Repeat password" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-4">
                {loading ? <FaSpinner className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}