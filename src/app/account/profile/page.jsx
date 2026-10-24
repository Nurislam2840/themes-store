"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaLock, FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.is_anonymous) {
        router.push("/account/login");
        return;
      }
      setUser(session.user);
      
      // প্রোফাইল ডেটা আনা
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (data) {
        setName(data.full_name || "");
        setPhone(data.phone || "");
      }
    };
    fetchUser();
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    // নাম ও ফোন আপডেট
    const { error: profileError } = await supabase.from("profiles").update({ full_name: name, phone }).eq("id", user.id);
    
    // পাসওয়ার্ড আপডেট (যদি দেওয়া থাকে)
    if (newPassword) {
      if (newPassword.length < 8) {
        setLoading(false);
        return setMsg({ type: "error", text: "Password must be at least 8 characters" });
      }
      const { error: passError } = await supabase.auth.updateUser({ password: newPassword });
      if (passError) {
        setLoading(false);
        return setMsg({ type: "error", text: passError.message });
      }
      setNewPassword("");
    }

    setLoading(false);
    if (profileError) setMsg({ type: "error", text: profileError.message });
    else setMsg({ type: "success", text: "Profile updated successfully!" });
  };

  if (!user) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <Link href="/my-downloads" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-6 text-sm font-medium">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121214] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold to-yellow-300 text-black flex items-center justify-center text-2xl font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-brand-muted text-sm">{user.email}</p>
            </div>
          </div>

          {msg.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm text-center ${msg.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-brand-muted mb-2">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="Your Name" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-brand-muted mb-2">Phone Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="017XXXXXXXX" />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FaLock className="text-brand-gold" /> Security</h3>
              <div>
                <label className="block text-sm text-brand-muted mb-2">New Password (Leave blank to keep current)</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="Min 8 characters" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
              <FaSave /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}