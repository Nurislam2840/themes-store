"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";

export default function AdminFeaturesPage() {
  const { showAlert } = useAlert();
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", icon_name: "FaBolt", color_theme: "yellow" });

  const fetchFeatures = async () => {
    const { data } = await supabase.from("why_choose_us").select("*").order("order_index");
    if (data) setFeatures(data);
  };

  useEffect(() => { fetchFeatures(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("why_choose_us").insert([form]);
    if (error) showAlert("Error", "error");
    else { showAlert("Added!", "success"); setForm({ title: "", description: "", icon_name: "FaBolt", color_theme: "yellow" }); fetchFeatures(); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    await supabase.from("why_choose_us").delete().eq("id", id);
    fetchFeatures();
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium"><FaArrowLeft /> Back to Dashboard</Link>
        <h1 className="text-3xl font-extrabold text-white mb-8">Manage Why Choose Us</h1>

        <form onSubmit={handleAdd} className="bg-[#121214] border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]"><label className="block text-xs text-brand-muted mb-1">Title</label><input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" /></div>
          <div className="flex-1 min-w-[200px]"><label className="block text-xs text-brand-muted mb-1">Description</label><input type="text" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" /></div>
          <div className="w-28"><label className="block text-xs text-brand-muted mb-1">Icon</label>
            <select value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm">
              <option>FaBolt</option><option>FaShieldAlt</option><option>FaInfinity</option><option>FaHeadset</option>
            </select>
          </div>
          <button type="submit" className="bg-brand-gold text-black font-bold px-6 py-2 rounded-xl text-sm h-[38px]"><FaPlus /> Add</button>
        </form>

        <div className="space-y-3">
          {features.map(f => (
            <div key={f.id} className="bg-[#121214] border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <div><p className="text-white font-bold">{f.title}</p><p className="text-brand-muted text-sm">{f.description}</p></div>
              <button onClick={() => handleDelete(f.id)} className="text-red-400 hover:text-red-300"><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}