"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { FaArrowLeft, FaSync, FaTrash, FaStar, FaUserCircle, FaSearch, FaComments } from 'react-icons/fa';

export default function AdminReviewsPage() {
  const { getAllReviews, deleteReview } = useStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const result = await getAllReviews();
    if (result.success) setReviews(result.reviews);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const result = await deleteReview(deleteConfirm.id, deleteConfirm.theme_slug);
    if (result.success) {
      setReviews(prev => prev.filter(r => r.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } else {
      alert('Error deleting review');
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.theme_slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full flex-grow">

        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition mb-8">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Reviews</h1>
            <p className="text-gray-400 text-sm mt-1">{reviews.length} total reviews • Average: {avgRating} ⭐</p>
          </div>
          <button onClick={fetchReviews} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm">
            <FaSync /> Refresh
          </button>
        </div>

        {/* Rating Breakdown */}
        {reviews.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8">
            <h3 className="text-sm font-bold text-gray-300 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {ratingBreakdown.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex text-yellow-400 text-xs w-20">
                    {star} <FaStar className="ml-1" />
                  </div>
                  <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full transition-all"
                      style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            placeholder="Search by name, theme slug, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-xl outline-none border border-gray-800 focus:border-cyan-500 transition text-sm"
          />
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl">
            <FaComments className="text-5xl text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">{searchTerm ? 'No matching reviews found.' : 'No reviews yet.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl text-cyan-400 flex-shrink-0">
                    <FaUserCircle />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-white">{review.name}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex text-yellow-400 text-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            star <= review.rating ? <FaStar key={star} /> : <FaStar key={star} className="text-gray-700" />
                          ))}
                        </div>
                        <button 
                          onClick={() => setDeleteConfirm(review)}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition"
                          title="Delete Review"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-cyan-400 font-mono mb-2">Theme: {review.theme_slug}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-3">Delete Review?</h3>
              <p className="text-gray-400 text-sm mb-2">
                Review by <span className="text-white font-semibold">{deleteConfirm.name}</span>
              </p>
              <p className="text-gray-500 text-xs italic mb-6 line-clamp-2">"{deleteConfirm.comment}"</p>
              <div className="flex gap-3">
                <button onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 font-bold py-3 rounded-xl transition">
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 font-bold py-3 rounded-xl transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}