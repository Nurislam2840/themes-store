"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useStore } from '@/context/StoreContext';

export default function ThemeCard({ theme, index }) {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, formatPrice, getAverageRating, getReviews } = useStore();
  const isWishlisted = isInWishlist(theme.id);
  const avgRating = getAverageRating(theme.slug);
  const reviewCount = getReviews(theme.slug).length;

  const buyUrl = `/checkout?theme=${theme.slug}&price=${theme.price}&title=${encodeURIComponent(theme.title)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-500/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 flex flex-col"
    >
      {/* Top gradient border on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40"></div>

      {/* ============ IMAGE SECTION ============ */}
      <div className="relative h-44 md:h-52 w-full overflow-hidden group/image">
        
        {/* Theme Image */}
        <div 
          onClick={() => router.push(`/themes/${theme.slug}`)} 
          className="absolute inset-0 cursor-pointer z-10"
        >
          <img 
            src={theme.image} 
            alt={theme.title} 
            className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-20 pointer-events-none"></div>

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3 z-30 bg-gray-950/85 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {theme.category}
        </div>

        {/* Price Badge - Top Right */}
        <div className="absolute top-3 right-3 z-30 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-lg shadow-cyan-500/30">
          {formatPrice(theme.price)}
        </div>

        {/* Wishlist Button - Bottom Left of Image */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(theme); }}
          className="absolute bottom-3 left-3 z-30 bg-gray-950/85 backdrop-blur-md border border-gray-700 hover:border-red-500/50 p-2 rounded-full text-white transition-all duration-300 hover:scale-110"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500 text-xs" />
          ) : (
            <FaRegHeart className="text-xs" />
          )}
        </button>

        {/* Rating Badge - Bottom Right of Image */}
        {reviewCount > 0 && (
          <div className="absolute bottom-3 right-3 z-30 bg-gray-950/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-yellow-500/30">
            <FaStar className="text-yellow-400" /> 
            <span>{avgRating}</span> 
            <span className="text-gray-400 font-normal">({reviewCount})</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-25 pointer-events-none group-hover/image:pointer-events-auto">
          
          <a 
            href={theme.demo_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white p-3 rounded-xl transition-all duration-300 transform translate-y-2 group-hover/image:translate-y-0 hover:scale-110"
            title="Live Preview"
          >
            <FaExternalLinkAlt className="text-sm" />
          </a>

          <Link 
            href={buyUrl}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-3 rounded-xl transition-all duration-300 transform translate-y-2 group-hover/image:translate-y-0 hover:scale-110 shadow-lg shadow-cyan-500/40"
            title="Buy Now"
          >
            <FaShoppingCart className="text-sm" />
          </Link>

        </div>

      </div>

      {/* ============ CONTENT SECTION ============ */}
      <div className="p-5 flex flex-col flex-grow relative">
        
        {/* Title */}
        <Link href={`/themes/${theme.slug}`}>
          <h3 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer">
            {theme.title}
          </h3>
        </Link>

        {/* Short Description */}
        {theme.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
            {theme.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(theme.tags || []).slice(0, 3).map((tag, i) => (
            <span 
              key={i} 
              className="bg-gray-800/60 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-700/60 hover:border-cyan-500/40 transition"
            >
              {tag}
            </span>
          ))}
          {(theme.tags || []).length > 3 && (
            <span className="bg-gray-800/60 text-gray-400 text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-700/60">
              +{theme.tags.length - 3}
            </span>
          )}
        </div>

        {/* Meta Info Row */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-4 pb-4 border-b border-gray-800/70">
          {theme.version && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              v{theme.version}
            </span>
          )}
          {theme.pages_included && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              {theme.pages_included} Pages
            </span>
          )}
          <span className="flex items-center gap-1">
            <FaCheckCircle className="text-green-400 text-[8px]" />
            Lifetime
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link 
            href={`/themes/${theme.slug}`} 
            className="flex-1 text-center bg-gray-800/80 hover:bg-gray-700 text-white py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 border border-gray-700 hover:border-cyan-500/50 flex items-center justify-center gap-1.5 group/btn"
          >
            Details
            <FaArrowRight className="text-[10px] opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </Link>
          <Link 
            href={buyUrl} 
            className="flex-1 text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-1.5"
          >
            <FaShoppingCart className="text-[10px]" />
            Buy Now
          </Link>
        </div>

      </div>
    </motion.div>
  );
}