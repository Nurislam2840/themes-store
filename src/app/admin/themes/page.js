"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaUpload, FaSave, FaTimes, FaLink, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminThemesPage() {
  const { showAlert } = useAlert();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "", slug: "", category: "Next.js", price: "", 
    description: "", image_url: "", demo_url: "#", download_url: "", 
    featuresText: "", galleryText: "", is_premium: false // galleryText যুক্ত হলো
  });

  const fetchThemes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("themes").select("*").order("created_at", { ascending: false });
    if (!error && data) setThemes(data);
    setLoading(false);
  };

  useEffect(() => { fetchThemes(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title") {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from("theme-images").upload(`themes/${fileName}`, file);
    if (uploadError) { showAlert("Upload failed: " + uploadError.message, "error"); setIsUploading(false); return; }
    const { data } = supabase.storage.from("theme-images").getPublicUrl(`themes/${fileName}`);
    setForm({ ...form, image_url: data.publicUrl });
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // কমা দিয়ে লেখা ফিচার এবং গ্যালারি লিংক অ্যারেতে রূপান্তর
    const featuresArray = form.featuresText.split(",").map(f => f.trim()).filter(f => f !== "");
    const galleryArray = form.galleryText.split(",").map(g => g.trim()).filter(g => g !== "");

    const { error } = await supabase.from("themes").insert([{
      title: form.title, slug: form.slug, category: form.category,
      price: parseFloat(form.price), description: form.description,
      image_url: form.image_url, demo_url: form.demo_url, download_url: form.download_url,
      features: featuresArray, gallery_images: galleryArray, // এখানে গ্যালারি যুক্ত হলো
      technologies: [form.category], is_premium: form.is_premium
    }]);

    setIsSubmitting(false);
    if (error) { showAlert("Error: " + error.message, "error"); } 
    else {
      showAlert("Theme added successfully!", "success");
      setShowForm(false);
      setForm({ title: "", slug: "", category: "Next.js", price: "", description: "", image_url: "", demo_url: "#", download_url: "", featuresText: "", galleryText: "", is_premium: false });
      fetchThemes();
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Delete this theme?")) return;
    const { error } = await supabase.from("themes").delete().eq("id", id);
    if (error) { showAlert("Failed to delete", "error"); return; }
    if (imageUrl && imageUrl.includes("supabase.co")) {
      const path = imageUrl.split("theme-images/")[1];
      if (path) await supabase.storage.from("theme-images").remove([path]);
    }
    showAlert("Theme deleted!", "success");
    fetchThemes();
  };

  const filteredThemes = themes.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-2 text-sm font-medium">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Manage Themes</h1>
            <p className="text-brand-muted text-sm mt-1">{themes.length} themes in total</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-brand-gold hover:bg-brand-gold-hover text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center gap-2 text-sm">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add New Theme</>}
          </button>
        </div>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input type="text" placeholder="Search themes..." value={search} onChange={(e) => setSearch(e.target.value)} 
            className="w-full bg-[#121214] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <form onSubmit={handleSubmit} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                <h3 className="text-lg font-bold text-white mb-5">Add New Theme</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div><label className="block text-xs text-brand-muted mb-2">Title</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Slug</label>
                    <input type="text" name="slug" value={form.slug} readOnly className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-brand-muted text-sm outline-none" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Category</label>
                    <select name="category" value={form.category} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold">
                      <option>Next.js</option><option>React</option><option>WordPress</option><option>HTML/CSS</option>
                    </select></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Price</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} required step="0.01" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                </div>
                <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows="2" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"></textarea></div>
                <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Features (Comma separated)</label>
                  <textarea name="featuresText" value={form.featuresText} onChange={handleChange} rows="2" placeholder="Responsive, SEO Optimized, Dark Mode" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"></textarea></div>

                {/* নতুন গ্যালারি ইনপুট */}
                <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Gallery Images (Comma separated URLs)</label>
                  <textarea name="galleryText" value={form.galleryText} onChange={handleChange} rows="2" placeholder="https://image1.jpg, https://image2.jpg" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"></textarea></div>

                <div className="mb-5 bg-[#09090B] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Premium Theme (PRO)</p>
                    <p className="text-xs text-brand-muted">If enabled, this theme will show a "PRO" badge.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="is_premium" checked={form.is_premium} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-brand-gold after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div><label className="block text-xs text-brand-muted mb-2">Demo URL</label>
                    <input type="text" name="demo_url" value={form.demo_url} onChange={handleChange} placeholder="https://demo.com" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Download URL</label>
                    <div className="relative">
                      <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                      <input type="text" name="download_url" value={form.download_url} onChange={handleChange} placeholder="https://drive.google.com/..." className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
                    </div></div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-brand-muted mb-2">Thumbnail Image</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2">
                      {isUploading ? "Uploading..." : <><FaUpload /> Upload Image</>}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                    </label>
                    {form.image_url && <img src={form.image_url} alt="Preview" className="h-12 w-20 object-cover rounded-lg border border-white/10" />}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || isUploading || !form.image_url} className="bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 text-sm">
                  <FaSave /> {isSubmitting ? "Saving..." : "Save Theme"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] border border-white/5 rounded-3xl">
            <p className="text-brand-muted">No themes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredThemes.map(theme => (
              <div key={theme.id} className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-gold/30 transition-colors">
                <div className="h-40 overflow-hidden relative">
                  <img src={theme.image_url} alt={theme.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    {theme.is_premium ? <span className="bg-brand-gold text-black text-[10px] font-bold px-2 py-1 rounded">PRO</span> : <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">FREE</span>}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-brand-gold font-bold px-3 py-1 rounded-full text-xs">${theme.price}</div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white mb-0.5 line-clamp-1">{theme.title}</h3>
                    <p className="text-xs text-brand-muted uppercase">{theme.category}</p>
                  </div>
                  <button onClick={() => handleDelete(theme.id, theme.image_url)} className="w-9 h-9 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors flex-shrink-0 ml-2">
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