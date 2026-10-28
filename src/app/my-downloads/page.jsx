// src/app/my-downloads/page.jsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/AlertProvider"; // ✅ Alert Provider ইমপোর্ট
import { 
  FaDownload, FaSignOutAlt, FaBoxOpen, FaSpinner, 
  FaCheckCircle, FaShoppingBag, FaCrown, FaChartLine, FaArrowRight,
  FaHeadset, FaWhatsapp, FaHistory, FaCog
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function MyDownloadsPage() {
  const router = useRouter();
  const { showAlert } = useAlert(); // ✅ alert এর পরিবর্তে showAlert
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.is_anonymous) {
        router.push("/account/login?redirect=/my-downloads");
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (profile?.role === "admin") { await supabase.auth.signOut(); router.push("/account/login"); return; }

      setUser(session.user);

      const { data, error } = await supabase.from("orders").select("*").eq("user_id", session.user.id).eq("status", "approved").order("created_at", { ascending: false });

      if (!error && data) {
        const ordersWithTheme = await Promise.all(data.map(async (order) => {
          const { data: theme } = await supabase.from("themes").select("id, image_url, categories(name)").eq("slug", order.theme_slug).single();
          return { 
            ...order, 
            image_url: theme?.image_url, 
            category: theme?.categories?.name || "Theme" // ✅ category ফিক্স
          };
        }));
        setOrders(ordersWithTheme);
      }
      setLoading(false);
    };
    fetchData();
  }, [router]);

  const handleDownload = async (themeSlug) => {
    if (!themeSlug) return showAlert("Theme not found.", "error");
    setDownloading(themeSlug);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeSlug }),
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        showAlert(data.error || "Download failed. Please contact support.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong.", "error");
    }
    setDownloading(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center gap-4">
        <FaSpinner className="text-4xl text-brand-gold animate-spin" />
        <p className="text-brand-muted text-sm animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const userName = user?.email ? user.email.split("@")[0] : "Customer";
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-widest mb-3 border border-brand-gold/20">
              <FaCrown /> CUSTOMER DASHBOARD
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-brand-gold">{userName}</span>
            </h1>
            <p className="text-brand-muted text-sm mt-2">Manage your purchases and download your premium themes.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Link href="/" className="bg-white/5 border border-white/10 hover:border-brand-gold/50 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 backdrop-blur-md">
              <FaShoppingBag /> Store
            </Link>
            <Link href="/account/profile" className="bg-white/5 border border-white/10 hover:border-brand-gold/50 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 backdrop-blur-md">
              <FaCog /> Profile
            </Link>
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-md">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-[#121214] to-[#0A0A0C] border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-brand-gold/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold to-yellow-300 text-black flex items-center justify-center text-2xl font-bold shadow-lg">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider mb-1">Signed in as</p>
                <p className="text-white font-bold truncate text-sm">{user?.email}</p>
                <p className="text-green-400 text-[10px] flex items-center gap-1 mt-1"><FaCheckCircle size={8} /> Verified Account</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-yellow-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-3xl rounded-full group-hover:bg-yellow-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-10 h-10 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center text-lg"><FaDownload /></div>
              <FaChartLine className="text-white/10 text-lg" />
            </div>
            <p className="text-brand-muted text-[10px] font-semibold uppercase tracking-wider mb-1 relative z-10">Total Purchases</p>
            <p className="text-3xl font-extrabold text-white relative z-10">{orders.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-green-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl rounded-full group-hover:bg-green-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-10 h-10 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center text-lg"><FaShoppingBag /></div>
              <FaChartLine className="text-white/10 text-lg" />
            </div>
            <p className="text-brand-muted text-[10px] font-semibold uppercase tracking-wider mb-1 relative z-10">Total Spent</p>
            <p className="text-3xl font-extrabold text-white relative z-10">৳{totalSpent.toFixed(2)}</p>
          </motion.div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaBoxOpen className="text-brand-gold" /> Your Downloads ({orders.length})
            </h2>
            <Link href="/wishlist" className="text-sm text-brand-muted hover:text-brand-gold flex items-center gap-1 transition-colors">
              View Wishlist <FaArrowRight size={10} />
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-[#121214]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FaBoxOpen className="text-4xl text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No purchases yet</h3>
              <p className="text-brand-muted mb-6 max-w-sm mx-auto text-sm">You haven't purchased any themes yet. Browse our premium collection and get started.</p>
              <Link href="/" className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                Browse Themes <FaArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden group hover:border-brand-gold/30 transition-all flex flex-col relative">
                  
                  <div className="h-40 overflow-hidden relative">
                    {order.image_url ? (
                      <img src={order.image_url} alt={order.theme_title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <FaBoxOpen className="text-4xl text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <FaCheckCircle size={8} /> OWNED
                    </div>
                  </div>

                  <div className="p-5 pt-2 flex-grow">
                    <p className="text-[10px] text-brand-gold font-bold uppercase tracking-wider mb-1">{order.category}</p>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-gold transition-colors line-clamp-1">
                      {order.theme_title}
                    </h3>
                    <p className="text-[10px] text-brand-muted mb-3 flex items-center gap-1">
                      <FaHistory size={8} /> {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-brand-gold font-bold text-xl">৳{order.price}</p>
                      <p className="text-[9px] text-brand-muted font-mono truncate max-w-[100px]">ID: {order.transaction_id}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 border-t border-white/5">
                    <button 
                      onClick={() => handleDownload(order.theme_slug)} 
                      disabled={downloading === order.theme_slug}
                      className="w-full bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
                    >
                      {downloading === order.theme_slug ? (
                        <><FaSpinner className="animate-spin" /> Generating Link...</>
                      ) : (
                        <><FaDownload /> Download</>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-[#121214] to-[#0A0A0C] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-xl"><FaHeadset /></div>
            <div>
              <h3 className="text-white font-bold">Need Help?</h3>
              <p className="text-brand-muted text-sm">If you face any issue downloading your theme, contact us.</p>
            </div>
          </div>
          <a href="https://wa.me/8801758496622" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg">
            <FaWhatsapp size={18} /> WhatsApp Support
          </a>
        </div>

      </div>
    </div>
  );
}