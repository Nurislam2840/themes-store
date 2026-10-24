"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaLayerGroup } from "react-icons/fa";

export default function AdminCategoriesPage() {
  const { showAlert } = useAlert();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ name: "", parent_id: "", order_index: 0 });

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("order_index");
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const parentId = form.parent_id === "" ? null : form.parent_id;
    
    const { error } = await supabase.from("categories").insert([{ name: form.name, slug, parent_id: parentId, order_index: parseInt(form.order_index) }]);
    
    if (error) showAlert("Error: " + error.message, "error");
    else {
      showAlert("Category added!", "success");
      setForm({ name: "", parent_id: "", order_index: 0 });
      fetchCategories();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? Deleting a category will also delete its subcategories.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) showAlert("Failed to delete", "error");
    else fetchCategories();
  };

  const mainCategories = categories.filter(c => !c.parent_id);
  const getSubCategories = (parentId) => categories.filter(c => c.parent_id === parentId);

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium"><FaArrowLeft /> Back to Dashboard</Link>
        <h1 className="text-3xl font-extrabold text-white mb-8">Manage Categories</h1>

        <form onSubmit={handleAdd} className="bg-[#121214] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2"><label className="block text-xs text-brand-muted mb-1">Category Name</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" placeholder="e.g. Next.js" /></div>
          <div><label className="block text-xs text-brand-muted mb-1">Parent (Optional)</label>
            <select value={form.parent_id} onChange={e => setForm({...form, parent_id: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm">
              <option value="">-- Main Category --</option>
              {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-brand-gold text-black font-bold px-6 py-2 rounded-xl text-sm h-[38px] flex items-center justify-center gap-2"><FaPlus /> Add</button>
        </form>

        <div className="space-y-4">
          {mainCategories.map(main => (
            <div key={main.id} className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <FaLayerGroup className="text-brand-gold" />
                  <span className="text-white font-bold">{main.name}</span>
                </div>
                <button onClick={() => handleDelete(main.id)} className="text-red-400 hover:text-red-300"><FaTrash size={14} /></button>
              </div>
              {getSubCategories(main.id).length > 0 && (
                <div className="p-2 space-y-1">
                  {getSubCategories(main.id).map(sub => (
                    <div key={sub.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 pl-8">
                      <span className="text-sm text-brand-muted">↳ {sub.name}</span>
                      <button onClick={() => handleDelete(sub.id)} className="text-red-400 hover:text-red-300"><FaTrash size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}