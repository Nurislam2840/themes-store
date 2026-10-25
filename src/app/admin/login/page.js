"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { 
  FaLock, FaSpinner, FaEnvelope, FaShieldAlt, 
  FaCrown, FaEye, FaEyeSlash, FaArrowLeft 
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // অলরেডি লগইন করা থাকলে সরাসরি অ্যাডমিন প্যানেলে পাঠাবে
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !session.user.is_anonymous) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
          
        if (profile?.role === "admin") {
          router.push("/admin");
        }
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // ইউজারের রোল চেক করা
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Access Denied. You do not have administrator privileges.");
      }

      // সফল লগইন
      router.push("/admin");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Animated Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Back to Home Button */}
      <Link href="/" className="absolute top-8 left-8 text-brand-muted hover:text-white flex items-center gap-2 text-sm transition-colors z-20">
        <FaArrowLeft size={12} /> Back to Store
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        {/* Top Security Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <FaShieldAlt size={10} /> Restricted Access Area
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#0E0E11]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Card Top Glow Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50"></div>

          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1C1C1F] to-[#0E0E11] border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner transform rotate-3">
                <FaLock className="text-brand-gold text-2xl transform -rotate-3" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-black shadow-lg border-2 border-[#0E0E11]">
                <FaCrown size={10} />
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              Admin <span className="text-transparent bg-clip-text bg-gold-gradient">Portal</span>
            </h1>
            <p className="text-brand-muted text-sm">
              Enter your credentials to access the control center.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <FaLock size={12} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Admin Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#050506]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all text-white text-sm placeholder:text-white/20"
                  placeholder="admin@themesstore.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-gold transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#050506]/50 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all text-white text-sm placeholder:text-white/20"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-70 text-black font-extrabold py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 mt-4 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2">
                {loading ? <FaSpinner className="animate-spin" /> : <FaLock size={14} />}
                {loading ? "Authenticating..." : "Secure Login"}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-2">
            <p className="text-[10px] text-brand-muted flex items-center justify-center gap-1.5">
              <FaShieldAlt className="text-brand-gold/50" /> 256-bit SSL Encrypted Connection
            </p>
            <p className="text-[10px] text-brand-muted/50">
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-brand-muted mt-6">
          &copy; {new Date().getFullYear()} ThemesStore. All rights reserved.
        </p>

      </motion.div>
    </div>
  );
}