"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaSpinner, FaTag } from "react-icons/fa";

export default function AdminPricingPage() {
  const { showAlert } = useAlert();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({ name: "", price: "", description: "", featuresText: "", is_popular: false });

  const fetchPlans = async () => {
    setLoading(true);
    const { data } = await supabase.from("pricing_plans").select("*").order("created_at", { ascending: true });
    if (data) setPlans(data);
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name, price: plan.price, description: plan.description,
      featuresText: plan.features ? plan.features.join(", ") : "",
      is_popular: plan.is_popular
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const featuresArray = form.featuresText.split(",").map(f => f.trim()).filter(f => f !== "");
    
    const { error } = await supabase.from("pricing_plans").update({
      name: form.name, price: form.price, description: form.description,
      features: featuresArray, is_popular: form.is_popular
    }).eq("id", editingId);

    if (error) showAlert("Failed to update", "error");
    else {
      showAlert("Plan updated successfully!", "success");
      setEditingId(null);
      fetchPlans();
    }
  };

  if (loading) return <div className="min-h-screen bg-[#09090B] flex items-center justify-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <FaTag className="text-brand-gold" /> Manage Pricing
          </h1>
        </div>

        {editingId ? (
          <form onSubmit={handleSave} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Plan</h2>
              <button type="button" onClick={() => setEditingId(null)} className="text-brand-muted hover:text-white"><FaTimes /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div><label className="block text-xs text-brand-muted mb-2">Plan Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm" /></div>
              <div><label className="block text-xs text-brand-muted mb-2">Price (e.g. $49)</label>
                <input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm" /></div>
            </div>
            <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm" /></div>
            <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Features (Comma separated)</label>
              <textarea rows="3" value={form.featuresText} onChange={e => setForm({...form, featuresText: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm" /></div>
            <div className="mb-6 flex items-center gap-3">
              <input type="checkbox" checked={form.is_popular} onChange={e => setForm({...form, is_popular: e.target.checked})} className="w-5 h-5 accent-brand-gold" />
              <label className="text-sm text-white">Mark as "Most Popular"</label>
            </div>
            <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 text-sm">
              <FaSave /> Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div key={plan.id} className={`bg-[#121214] border rounded-2xl p-6 relative ${plan.is_popular ? 'border-brand-gold/50' : 'border-white/5'}`}>
                {plan.is_popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-black text-[10px] font-bold px-3 py-1 rounded-full">POPULAR</span>}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-3xl font-extrabold text-brand-gold mb-4">{plan.price}</p>
                <p className="text-brand-muted text-xs mb-4">{plan.description}</p>
                <button onClick={() => handleEdit(plan)} className="w-full bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm mt-4">
                  <FaEdit /> Edit Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}