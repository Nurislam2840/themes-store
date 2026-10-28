// src/app/admin/page.js
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaSignOutAlt, FaLayerGroup, FaShoppingCart, FaStar, 
  FaHome, FaPlus, FaArrowRight, FaCrown, FaDollarSign, 
  FaUsers, FaBoxOpen, FaClock, FaCheckCircle, FaChartLine,
  FaCog, FaTag, FaFileAlt, FaImage, FaChartBar, FaList, FaBars, FaChartPie
} from "react-icons/fa";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ themes: 0, totalOrders: 0, pendingOrders: 0, reviews: 0, revenue: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]); // ✅ চার্ট ডেটা

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.is_anonymous) { router.push("/admin/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") { await supabase.auth.signOut(); router.push("/admin/login"); return; }
      setUser(user);

      const [ themesCount, ordersCount, pendingCount, reviewsCount, revenueData, customersData, recentOrdersData, allOrdersData ] = await Promise.all([
        supabase.from("themes").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("price").eq("status", "approved"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("orders").select("price, created_at").eq("status", "approved") // ✅ চার্টের জন্য সব অর্ডার
      ]);

      const totalRevenue = (revenueData.data || []).reduce((sum, o) => sum + Number(o.price || 0), 0);

      setStats({
        themes: themesCount.count || 0, totalOrders: ordersCount.count || 0, pendingOrders: pendingCount.count || 0,
        reviews: reviewsCount.count || 0, revenue: totalRevenue, customers: customersData.count || 0,
      });
      setRecentOrders(recentOrdersData.data || []);

      // ✅ গত ৭ দিনের রেভিনিউ চার্ট ডেটা তৈরি
      if (allOrdersData.data) {
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const chartDataFormatted = last7Days.map(date => {
          const dayOrders = allOrdersData.data.filter(o => o.created_at.startsWith(date));
          const revenue = dayOrders.reduce((sum, o) => sum + Number(o.price), 0);
          return {
            name: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            revenue: revenue
          };
        });
        setChartData(chartDataFormatted);
      }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/admin/login"); };

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#09090B] pt-10 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/5 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-widest mb-4 border border-brand-gold/20"><FaCrown /> SUPER ADMIN</div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">Dashboard</h1>
            <p className="text-brand-muted">Welcome back, <span className="text-white font-medium">{user?.email}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-white/5 border border-white/10 hover:border-brand-gold/50 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2"><FaHome /> View Store</Link>
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"><FaSignOutAlt /> Logout</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative bg-gradient-to-br from-brand-gold/15 via-[#121214] to-[#121214] border border-brand-gold/30 rounded-3xl p-6 overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10"><div className="w-12 h-12 bg-brand-gold text-black rounded-2xl flex items-center justify-center text-xl"><FaDollarSign /></div><FaChartLine className="text-brand-gold/30 text-xl" /></div>
            <p className="text-brand-muted text-xs font-semibold uppercase mb-1 relative z-10">Total Revenue</p>
            <p className="text-3xl md:text-4xl font-extrabold text-brand-gold relative z-10">৳{stats.revenue.toFixed(2)}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10"><div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-xl"><FaShoppingCart /></div><FaChartLine className="text-white/10 text-xl" /></div>
            <p className="text-brand-muted text-xs font-semibold uppercase mb-1 relative z-10">Total Orders</p>
            <p className="text-3xl md:text-4xl font-extrabold text-white relative z-10">{stats.totalOrders}</p>
            <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1"><FaClock size={10} /> {stats.pendingOrders} pending</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10"><div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center text-xl"><FaUsers /></div><FaChartLine className="text-white/10 text-xl" /></div>
            <p className="text-brand-muted text-xs font-semibold uppercase mb-1 relative z-10">Customers</p>
            <p className="text-3xl md:text-4xl font-extrabold text-white relative z-10">{stats.customers}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10"><div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center text-xl"><FaLayerGroup /></div><FaChartLine className="text-white/10 text-xl" /></div>
            <p className="text-brand-muted text-xs font-semibold uppercase mb-1 relative z-10">Total Themes</p>
            <p className="text-3xl md:text-4xl font-extrabold text-white relative z-10">{stats.themes}</p>
          </motion.div>
        </div>

        {/* ✅ Revenue Chart Section */}
        <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaChartBar className="text-brand-gold" /> Revenue (Last 7 Days)</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#F59E0B', fontWeight: 'bold' }}
                  formatter={(value) => [`৳${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-[#121214] border border-white/5 rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div><h2 className="text-lg font-bold text-white">Recent Orders</h2></div>
              <Link href="/admin/orders" className="text-brand-gold text-xs font-semibold hover:underline flex items-center gap-1">View All <FaArrowRight size={8} /></Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-16"><FaBoxOpen className="text-5xl text-white/10 mx-auto mb-3" /><p className="text-brand-muted text-sm">No orders yet</p></div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${order.status === "approved" ? "bg-green-500/20 text-green-400" : order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{order.status === "approved" ? <FaCheckCircle /> : <FaClock />}</div>
                      <div className="min-w-0"><p className="text-sm font-semibold text-white truncate">{order.theme_title}</p><p className="text-xs text-brand-muted truncate">{order.customer_email}</p></div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3"><p className="text-sm font-bold text-brand-gold">৳{order.price}</p><p className="text-[10px] text-brand-muted">{new Date(order.created_at).toLocaleDateString('en-GB')}</p></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <Link href="/admin/orders" className="block bg-gradient-to-br from-yellow-500/10 to-[#121214] border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-500/50 transition-colors group">
              <div className="flex items-center justify-between mb-3"><div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center"><FaClock /></div><FaArrowRight className="text-white/20 group-hover:text-yellow-400" /></div>
              <p className="text-xs text-brand-muted uppercase mb-1">Action Required</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingOrders} Pending Orders</p>
            </Link>
            <Link href="/admin/reviews" className="block bg-gradient-to-br from-purple-500/10 to-[#121214] border border-purple-500/20 rounded-3xl p-6 hover:border-purple-500/50 transition-colors group">
              <div className="flex items-center justify-between mb-3"><div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center"><FaStar /></div><FaArrowRight className="text-white/20 group-hover:text-purple-400" /></div>
              <p className="text-xs text-brand-muted uppercase mb-1">Community</p>
              <p className="text-2xl font-bold text-white">{stats.reviews} Reviews</p>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link href="/admin/themes" className="group bg-[#121214] border border-white/5 hover:border-brand-gold/50 rounded-2xl p-6 flex items-center gap-4 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform"><FaPlus /></div>
            <div><h3 className="font-bold text-white">Manage Themes</h3><p className="text-brand-muted text-xs">Add / edit themes</p></div>
          </Link>
          <Link href="/admin/categories" className="group bg-[#121214] border border-white/5 hover:border-teal-500/50 rounded-2xl p-6 flex items-center gap-4 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform"><FaLayerGroup /></div>
            <div><h3 className="font-bold text-white">Manage Categories</h3><p className="text-brand-muted text-xs">Main & Sub categories</p></div>
          </Link>
          <Link href="/admin/orders" className="group bg-[#121214] border border-white/5 hover:border-yellow-500/50 rounded-2xl p-6 flex items-center gap-4 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform"><FaShoppingCart /></div>
            <div><h3 className="font-bold text-white">Manage Orders</h3><p className="text-brand-muted text-xs">Approve purchases</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
}