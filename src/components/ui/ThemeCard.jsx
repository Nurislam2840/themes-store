"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaShoppingCart, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useStore } from '@/context/StoreContext';

export default function ThemeCard({ theme, index }) {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, formatPrice, getAverageRating, getReviews } = useStore();
  const isWishlisted = isInWishlist(theme.id);
  const avgRating = getAverageRating(theme.slug);
  const reviewCount = getReviews(theme.slug).length;

  // Buy Now URL with theme info
  const buyUrl = `/checkout?theme=${theme.slug}&price=${theme.price}&title=${encodeURIComponent(theme.title)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-500 transition-all duration-300 group flex flex-col shadow-lg relative"
    >
      {/* Wishlist Button */}
      <button 
        onClick={() => toggleWishlist(theme)}
        className="absolute top-3 left-3 z-30 bg-gray-900/80 backdrop-blur-sm p-2 rounded-full text-white hover:text-red-500 transition border border-gray-700"
      >
        {isWishlisted ? <FaHeart className="text-red-500 text-xs" /> : <FaRegHeart className="text-xs" />}
      </button>

      {/* Image */}
      <div className="relative h-40 md:h-52 w-full overflow-hidden group/image">
        <div onClick={() => router.push(`/themes/${theme.slug}`)} className="absolute inset-0 cursor-pointer z-10">
          <img 
            src={theme.image} 
            alt={theme.title} 
            className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500 opacity-80 group-hover/image:opacity-100"
          />
        </div>
        
        {/* Hover Icons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20 pointer-events-none group-hover/image:pointer-events-auto">
          <a href={theme.demo_url} target="_blank" rel="noopener noreferrer" className="bg-cyan-600 text-white p-2.5 rounded-full hover:bg-cyan-700 transition">
            <FaExternalLinkAlt className="text-sm" />
          </a>
          <Link href={buyUrl} className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 transition">
            <FaShoppingCart className="text-sm" />
          </Link>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-cyan-600 text-white font-bold px-2.5 py-1 rounded-full text-[10px] md:text-xs shadow-lg z-30">
          {formatPrice(theme.price)}
        </div>

        {/* Rating Badge */}
        {reviewCount > 0 && (
          <div className="absolute bottom-3 left-3 z-30 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-gray-700">
            <FaStar className="text-yellow-400" /> 
            {avgRating} <span className="text-gray-400 font-normal">({reviewCount})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <p className="text-cyan-400 text-[10px] md:text-xs font-bold mb-2 uppercase tracking-widest">{theme.category}</p>
        
        <Link href={`/themes/${theme.slug}`}>
          <h3 className="text-base md:text-xl font-bold text-white mb-3 hover:text-cyan-400 transition cursor-pointer line-clamp-1">{theme.title}</h3>
        </Link>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(theme.tags || []).slice(0, 3).map((tag, i) => (
            <span key={i} className="bg-gray-800 text-gray-300 text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-md border border-gray-700">{tag}</span>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <Link href={`/themes/${theme.slug}`} className="flex-1 text-center bg-gray-800 text-white py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-700 transition">
            Details
          </Link>
          <Link href={buyUrl} className="flex-1 text-center bg-cyan-600 text-white py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-cyan-700 transition">
            Buy Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}