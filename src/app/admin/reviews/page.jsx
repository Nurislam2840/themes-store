"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import Link from "next/link";
import { useAlert } from "@/providers/AlertProvider";
import { FaArrowLeft, FaTrash, FaStar, FaUser, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminReviewsPage() {
  const { showAlert } = useAlert();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, themes(title)")
      .order("created_at", { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      showAlert("Failed to delete review.", "error");
    } else {
      showAlert("Review deleted!", "success");
      fetchReviews();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-4 text-sm">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Manage Reviews</h1>
          <p className="text-brand-muted text-sm mt-2">View and delete customer reviews across all themes.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-brand-gold text-3xl" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] border border-white/5 rounded-3xl text-brand-muted">No reviews found.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <motion.div key={rev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-brand-gold text-sm font-semibold">{rev.themes?.title || "Unknown Theme"}</p>
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
                    <button onClick={() => handleDelete(rev.id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed">{rev.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}