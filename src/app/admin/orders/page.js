"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaSync, FaCheck, FaTimes, FaUser, FaEnvelope, FaPhone, FaClock, FaBoxOpen, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminOrdersPage() {
  const { showAlert } = useAlert();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    const { error } = await supabase.from("orders").update({ status: "approved" }).eq("id", id);
    if (!error) { showAlert("Order approved!", "success"); fetchOrders(); } 
    else showAlert("Failed to approve", "error");
    setProcessingId(null);
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    const { error } = await supabase.from("orders").update({ status: "rejected" }).eq("id", id);
    if (!error) { showAlert("Order rejected", "success"); fetchOrders(); } 
    else showAlert("Failed to reject", "error");
    setProcessingId(null);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    approved: orders.filter(o => o.status === "approved").length,
    rejected: orders.filter(o => o.status === "rejected").length,
  };

  const filteredOrders = orders
    .filter(o => filter === "all" ? true : o.status === filter)
    .filter(o => o.theme_title?.toLowerCase().includes(search.toLowerCase()) || o.customer_email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-2 text-sm font-medium"><FaArrowLeft /> Back to Dashboard</Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Manage Orders</h1>
            <p className="text-brand-muted text-sm mt-1">{orders.length} total orders</p>
          </div>
          <button onClick={fetchOrders} className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl font-semibold text-white transition-all flex items-center gap-2 text-sm"><FaSync /> Refresh</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { id: "all", label: "All Orders", count: stats.total, activeColor: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" },
            { id: "pending", label: "Pending", count: stats.pending, activeColor: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" },
            { id: "approved", label: "Approved", count: stats.approved, activeColor: "border-green-500/50 bg-green-500/10 text-green-400" },
            { id: "rejected", label: "Rejected", count: stats.rejected, activeColor: "border-red-500/50 bg-red-500/10 text-red-400" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} className={`p-4 rounded-2xl border transition-all text-left ${filter === tab.id ? tab.activeColor : "bg-[#121214] border-white/5 hover:border-white/10"}`}>
              <p className={`text-xs font-semibold mb-1 ${filter === tab.id ? "" : "text-brand-muted"}`}>{tab.label}</p>
              <p className={`text-2xl font-bold ${filter === tab.id ? "" : "text-white"}`}>{tab.count}</p>
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input type="text" placeholder="Search by theme or customer email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#121214] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-16 text-center"><FaBoxOpen className="text-6xl text-white/10 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">No orders found</h3><p className="text-brand-muted text-sm">Try changing the filter or search term.</p></div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1"><h3 className="text-lg font-bold text-white truncate">{order.theme_title}</h3><span className="text-xs font-bold bg-white/5 px-2 py-0.5 rounded text-brand-muted">৳{order.price}</span></div>
                    <p className="text-xs text-brand-muted font-mono">ID: {order.transaction_id}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start ${order.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : order.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{order.status.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm mb-4">
                  <div className="flex items-center gap-2 text-white truncate"><FaUser className="text-brand-gold text-xs" /> {order.customer_name}</div>
                  <div className="flex items-center gap-2 text-brand-muted truncate"><FaEnvelope className="text-brand-gold text-xs" /> {order.customer_email}</div>
                  <div className="flex items-center gap-2 text-brand-muted"><FaPhone className="text-brand-gold text-xs" /> {order.customer_phone || "N/A"}</div>
                  <div className="flex items-center gap-2 text-brand-muted text-xs"><FaClock className="text-brand-gold text-xs" /> {new Date(order.created_at).toLocaleString()}</div>
                </div>
                {order.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button onClick={() => handleApprove(order.id)} disabled={processingId === order.id} className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">{processingId === order.id ? "Processing..." : <><FaCheck /> Approve</>}</button>
                    <button onClick={() => handleReject(order.id)} disabled={processingId === order.id} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"><FaTimes /> Reject</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}