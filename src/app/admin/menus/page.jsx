"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaBars } from "react-icons/fa";

export default function AdminMenusPage() {
  const { showAlert } = useAlert();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: "", href: "", order_index: 0 });

  const fetchMenus = async () => {
    const { data } = await supabase.from("menus").select("*").order("order_index");
    if (data) setMenus(data);
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("menus").insert([{ ...form, order_index: parseInt(form.order_index) }]);
    if (error) showAlert("Error", "error");
    else { showAlert("Menu added!", "success"); setForm({ name: "", href: "", order_index: 0 }); fetchMenus(); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item?")) return;
    await supabase.from("menus").delete().eq("id", id);
    fetchMenus();
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm font-medium"><FaArrowLeft /> Back to Dashboard</Link>
        <h1 className="text-3xl font-extrabold text-white mb-8">Manage Menus</h1>

        <form onSubmit={handleAdd} className="bg-[#121214] border border-white/10 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div><label className="block text-xs text-brand-muted mb-1">Name</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" placeholder="Home" /></div>
          <div><label className="block text-xs text-brand-muted mb-1">Link (URL)</label><input type="text" required value={form.href} onChange={e => setForm({...form, href: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" placeholder="/" /></div>
          <div><label className="block text-xs text-brand-muted mb-1">Order</label><input type="number" value={form.order_index} onChange={e => setForm({...form, order_index: e.target.value})} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" /></div>
          <button type="submit" className="bg-brand-gold text-black font-bold px-6 py-2 rounded-xl text-sm h-[38px] flex items-center justify-center gap-2"><FaPlus /> Add</button>
        </form>

        <div className="space-y-3">
          {menus.map(menu => (
            <div key={menu.id} className="bg-[#121214] border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FaBars className="text-brand-muted" />
                <span className="text-white font-bold">{menu.name}</span>
                <span className="text-xs text-brand-muted font-mono bg-white/5 px-2 py-1 rounded">{menu.href}</span>
              </div>
              <button onClick={() => handleDelete(menu.id)} className="text-red-400 hover:text-red-300"><FaTrash size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}