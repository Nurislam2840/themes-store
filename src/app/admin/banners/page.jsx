"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaUpload, FaSave, FaTimes, FaImage, FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBannersPage() {
  const { showAlert } = useAlert();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "", subtitle: "", image_url: "", cta_text: "Explore Themes", cta_link: "/themes", order_index: 0, is_active: true
  });

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await supabase.from("banners").select("*").order("order_index", { ascending: true });
    if (data) setBanners(data);
    setLoading(false);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileName = `banners/${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from("theme-images").upload(fileName, file);
    if (uploadError) { showAlert("Upload failed: " + uploadError.message, "error"); setIsUploading(false); return; }
    const { data } = supabase.storage.from("theme-images").getPublicUrl(fileName);
    setForm({ ...form, image_url: data.publicUrl });
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const bannerData = {
      title: form.title, subtitle: form.subtitle, image_url: form.image_url,
      cta_text: form.cta_text, cta_link: form.cta_link, 
      order_index: parseInt(form.order_index) || 0, is_active: form.is_active
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from("banners").update(bannerData).eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("banners").insert([bannerData]);
      error = insertError;
    }

    setIsSubmitting(false);
    if (error) { showAlert("Error: " + error.message, "error"); } 
    else {
      showAlert(editingId ? "Banner updated!" : "Banner added!", "success");
      closeForm();
      fetchBanners();
    }
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title, subtitle: banner.subtitle || "", image_url: banner.image_url,
      cta_text: banner.cta_text, cta_link: banner.cta_link, order_index: banner.order_index, is_active: banner.is_active
    });
    setEditingId(banner.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false); setEditingId(null);
    setForm({ title: "", subtitle: "", image_url: "", cta_text: "Explore Themes", cta_link: "/themes", order_index: 0, is_active: true });
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Delete this banner?")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) { showAlert("Failed to delete", "error"); return; }
    if (imageUrl && imageUrl.includes("supabase.co")) {
      const path = imageUrl.split("theme-images/")[1];
      if (path) await supabase.storage.from("theme-images").remove([path]);
    }
    showAlert("Banner deleted!", "success");
    fetchBanners();
  };

  const toggleActive = async (id, currentStatus) => {
    await supabase.from("banners").update({ is_active: !currentStatus }).eq("id", id);
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-2 text-sm font-medium">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Manage Hero Slider</h1>
            <p className="text-brand-muted text-sm mt-1">{banners.length} banners in total</p>
          </div>
          <button onClick={() => { closeForm(); setShowForm(!showForm); }} className="bg-brand-gold hover:bg-brand-gold-hover text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center gap-2 text-sm">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add New Banner</>}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <form onSubmit={handleSubmit} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-5">{editingId ? "Edit Banner" : "Add New Banner"}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div><label className="block text-xs text-brand-muted mb-2">Main Title</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Subtitle</label>
                    <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                  <div><label className="block text-xs text-brand-muted mb-2">Button Text</label>
                    <input type="text" name="cta_text" value={form.cta_text} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Button Link</label>
                    <input type="text" name="cta_link" value={form.cta_link} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Order (0 = 1st)</label>
                    <input type="number" name="order_index" value={form.order_index} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-brand-muted mb-2">Background Image</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2">
                      {isUploading ? "Uploading..." : <><FaUpload /> Upload Image</>}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                    </label>
                    {form.image_url && <img src={form.image_url} alt="Preview" className="h-12 w-20 object-cover rounded-lg border border-white/10" />}
                  </div>
                </div>

                <div className="mb-6 flex items-center gap-3">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-5 h-5 accent-brand-gold" />
                  <label className="text-sm text-white">Show this banner on the homepage</label>
                </div>

                <button type="submit" disabled={isSubmitting || isUploading || !form.image_url} className="bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 text-sm">
                  <FaSave /> {isSubmitting ? "Saving..." : "Save Banner"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] border border-white/5 rounded-3xl"><p className="text-brand-muted">No banners found. Add your first slider!</p></div>
        ) : (
          <div className="space-y-4">
            {banners.map(banner => (
              <div key={banner.id} className={`bg-[#121214] border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 transition-all ${banner.is_active ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
                <div className="w-full md:w-48 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#09090B]">
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{banner.title}</h3>
                  <p className="text-sm text-brand-muted truncate">{banner.subtitle}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-brand-muted">Order: {banner.order_index}</span>
                    <span className={`text-[10px] px-2 py-1 rounded ${banner.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {banner.is_active ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end">
                  <button onClick={() => toggleActive(banner.id, banner.is_active)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${banner.is_active ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`} title="Toggle Visibility">
                    {banner.is_active ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button onClick={() => handleEdit(banner)} className="w-10 h-10 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(banner.id, banner.image_url)} className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors">
                    <FaTrash />
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