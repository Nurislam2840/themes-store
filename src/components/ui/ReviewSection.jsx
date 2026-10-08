"use client";

import { useState } from 'react';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';
import { useStore } from '@/context/StoreContext';

export default function ReviewSection({ themeSlug }) {
  const { addReview, getReviews, getAverageRating } = useStore();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = getReviews(themeSlug);
  const avgRating = getAverageRating(themeSlug);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    
    setIsSubmitting(true);
    const result = await addReview(themeSlug, { name, rating, comment });
    setIsSubmitting(false);

    if (result.success) {
      setName('');
      setRating(0);
      setComment('');
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
    } else {
      alert('Error submitting review: ' + result.error);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-800">
      
      {/* Header with Average Rating */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Customer Reviews</h2>
          <p className="text-gray-400 text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''} for this theme</p>
        </div>

        {reviews.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="text-4xl font-extrabold text-cyan-400">{avgRating}</div>
            <div>
              <div className="flex text-yellow-400 text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= Math.round(avgRating) ? <FaStar key={star} /> : <FaRegStar key={star} />
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">Average Rating</p>
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 mb-10">
        <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>

        {isSubmitted && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
            ✅ Thank you! Your review has been submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input 
            type="text" 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white text-sm"
          />

          {/* Star Rating */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Your Rating</label>
            <div className="flex gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Share your experience with this theme..." 
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white text-sm"
          ></textarea>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl text-cyan-400 flex-shrink-0">
                  <FaUserCircle />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-white">{review.name}</h4>
                      <p className="text-gray-500 text-xs">
                        {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex text-yellow-400 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        star <= review.rating ? <FaStar key={star} /> : <FaRegStar key={star} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mt-3">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-gray-500">No reviews yet. Be the first to review this theme!</p>
        </div>
      )}

    </div>
  );
}