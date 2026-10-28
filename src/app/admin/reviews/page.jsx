// src/app/admin/reviews/page.jsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaTrash, FaStar, FaUser, FaSpinner, FaEdit, FaTimes, FaSave } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminReviewsPage() {
  const { showAlert } = useAlert();
  const [reviews, setReviews] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    theme_id: "",
    reviewer_name: "",
    rating: 5,
    comment: "",
  });

  const fetchData = async () => {
    setLoading(true);
    // রিভিউ এবং থিম দুটোই একসাথে আনছি
    const [reviewsRes, themesRes] = await Promise.all([
      supabase.from("reviews").select("*, themes(title)").order("created_at", { ascending: false }),
      supabase.from("themes").select("id, title").order("title", { ascending: true })
    ]);
    
    if (reviewsRes.data) setReviews(reviewsRes.data);
    if (themesRes.data) setThemes(themesRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.theme_id) return showAlert("Please select a theme", "error");
    setIsSubmitting(true);

    const reviewData = {
      theme_id: form.theme_id,
      reviewer_name: form.reviewer_name,
      rating: parseInt(form.rating),
      comment: form.comment,
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from("reviews").update(reviewData).eq("id", editingId);
      error = updateError;
    } else {
      // অ্যাডমিন যখন রিভিউ দিচ্ছে, তখন user_id null থাকতে পারে (ফেক রিভিউ)
      const { error: insertError } = await supabase.from("reviews").insert([{ ...reviewData, user_id: null }]);
      error = insertError;
    }

    setIsSubmitting(false);
    if (error) {
      showAlert("Error: " + error.message, "error");
    } else {
      showAlert(editingId ? "Review updated!" : "Review added!", "success");
      closeForm();
      fetchData();
    }
  };

  const handleEdit = (review) => {
    setForm({
      theme_id: review.theme_id,
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      comment: review.comment,
    });
    setEditingId(review.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ theme_id: "", reviewer_name: "", rating: 5, comment: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      showAlert("Failed to delete review.", "error");
    } else {
      showAlert("Review deleted!", "success");
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-10 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-2 text-sm">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Manage Reviews</h1>
            <p className="text-brand-muted text-sm mt-1">Add custom reviews or moderate existing ones.</p>
          </div>
          <button onClick={() => { closeForm(); setShowForm(!showForm); }} className="bg-brand-gold text-black px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm hover:bg-brand-gold-hover transition-colors">
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Custom Review</>}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
              <form onSubmit={handleSubmit} className="bg-[#121214] border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-5">{editingId ? "Edit Review" : "Add Custom Review"}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Select Theme</label>
                    <select name="theme_id" value={form.theme_id} onChange={handleChange} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold">
                      <option value="">-- Choose a Theme --</option>
                      {themes.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Reviewer Name</label>
                    <input type="text" name="reviewer_name" value={form.reviewer_name} onChange={handleChange} required className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold" placeholder="e.g. John Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Rating (1-5)</label>
                    <select name="rating" value={form.rating} onChange={handleChange} className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-brand-gold font-bold text-sm outline-none focus:border-brand-gold">
                      <option value="5">⭐⭐⭐⭐⭐ (5 Star)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Star)</option>
                      <option value="3">⭐⭐⭐ (3 Star)</option>
                      <option value="2">⭐⭐ (2 Star)</option>
                      <option value="1">⭐ (1 Star)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-muted mb-2">Comment</label>
                    <textarea name="comment" value={form.comment} onChange={handleChange} required rows="2" className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold resize-none" placeholder="Write the review comment..." />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 text-sm">
                  <FaSave /> {isSubmitting ? "Saving..." : "Save Review"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-brand-gold text-3xl" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] border border-white/5 rounded-3xl text-brand-muted">No reviews found. Add your first review!</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <motion.div key={rev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                  <div>
                    <p className="text-brand-gold text-sm font-semibold line-clamp-1">{rev.themes?.title || "Unknown Theme"}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-brand-muted">
                      <FaUser size={10} /> {rev.reviewer_name}
                      <span className="opacity-50">•</span>
                      {new Date(rev.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex text-brand-gold text-xs">
                      {[1,2,3,4,5].map(s => <FaStar key={s} className={s <= rev.rating ? "text-brand-gold" : "text-gray-700"} />)}
                    </div>
                    <button onClick={() => handleEdit(rev)} className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition">
                      <FaEdit size={12} />
                    </button>
                    <button onClick={() => handleDelete(rev.id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed line-clamp-2">{rev.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}