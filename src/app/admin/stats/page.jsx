"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function AdminStatsPage() {
  const { showAlert } = useAlert();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ label: "", value: "", suffix: "", decimals: 0, icon_name: "FaStar", order_index: 0 });

  const fetchStats = async () => {
    setLoading(true);
    const { data } = await supabase.from("stats").select("*").order("order_index");
    if (data) setStats(data);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("stats").insert([{ ...form, value: parseFloat(form.value) }]);
    if (error) showAlert("Error", "error");
    else { showAlert("Added!", "success"); setForm({ label: "", value: "", suffix: "", decimals: 0, icon_name: "FaStar", order_index: 0 }); fetchStats(); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    await supabase.from("stats").delete().eq("id", id);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium"><FaArrowLeft /> Back to Dashboard</Link>
        <h1 className="text-3xl font-extrabold text-white mb-8">Manage Stats Section</h1>

        <form onSubmit={handleAdd} className="bg-[#121214] border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]"><label className="block text-xs text-brand-muted mb-1">Label</label><input type="text" required value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" /></div>
          <div className="w-24"><label className="block text-xs text-brand-muted mb-1">Value</label><input type="number" step="0.1" required value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" /></div>
          <div className="w-24"><label className="block text-xs text-brand-muted mb-1">Suffix</label><input type="text" value={form.suffix} onChange={e => setForm({...form, suffix: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" /></div>
          <div className="w-28"><label className="block text-xs text-brand-muted mb-1">Icon</label>
            <select value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm">
              <option>FaLayerGroup</option><option>FaUsers</option><option>FaDownload</option><option>FaStar</option>
            </select>
          </div>
          <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-6 py-2 rounded-xl text-sm h-[38px]"><FaPlus /> Add</button>
        </form>

        <div className="space-y-3">
          {stats.map(stat => (
            <div key={stat.id} className="bg-[#121214] border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <div className="flex gap-4 text-sm text-white"><span className="font-bold">{stat.value}{stat.suffix}</span> <span className="text-brand-muted">{stat.label}</span></div>
              <button onClick={() => handleDelete(stat.id)} className="text-red-400 hover:text-red-300"><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}