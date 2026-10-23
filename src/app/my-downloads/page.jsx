"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaDownload, FaSignOutAlt, FaUser, FaBoxOpen, 
  FaSpinner, FaCheckCircle, FaShoppingBag, 
  FaCrown, FaChartLine, FaArrowRight 
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function MyDownloadsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.is_anonymous) {
        router.push("/account/login?redirect=/my-downloads");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
        
      if (profile?.role === "admin") {
        await supabase.auth.signOut();
        router.push("/account/login");
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // প্রতিটি অর্ডারের থিমের ডাউনলোড লিংক আলাদাভাবে বের করা
        const ordersWithLinks = await Promise.all(data.map(async (order) => {
          const { data: theme } = await supabase
            .from("themes")
            .select("download_url, image_url")
            .eq("slug", order.theme_slug)
            .single();
          return { ...order, download_url: theme?.download_url, image_url: theme?.image_url };
        }));
        setOrders(ordersWithLinks);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [router]);

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

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-widest mb-3 border border-brand-gold/20">
              <FaCrown /> CUSTOMER DASHBOARD
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-brand-gold">{userName}</span>
            </h1>
            <p className="text-brand-muted text-sm mt-2">Manage your purchases and download your premium themes.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-white/5 border border-white/10 hover:border-brand-gold/50 hover:bg-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 backdrop-blur-md">
              <FaShoppingBag /> Store
            </Link>
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-md">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-brand-gold/30 transition-colors flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold to-yellow-300 text-black flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider mb-1">Account</p>
              <p className="text-white font-bold truncate text-sm">{user?.email}</p>
              <p className="text-green-400 text-xs flex items-center gap-1 mt-1">
                <FaCheckCircle size={10} /> Verified
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-yellow-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-3xl rounded-full group-hover:bg-yellow-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center text-xl">
                <FaDownload />
              </div>
              <FaChartLine className="text-white/10 text-xl" />
            </div>
            <p className="text-brand-muted text-xs font-semibold uppercase tracking-wider mb-1 relative z-10">Total Purchases</p>
            <p className="text-3xl font-extrabold text-white relative z-10">{orders.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-green-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl rounded-full group-hover:bg-green-500/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center text-xl">
                <FaShoppingBag />
              </div>
              <FaChartLine className="text-white/10 text-xl" />
            </div>
            <p className="text-brand-muted text-xs font-semibold uppercase tracking-wider mb-1 relative z-10">Total Spent</p>
            <p className="text-3xl font-extrabold text-white relative z-10">${totalSpent.toFixed(2)}</p>
          </motion.div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaBoxOpen className="text-brand-gold" /> Your Downloads
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-[#121214]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FaBoxOpen className="text-4xl text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No purchases yet</h3>
              <p className="text-brand-muted mb-6 max-w-sm mx-auto text-sm">
                You haven't purchased any themes yet. Browse our premium collection and get started.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-black font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                Browse Themes <FaArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                  className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden group hover:border-brand-gold/30 transition-all flex flex-col relative">
                  
                  <div className="p-6 pb-4 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center text-xl border border-green-500/20">
                        <FaCheckCircle />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-brand-muted uppercase tracking-wider">Order ID</p>
                        <p className="text-xs text-brand-muted font-mono">{order.transaction_id}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-gold transition-colors line-clamp-1">
                      {order.theme_title}
                    </h3>
                    <p className="text-xs text-brand-muted mb-4 flex items-center gap-2">
                      Purchased: {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    
                    <div className="flex items-end justify-between mb-2">
                      <p className="text-brand-gold font-bold text-2xl">
                        ${order.price}
                      </p>
                      <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded-md border border-green-500/20">
                        PAYMENT VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 border-t border-white/5">
                    <a 
                      href={order.download_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!order.download_url) {
                          e.preventDefault();
                          alert("Download link not available yet. Please contact support.");
                        }
                      }}
                      className="w-full bg-brand-gold/10 hover:bg-brand-gold hover:text-black text-brand-gold font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-brand-gold/20 group/btn"
                    >
                      <FaDownload className="group-hover/btn:animate-bounce" /> Download Theme
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}