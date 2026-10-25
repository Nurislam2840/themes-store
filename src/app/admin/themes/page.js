"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { 
  FaArrowLeft, FaPlus, FaTrash, FaUpload, FaSave, FaTimes, 
  FaSearch, FaEdit, FaFileArchive, FaChrome, FaCloudUploadAlt, FaCheckCircle 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const supabase = createClient();

export default function AdminThemesPage() {
  const { showAlert } = useAlert();
  const [themes, setThemes] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "", slug: "", category_id: "", price: "", old_price: "",
    description: "", image_url: "", demo_url: "#", file_path: "", 
    featuresText: "", technologiesText: "", gallery_images: [], 
    file_included: "", browser_support: "", responsive: "Mobile & Tablet",
    updates: "Lifetime Free", is_premium: false
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: themeData } = await supabase.from("themes").select("*").order("created_at", { ascending: false });
    const { data: catData } = await supabase.from("categories").select("*").order("order_index");
    if (themeData) setThemes(themeData);
    if (catData) setDbCategories(catData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title" && !editingId) {
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

  // সিকিউর ফাইল আপলোড (সঠিক পাথ সেভ করবে)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsFileUploading(true);
    
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = `themes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("secure-downloads")
        .upload(filePath, file);
      
      if (uploadError) { 
        console.error("Upload error:", uploadError);
        showAlert("File upload failed: " + uploadError.message, "error");
        setIsFileUploading(false); 
        return; 
      }
      
      setForm(prevForm => ({ ...prevForm, file_path: filePath }));
      showAlert("File uploaded securely!", "success");
    } catch (err) {
      console.error("Catch error:", err);
      showAlert("Something went wrong during upload", "error");
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsGalleryUploading(true);
    const uploadedUrls = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from("theme-images").upload(`gallery/${fileName}`, file);
      if (!error) {
        const { data } = supabase.storage.from("theme-images").getPublicUrl(`gallery/${fileName}`);
        uploadedUrls.push(data.publicUrl);
      }
    }
    setForm(prev => ({ ...prev, gallery_images: [...prev.gallery_images, ...uploadedUrls] }));
    setIsGalleryUploading(false);
  };

  const removeGalleryImage = (index) => {
    setForm(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image_url) return showAlert("Thumbnail image is required", "error");
    if (!form.file_path) return showAlert("Secure download file is required", "error");

    setIsSubmitting(true);
    
    const featuresArray = form.featuresText.split(",").map(f => f.trim()).filter(f => f !== "");
    const technologiesArray = form.technologiesText.split(",").map(t => t.trim()).filter(t => t !== "");
    const selectedCat = dbCategories.find(c => c.id === form.category_id);

    const themeData = {
      title: form.title, slug: form.slug, 
      category_id: form.category_id || null,
      category: selectedCat ? selectedCat.name : "",
      price: parseFloat(form.price), 
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      description: form.description, image_url: form.image_url, demo_url: form.demo_url, 
      file_path: form.file_path,
      features: featuresArray, technologies: technologiesArray,
      gallery_images: form.gallery_images, 
      file_included: form.file_included, browser_support: form.browser_support, 
      responsive: form.responsive, updates: form.updates, 
      is_premium: form.is_premium
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from("themes").update(themeData).eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("themes").insert([themeData]);
      error = insertError;
    }

    setIsSubmitting(false);
    if (error) { showAlert("Error: " + error.message, "error"); } 
    else {
      showAlert(editingId ? "Theme updated!" : "Theme added!", "success");
      closeForm();
      fetchData();
    }
  };

  const handleEdit = (theme) => {
    setForm({
      title: theme.title, slug: theme.slug, category_id: theme.category_id || "",
      price: theme.price, old_price: theme.old_price || "",
      description: theme.description, image_url: theme.image_url, demo_url: theme.demo_url || "#", 
      file_path: theme.file_path || "", 
      featuresText: theme.features ? theme.features.join(", ") : "",
      technologiesText: theme.technologies ? theme.technologies.join(", ") : "",
      gallery_images: theme.gallery_images || [],
      file_included: theme.file_included || "", browser_support: theme.browser_support || "", 
      responsive: theme.responsive || "Mobile & Tablet", updates: theme.updates || "Lifetime Free", 
      is_premium: theme.is_premium
    });
    setEditingId(theme.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false); setEditingId(null);
    setForm({ title: "", slug: "", category_id: "", price: "", old_price: "", description: "", image_url: "", demo_url: "#", file_path: "", featuresText: "", technologiesText: "", gallery_images: [], file_included: "", browser_support: "", responsive: "Mobile & Tablet", updates: "Lifetime Free", is_premium: false });
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
    fetchData();
  };

  const filteredThemes = themes.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-2 text-sm font-medium"><FaArrowLeft /> Back to Dashboard</Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Manage Themes</h1>
          </div>
          <button onClick={() => { closeForm(); setShowForm(!showForm); }} className="bg-brand-gold hover:bg-brand-gold-hover text-black px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add New Theme</>}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <form onSubmit={handleSubmit} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-5">{editingId ? "Edit Theme" : "Add New Theme"}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div><label className="block text-xs text-brand-muted mb-2">Title</label><input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Slug</label><input type="text" name="slug" value={form.slug} readOnly className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-brand-muted text-sm outline-none" /></div>
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Category</label>
                    <select name="category_id" value={form.category_id} onChange={handleChange} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold">
                      <option value="">Select Category</option>
                      {dbCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.parent_id ? `↳ ${cat.name}` : cat.name}</option>))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-brand-muted mb-2">Price (৳)</label><input type="number" name="price" value={form.price} onChange={handleChange} required step="1" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                    <div><label className="block text-xs text-brand-muted mb-2">Old Price (৳)</label><input type="number" name="old_price" value={form.old_price} onChange={handleChange} step="1" placeholder="Optional" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  </div>
                </div>

                <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Description</label><textarea name="description" value={form.description} onChange={handleChange} required rows="2" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"></textarea></div>
                <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Key Features (Comma separated)</label><textarea name="featuresText" value={form.featuresText} onChange={handleChange} rows="2" placeholder="Responsive, SEO Optimized, Dark Mode" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"></textarea></div>
                <div className="mb-5"><label className="block text-xs text-brand-muted mb-2">Technology Stack (Comma separated)</label><textarea name="technologiesText" value={form.technologiesText} onChange={handleChange} rows="2" placeholder="Next.js, Tailwind CSS, Supabase" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"></textarea></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 bg-[#09090B] border border-white/10 rounded-xl p-4">
                  <div><label className="block text-xs text-brand-muted mb-2 flex items-center gap-2"><FaFileArchive /> Files Included</label><input type="text" name="file_included" value={form.file_included} onChange={handleChange} placeholder="HTML, CSS, JS, Figma" className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2 flex items-center gap-2"><FaChrome /> Browser Support</label><input type="text" name="browser_support" value={form.browser_support} onChange={handleChange} placeholder="Chrome, Safari, Edge" className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Responsive</label><input type="text" name="responsive" value={form.responsive} onChange={handleChange} placeholder="Mobile & Tablet" className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div><label className="block text-xs text-brand-muted mb-2">Updates</label><input type="text" name="updates" value={form.updates} onChange={handleChange} placeholder="Lifetime Free" className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                </div>

                <div className="mb-5 bg-[#09090B] border border-brand-gold/20 rounded-xl p-4">
                  <label className="block text-xs text-brand-muted mb-2 flex items-center gap-2"><FaCloudUploadAlt /> Secure Download File (ZIP/PDF)</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 px-6 py-3 rounded-xl text-sm font-semibold text-brand-gold transition-all flex items-center gap-2">
                      {isFileUploading ? "Uploading..." : <><FaUpload /> Upload Secure File</>}
                      <input type="file" onChange={handleFileUpload} className="hidden" disabled={isFileUploading} />
                    </label>
                    {form.file_path && (
                      <div className="text-xs text-green-400 flex items-center gap-2"><FaCheckCircle /> File Uploaded</div>
                    )}
                  </div>
                  <p className="text-[10px] text-brand-muted mt-2">* This file is private and cannot be accessed without a valid purchase.</p>
                </div>

                <div className="mb-5 bg-[#09090B] border border-white/10 rounded-xl p-4">
                  <label className="block text-xs text-brand-muted mb-3">Gallery Images (Multiple)</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.gallery_images.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                        <img src={url} alt="gallery" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(i)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500"><FaTrash /></button>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 hover:border-brand-gold flex flex-col items-center justify-center cursor-pointer transition-colors">
                      {isGalleryUploading ? <span className="text-[10px] text-brand-muted">Uploading...</span> : <><FaPlus className="text-brand-muted" /><span className="text-[10px] text-brand-muted mt-1">Add</span></>}
                      <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={isGalleryUploading} />
                    </label>
                  </div>
                </div>

                <div className="mb-5 bg-[#09090B] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div><p className="text-sm font-bold text-white mb-0.5">Premium Theme (PRO)</p></div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="is_premium" checked={form.is_premium} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-brand-gold after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div><label className="block text-xs text-brand-muted mb-2">Demo URL</label><input type="text" name="demo_url" value={form.demo_url} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" /></div>
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Thumbnail Image</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 w-full justify-center">
                        {isUploading ? "Uploading..." : <><FaUpload /> Thumbnail</>}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                      </label>
                      {form.image_url && <img src={form.image_url} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-white/10" />}
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || isUploading || !form.image_url || !form.file_path} className="bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 text-sm">
                  <FaSave /> {isSubmitting ? "Saving..." : "Save Theme"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input type="text" placeholder="Search themes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#121214] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredThemes.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] border border-white/5 rounded-3xl"><p className="text-brand-muted">No themes found.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredThemes.map(theme => (
              <div key={theme.id} className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-gold/30 transition-colors">
                <div className="h-40 overflow-hidden relative">
                  <img src={theme.image_url} alt={theme.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3">{theme.is_premium ? <span className="bg-brand-gold text-black text-[10px] font-bold px-2 py-1 rounded">PRO</span> : <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">FREE</span>}</div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-brand-gold font-bold px-3 py-1 rounded-full text-xs">৳{theme.price}</div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1"><h3 className="font-bold text-white mb-0.5 line-clamp-1">{theme.title}</h3><p className="text-xs text-brand-muted uppercase">{theme.category}</p></div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <button onClick={() => handleEdit(theme)} className="w-9 h-9 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors"><FaEdit size={12} /></button>
                    <button onClick={() => handleDelete(theme.id, theme.image_url)} className="w-9 h-9 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"><FaTrash size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}