"use client";
import { useEffect, useState } from "react";
import { useReviewStore } from "@/store/reviewStore";
import { useAlert } from "@/providers/AlertProvider";
import { FaStar, FaUserCircle, FaSpinner, FaPen } from "react-icons/fa";

export default function ReviewSection({ themeId }) {
  const { reviews, isLoading, fetchReviews, addReview } = useReviewStore();
  const { showAlert } = useAlert();

  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (themeId) fetchReviews(themeId);
  }, [themeId, fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return showAlert("Please enter your name", "error");
    if (!form.comment.trim()) return showAlert("Please write a review", "error");

    setIsSubmitting(true);
    const res = await addReview({
      themeId,
      name: form.name,
      rating: form.rating,
      comment: form.comment,
    });
    setIsSubmitting(false);

    if (res.success) {
      showAlert("Review submitted successfully!", "success");
      setForm({ name: "", rating: 5, comment: "" });
    } else {
      showAlert(res.error || "Failed to submit review", "error");
    }
  };

  // গড় রেটিং ক্যালকুলেট করা
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="bg-brand-card border border-brand-border rounded-3xl p-6 md:p-10 mb-8">
      {/* হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-brand-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-brand-gold text-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className={star <= Math.round(avgRating) ? "text-brand-gold" : "text-gray-600"} />
              ))}
            </div>
            <span className="text-white font-bold text-lg">{avgRating} out of 5</span>
            <span className="text-brand-muted text-sm">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* বাম দিকে: রিভিউ লিস্ট */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-brand-gold text-3xl" /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 bg-brand-dark rounded-xl border border-brand-border">
              <FaPen className="mx-auto text-3xl text-brand-muted mb-3 opacity-50" />
              <p className="text-brand-muted">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-brand-dark border border-brand-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      <FaUserCircle size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{rev.reviewer_name}</p>
                      <p className="text-xs text-brand-muted">{new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex text-brand-gold text-xs gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className={star <= rev.rating ? "text-brand-gold" : "text-gray-600"} />
                    ))}
                  </div>
                </div>
                <p className="text-brand-muted text-sm mt-3 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* ডান দিকে: রিভিউ ফর্ম */}
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-brand-muted mb-2">Your Name</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold transition"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm text-brand-muted mb-2">Rating</label>
              <div className="flex gap-2 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setForm({ ...form, rating: star })}
                  >
                    <FaStar
                      className={`transition-colors ${
                        star <= (hover || form.rating) ? "text-brand-gold" : "text-gray-600"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-muted mb-2">Your Review</label>
              <textarea 
                rows="4"
                value={form.comment} 
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold transition resize-none"
                placeholder="What do you think about this theme?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gold-gradient hover:opacity-90 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><FaSpinner className="animate-spin" /> Submitting...</> : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}