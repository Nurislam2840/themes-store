// src/app/admin/stats/page.jsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaSave, FaTimes, FaEdit } from "react-icons/fa";
import CustomSelect from "@/components/ui/CustomSelect"; // ✅ কাস্টম সিলেক্ট

export default function AdminStatsPage() {
  const { showAlert } = useAlert();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ 
    label: "", value: "", suffix: "", decimals: 0, icon_name: "FaStar", order_index: 0 
  });

  const fetchStats = async () => {
    setLoading(true);
    const { data } = await supabase.from("stats").select("*").order("order_index");
    if (data) setStats(data);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const statData = { 
      label: form.label, 
      value: parseFloat(form.value), 
      suffix: form.suffix, 
      decimals: parseInt(form.decimals), 
      icon_name: form.icon_name, 
      order_index: parseInt(form.order_index) 
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from("stats").update(statData).eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("stats").insert([statData]);
      error = insertError;
    }

    if (error) {
      showAlert("Error: " + error.message, "error");
    } else {
      showAlert(editingId ? "Stat updated!" : "Stat added!", "success");
      resetForm();
      fetchStats();
    }
  };

  const handleEdit = (stat) => {
    setEditingId(stat.id);
    setForm({
      label: stat.label, value: stat.value, suffix: stat.suffix || "",
      decimals: stat.decimals || 0, icon_name: stat.icon_name || "FaStar",
      order_index: stat.order_index || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ label: "", value: "", suffix: "", decimals: 0, icon_name: "FaStar", order_index: 0 });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this stat?")) return;
    await supabase.from("stats").delete().eq("id", id);
    if (editingId === id) resetForm();
    fetchStats();
  };

  // ✅ আইকন অপশনগুলো
  const iconOptions = [
    { value: "FaLayerGroup", label: "Layers (FaLayerGroup)" },
    { value: "FaUsers", label: "Users (FaUsers)" },
    { value: "FaDownload", label: "Download (FaDownload)" },
    { value: "FaStar", label: "Star (FaStar)" },
    { value: "FaHeart", label: "Heart (FaHeart)" },
    { value: "FaRocket", label: "Rocket (FaRocket)" },
    { value: "FaAward", label: "Award (FaAward)" },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Manage Stats Section</h1>
          <p className="text-brand-muted text-sm mt-2">Add, edit, or delete homepage number counters.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">{editingId ? "Edit Stat" : "Add New Stat"}</h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-xs text-brand-muted hover:text-white flex items-center gap-1">
                <FaTimes /> Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-xs text-brand-muted mb-2">Label</label>
              <input type="text" required value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="Premium Themes" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-2">Value (Number)</label>
              <input type="number" step="0.1" required value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="500" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-2">Suffix (e.g. +, k+)</label>
              <input type="text" value={form.suffix} onChange={e => setForm({...form, suffix: e.target.value})} placeholder="+" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-xs text-brand-muted mb-2">Decimals (0 or 1)</label>
              <input type="number" min="0" max="2" value={form.decimals} onChange={e => setForm({...form, decimals: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-2">Icon</label>
              {/* ✅ CustomSelect ব্যবহার */}
              <CustomSelect
                options={iconOptions}
                value={form.icon_name}
                onChange={(val) => setForm({ ...form, icon_name: val })}
                placeholder="Select Icon"
              />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-2">Order</label>
              <input type="number" value={form.order_index} onChange={e => setForm({...form, order_index: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
          </div>

          <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 text-sm">
            {editingId ? <FaSave /> : <FaPlus />} {editingId ? "Update Stat" : "Add Stat"}
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="space-y-3">
            {stats.map(stat => (
              <div key={stat.id} className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-gold font-bold">
                    {stat.icon_name.charAt(2)}
                  </div>
                  <div>
                    <p className="text-white font-bold">{stat.value}{stat.suffix} <span className="text-brand-muted font-normal text-sm ml-1">{stat.label}</span></p>
                    <p className="text-xs text-brand-muted">Order: {stat.order_index} • Icon: {stat.icon_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(stat)} className="w-9 h-9 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => handleDelete(stat.id)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}