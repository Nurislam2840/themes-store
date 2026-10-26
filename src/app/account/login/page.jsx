"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { 
  FaLock, FaEnvelope, FaUserPlus, FaSignInAlt, 
  FaSpinner, FaCheckCircle, FaArrowLeft, FaShieldAlt, 
  FaPhone, FaCalendarAlt 
} from "react-icons/fa";
import { motion } from "framer-motion";

const supabase = createClient();

export default function CustomerAuthPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // লগইন ফর্ম
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // রেজিস্ট্রেশন ফর্ম (আপনার চাহিদা অনুযায়ী সব ফিল্ড)
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: ""
  });

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

  // =============== লগইন হ্যান্ডলার ===============
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/my-downloads";

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      if (error) throw error;

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      if (profile?.role === "admin") {
        await supabase.auth.signOut();
        throw new Error("This is an Admin account. Please use the Admin Login page.");
      }

      showAlert("Welcome back!", "success");
      router.push(redirectUrl);
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // =============== রেজিস্ট্রেশন হ্যান্ডলার ===============
  const handleRegister = async (e) => {
    e.preventDefault();

    // ফ্রন্টএন্ড ভ্যালিডেশন
    if (registerForm.password !== registerForm.confirmPassword) {
      return showAlert("Passwords do not match", "error");
    }
    if (registerForm.password.length < 8) {
      return showAlert("Password must be at least 8 characters", "error");
    }
    if (registerForm.mobile.length < 10) {
      return showAlert("Please enter a valid mobile number", "error");
    }

    setLoading(true);

    try {
      // ১. Supabase Auth-এ ইউজার তৈরি
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            first_name: registerForm.firstName,
            last_name: registerForm.lastName,
            mobile: registerForm.mobile,
            date_of_birth: registerForm.dateOfBirth,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // ২. প্রোফাইল তৈরি ও ডেটা সেভ (registration এর সাথেই)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: authData.user.id,
          first_name: registerForm.firstName,
          last_name: registerForm.lastName,
          mobile: registerForm.mobile,
          date_of_birth: registerForm.dateOfBirth,
          role: "customer",
        });

      if (profileError) {
        console.error("Profile save error:", profileError);
        // Auth user তৈরি হয়েছে, শুধু প্রোফাইল সেভ হয়নি। তবুও ইউজারকে জানাই
        showAlert("Account created but profile save failed. Please contact support.", "error");
      } else {
        showAlert("Account created successfully! Please login.", "success");
      }

      // ফর্ম রিসেট করে লগইন ট্যাবে নিয়ে যাই
      setRegisterForm({ firstName: "", lastName: "", mobile: "", email: "", password: "", confirmPassword: "", dateOfBirth: "" });
      setIsLogin(true);
      
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Left Side Branding */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 lg:p-20 relative z-10 border-r border-white/5 bg-[#0C0C0E]">
        <Link href="/" className="flex items-center gap-2 group w-fit">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-300 rounded-xl flex items-center justify-center text-brand-dark font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">T</div>
          <span className="text-xl font-bold tracking-tight text-white">Themes<span className="text-brand-gold">Store</span></span>
        </Link>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Unlock Premium <br /><span className="text-transparent bg-clip-text bg-gold-gradient">Digital Assets</span>
          </h1>
          <p className="text-brand-muted text-lg mb-10 max-w-md">Join thousands of developers who trust our marketplace for high-quality themes.</p>
          <div className="space-y-4">
            {["Instant access to purchased themes", "Lifetime free updates", "24/7 premium support"].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xs"><FaCheckCircle /></div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-brand-muted text-sm">
          <FaShieldAlt className="text-brand-gold" />
          <span>Trusted by 10,000+ customers worldwide</span>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <div className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
              <p className="text-brand-muted text-sm">{isLogin ? "Sign in to access your dashboard" : "Fill in the details to get started"}</p>
            </div>

            {isLogin ? (
              // ============ LOGIN ============
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider">Password</label>
                    <Link href="/account/forgot-password" className="text-xs text-brand-gold hover:underline">Forgot Password?</Link>
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold" placeholder="••••••••" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-70 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2">
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              // ============ REGISTRATION ============
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">First Name</label>
                    <input type="text" value={registerForm.firstName} onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Last Name</label>
                    <input type="text" value={registerForm.lastName} onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Mobile Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input type="tel" value={registerForm.mobile} onChange={(e) => setRegisterForm({ ...registerForm, mobile: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="017XXXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Date of Birth</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input type="date" value={registerForm.dateOfBirth} onChange={(e) => setRegisterForm({ ...registerForm, dateOfBirth: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="Min 8 characters" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input type="password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} required className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="Repeat password" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-70 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2">
                  {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-brand-muted text-sm">
                {isLogin ? "New to ThemesStore?" : "Already have an account?"}{" "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-brand-gold font-semibold hover:underline">
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-white">
              <FaArrowLeft size={12} /> Back to Store
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}