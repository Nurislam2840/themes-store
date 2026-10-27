// src/components/ThemeCard.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaHeart, FaShoppingBag, FaCrown } from "react-icons/fa";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useAlert } from "@/providers/AlertProvider";

export default function ThemeCard({ theme, index }) {
  const addToCart = useCartWishlistStore((s) => s.addToCart);
  const toggleWishlist = useCartWishlistStore((s) => s.toggleWishlist);
  const wishlisted = useCartWishlistStore((s) => s.wishlist.some((w) => w.themeId === theme.id));
  const { formatPrice } = useCurrencyStore();
  const { showAlert } = useAlert();

  const handleAddToCart = async (e) => { e.preventDefault(); await addToCart(theme); showAlert("Added to cart", "success"); };
  const handleWishlist = async (e) => { e.preventDefault(); await toggleWishlist(theme); showAlert(wishlisted ? "Removed from wishlist" : "Added to wishlist", "success"); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group relative bg-white dark:bg-[#121214] rounded-[2rem] p-[2px] transition-all duration-500 hover:-translate-y-2"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-brand-gold/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10"></div>
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-brand-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      
      <div className="relative bg-white dark:bg-[#121214] rounded-[2rem] p-3 flex flex-col h-full border border-gray-100 dark:border-white/5 group-hover:border-brand-gold/40 transition-colors duration-500 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none">
        
        <div className="absolute top-6 left-6 z-30 flex gap-2">
          {theme.is_premium ? (
            <span className="bg-gradient-to-r from-brand-gold to-yellow-300 text-white dark:text-black text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-brand-gold/20"><FaCrown size={9} /> PRO</span>
          ) : (<span className="bg-green-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg">FREE</span>)}
        </div>

        <button onClick={handleWishlist} className={`absolute top-6 right-6 z-30 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${wishlisted ? "bg-red-500 border-red-500 text-white" : "bg-white/80 dark:bg-black/50 border-gray-200 dark:border-white/20 text-gray-600 dark:text-white hover:border-red-500 hover:text-red-500"}`}>
          <FaHeart size={12} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        <Link href={`/themes/${theme.slug}`} className="relative block h-56 w-full overflow-hidden bg-gray-50 dark:bg-[#09090B] rounded-[1.5rem] shrink-0 z-10">
          <Image
            src={theme.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"}
            alt={theme.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-95 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>

          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg z-20 flex items-center gap-2">
            {theme.old_price && theme.old_price > theme.price && (<span className="text-xs text-gray-400 line-through">{formatPrice(theme.old_price)}</span>)}
            <span className="text-brand-gold">{formatPrice(theme.price)}</span>
          </div>
        </Link>

        <div className="p-4 pt-5 flex flex-col flex-grow z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase">{theme.category}</p>
            <div className="flex items-center gap-1 text-yellow-500 text-xs"><FaStar /> <span className="text-gray-900 dark:text-white font-medium">5.0</span></div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-gold transition-colors line-clamp-1">{theme.title}</h3>
          <p className="text-gray-500 dark:text-brand-muted text-xs leading-relaxed line-clamp-2 mb-5 flex-grow">{theme.description}</p>

          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
            <Link href={`/themes/${theme.slug}`} className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 text-center py-2.5 rounded-xl text-sm font-semibold transition-all">Details</Link>
            <button onClick={handleAddToCart} className="flex-1 bg-brand-gold hover:bg-brand-gold-hover text-white dark:text-black text-center py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)]">
              <FaShoppingBag size={12} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}