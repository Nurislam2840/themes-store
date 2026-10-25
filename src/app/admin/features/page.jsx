"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaSave, FaTimes, FaEdit, FaBolt, FaShieldAlt, FaInfinity, FaHeadset } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFeaturesPage() {
  const { showAlert } = useAlert();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({ 
    title: "", description: "", icon_name: "FaBolt", color_theme: "yellow", order_index: 0 
  });

  const fetchFeatures = async () => {
    setLoading(true);
    const { data } = await supabase.from("why_choose_us").select("*").order("order_index");
    if (data) setFeatures(data);
    setLoading(false);
  };

  useEffect(() => { fetchFeatures(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const featureData = {
      title: form.title, description: form.description,
      icon_name: form.icon_name, color_theme: form.color_theme,
      order_index: parseInt(form.order_index) || 0
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from("why_choose_us").update(featureData).eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("why_choose_us").insert([featureData]);
      error = insertError;
    }

    if (error) {
      showAlert("Error: " + error.message, "error");
    } else {
      showAlert(editingId ? "Feature updated!" : "Feature added!", "success");
      resetForm();
      fetchFeatures();
    }
  };

  const handleEdit = (feature) => {
    setEditingId(feature.id);
    setForm({
      title: feature.title, description: feature.description,
      icon_name: feature.icon_name || "FaBolt", 
      color_theme: feature.color_theme || "yellow",
      order_index: feature.order_index || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", description: "", icon_name: "FaBolt", color_theme: "yellow", order_index: 0 });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this feature?")) return;
    await supabase.from("why_choose_us").delete().eq("id", id);
    if (editingId === id) resetForm();
    fetchFeatures();
  };

  // আইকন এবং কালার প্রিভিউ দেখানোর জন্য
  const getIconPreview = (iconName) => {
    switch(iconName) {
      case 'FaBolt': return <FaBolt />;
      case 'FaShieldAlt': return <FaShieldAlt />;
      case 'FaInfinity': return <FaInfinity />;
      case 'FaHeadset': return <FaHeadset />;
      default: return <FaBolt />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Manage Features</h1>
          <p className="text-brand-muted text-sm mt-2">Edit the "Why Choose Us" section on the homepage.</p>
        </div>

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">{editingId ? "Edit Feature" : "Add New Feature"}</h3>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-xs text-brand-muted hover:text-white flex items-center gap-1">
                <FaTimes /> Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs text-brand-muted mb-2">Title</label>
              <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Lightning Fast" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-2">Order (1 = first)</label>
              <input type="number" value={form.order_index} onChange={e => setForm({...form, order_index: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs text-brand-muted mb-2">Description</label>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="2" placeholder="Optimized for Core Web Vitals..." className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs text-brand-muted mb-2">Icon</label>
              <div className="flex items-center gap-3">
                <select value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold">
                  <option value="FaBolt">Bolt (Lightning)</option>
                  <option value="FaShieldAlt">Shield (Security)</option>
                  <option value="FaInfinity">Infinity (Lifetime)</option>
                  <option value="FaHeadset">Headset (Support)</option>
                </select>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold text-xl flex-shrink-0">
                  {getIconPreview(form.icon_name)}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-2">Color Theme</label>
              <select value={form.color_theme} onChange={e => setForm({...form, color_theme: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold">
                <option value="yellow">Yellow / Gold</option>
                <option value="green">Green</option>
                <option value="cyan">Cyan / Blue</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 text-sm">
            {editingId ? <FaSave /> : <FaPlus />} {editingId ? "Update Feature" : "Add Feature"}
          </button>
        </form>

        {/* Features List */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="space-y-3">
            {features.map(feature => (
              <div key={feature.id} className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${feature.color_theme}-500/10 text-${feature.color_theme}-400 flex items-center justify-center text-lg flex-shrink-0`}>
                    {getIconPreview(feature.icon_name)}
                  </div>
                  <div>
                    <p className="text-white font-bold">{feature.title}</p>
                    <p className="text-xs text-brand-muted line-clamp-1">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(feature)} className="w-9 h-9 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => handleDelete(feature.id)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors">
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