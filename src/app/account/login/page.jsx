"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { 
  FaLock, FaEnvelope, FaUserPlus, FaSignInAlt, 
  FaSpinner, FaCheckCircle, FaArrowLeft, FaShieldAlt 
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !session.user.is_anonymous) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
          
        if (profile?.role === "admin") {
          await supabase.auth.signOut();
          return;
        }
        
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect") || "/my-downloads";
        router.push(redirectUrl);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/my-downloads";

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();

        if (profile?.role === "admin") {
          await supabase.auth.signOut();
          throw new Error("This is an Admin account. Please use the Admin Login page.");
        }

        showAlert("Welcome back!", "success");
        router.push(redirectUrl);
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        showAlert("Account created! Please check your email to verify.", "success");
        setIsLogin(true);
      }
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Instant access to purchased themes",
    "Lifetime free updates",
    "24/7 premium support",
    "Secure & encrypted checkout",
  ];

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 lg:p-20 relative z-10 border-r border-white/5 bg-[#0C0C0E]">
        <Link href="/" className="flex items-center gap-2 group w-fit">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-300 rounded-xl flex items-center justify-center text-brand-dark font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">T</div>
          <span className="text-xl font-bold tracking-tight text-white">Themes<span className="text-brand-gold">Store</span></span>
        </Link>

        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Unlock Premium <br /><span className="text-transparent bg-clip-text bg-gold-gradient">Digital Assets</span>
          </h1>
          <p className="text-brand-muted text-lg mb-10 max-w-md">Join thousands of developers and businesses who trust our marketplace for high-quality themes.</p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xs"><FaCheckCircle /></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-brand-muted text-sm">
          <FaShieldAlt className="text-brand-gold" />
          <span>Trusted by 10,000+ customers worldwide</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          
          <div className="md:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-300 rounded-xl flex items-center justify-center text-brand-dark font-black text-xl">T</div>
              <span className="text-xl font-bold text-white">Themes<span className="text-brand-gold">Store</span></span>
            </Link>
          </div>

          <div className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
              <p className="text-brand-muted text-sm">{isLogin ? "Sign in to access your dashboard" : "Start your journey with us today"}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" placeholder="you@example.com" />
                </div>
              </div>
              
              <div>
                {/* Forgot Password Link Added Here */}
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider">Password</label>
                  {isLogin && <Link href="/account/forgot-password" className="text-xs text-brand-gold hover:underline transition-all">Forgot Password?</Link>}
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-70 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 mt-2">
                {loading ? <FaSpinner className="animate-spin" /> : isLogin ? <FaSignInAlt /> : <FaUserPlus />}
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-brand-muted text-sm">
                {isLogin ? "New to ThemesStore?" : "Already have an account?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-brand-gold font-semibold hover:underline transition">
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-white transition">
              <FaArrowLeft size={12} /> Back to Store
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}