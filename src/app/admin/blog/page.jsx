// src/app/admin/blog/page.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaUpload, FaTimes, FaEdit, FaFileAlt, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBlogPage() {
  const { showAlert } = useAlert();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ title: "", slug: "", content: "", image_url: "", is_published: true });

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title" && !editingId) updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileName = `blog/${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from("theme-images").upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from("theme-images").getPublicUrl(fileName);
      setForm(prev => ({ ...prev, image_url: data.publicUrl }));
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image_url) return showAlert("Cover image is required", "error");
    setIsSubmitting(true);

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from("blog_posts").update(form).eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("blog_posts").insert([form]);
      error = insertError;
    }

    setIsSubmitting(false);
    if (error) showAlert("Error: " + error.message, "error");
    else {
      showAlert(editingId ? "Post updated!" : "Post created!", "success");
      closeForm(); fetchPosts();
    }
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, slug: post.slug, content: post.content, image_url: post.image_url, is_published: post.is_published });
    setEditingId(post.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => { 
    setShowForm(false); 
    setEditingId(null); 
    setForm({ title: "", slug: "", content: "", image_url: "", is_published: true }); 
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    showAlert("Post deleted!", "success"); fetchPosts();
  };

  const togglePublish = async (id, currentStatus) => {
    await supabase.from("blog_posts").update({ is_published: !currentStatus }).eq("id", id);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-10 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-2 text-sm"><FaArrowLeft /> Back to Dashboard</Link>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2"><FaFileAlt className="text-brand-gold"/> Blog Manager</h1>
          </div>
          <button onClick={() => { closeForm(); setShowForm(!showForm); }} className="bg-brand-gold text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm hover:bg-brand-gold-hover transition-colors">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Create New Post</>}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <form onSubmit={handleSubmit} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-5">{editingId ? "Edit Post" : "New Blog Post"}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Post Title</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="How to build a Next.js app..." />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Slug (Auto-generated)</label>
                    <input type="text" name="slug" value={form.slug} readOnly className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-brand-muted text-sm outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-xs text-brand-muted mb-2">Content</label>
                  <textarea name="content" value={form.content} onChange={handleChange} required rows="8" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold resize-none" placeholder="Write your article content here..."></textarea>
                </div>

                <div className="mb-5 bg-[#09090B] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Cover Image</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2">
                        {isUploading ? "Uploading..." : <><FaUpload /> Upload Image</>}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                      </label>
                      {form.image_url && <img src={form.image_url} alt="Preview" className="h-12 w-20 object-cover rounded-lg border border-white/10" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#121214] px-4 py-3 rounded-xl border border-white/5">
                    <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="w-5 h-5 accent-brand-gold cursor-pointer" />
                    <label className="text-sm text-white font-medium cursor-pointer">Publish immediately</label>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || isUploading || !form.image_url} className="bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 text-sm">
                  {isSubmitting ? "Saving..." : (editingId ? "Update Post" : "Save Post")}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] border border-white/5 rounded-3xl"><p className="text-brand-muted">No blog posts found. Create your first post!</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
              <div key={post.id} className={`bg-[#121214] border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${post.is_published ? 'border-white/10 hover:border-brand-gold/30' : 'border-white/5 opacity-60'}`}>
                
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-[#09090B]">
                    <Image src={post.image_url} alt={post.title} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-base md:text-lg truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-brand-muted">
                      <span className="flex items-center gap-1"><FaCheckCircle className={post.is_published ? "text-green-500" : "text-gray-500"} size={10} /> {post.is_published ? "Published" : "Draft"}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  <button onClick={() => togglePublish(post.id, post.is_published)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${post.is_published ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`} title="Toggle Visibility">
                    {post.is_published ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button onClick={() => handleEdit(post)} className="w-10 h-10 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors">
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