"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaHeart, FaShoppingBag, FaCrown } from "react-icons/fa";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { useAlert } from "@/providers/AlertProvider";

export default function ThemeCard({ theme, index }) {
  const addToCart = useCartWishlistStore((s) => s.addToCart);
  const toggleWishlist = useCartWishlistStore((s) => s.toggleWishlist);
  const wishlisted = useCartWishlistStore((s) => s.wishlist.some((w) => w.themeId === theme.id));
  const { showAlert } = useAlert();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(theme);
    showAlert("Added to cart", "success");
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    await toggleWishlist(theme);
    showAlert(wishlisted ? "Removed from wishlist" : "Added to wishlist", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group relative bg-[#121214] rounded-[2rem] p-[2px] transition-all duration-500 hover:-translate-y-2"
    >
      {/* গ্লোয়িং বর্ডার (শুধু হোভারের সময় দেখা যাবে) */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-brand-gold/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10"></div>
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-brand-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      
      {/* মূল কার্ড কন্টেইনার */}
      <div className="relative bg-[#121214] rounded-[2rem] p-3 flex flex-col h-full border border-white/5 group-hover:border-brand-gold/40 transition-colors duration-500 overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>

        {/* Badges */}
        <div className="absolute top-6 left-6 z-30 flex gap-2">
          {theme.is_premium ? (
            <span className="bg-gradient-to-r from-brand-gold to-yellow-300 text-black text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-brand-gold/20">
              <FaCrown size={9} /> PRO
            </span>
          ) : (
            <span className="bg-green-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg">FREE</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-6 right-6 z-30 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            wishlisted ? "bg-red-500 border-red-500 text-white" : "bg-black/50 border-white/20 text-white hover:border-red-500 hover:text-red-500"
          }`}
        >
          <FaHeart size={12} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {/* Image */}
        <Link href={`/themes/${theme.slug}`} className="relative block h-56 w-full overflow-hidden bg-[#09090B] rounded-[1.5rem] shrink-0 z-10">
          <img
            src={theme.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"}
            alt={theme.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-90 pointer-events-none"></div>

          {/* Price */}
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-xl z-20">
            <span className="text-[10px] text-brand-gold mr-1">USD</span>${theme.price}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center z-10">
            <div className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
              Live Preview <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 pt-5 flex flex-col flex-grow z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase">{theme.category}</p>
            <div className="flex items-center gap-1 text-yellow-500 text-xs">
              <FaStar /> <span className="text-white font-medium">5.0</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors line-clamp-1">{theme.title}</h3>
          <p className="text-brand-muted text-xs leading-relaxed line-clamp-2 mb-5 flex-grow">{theme.description}</p>

          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
            <Link href={`/themes/${theme.slug}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-center py-2.5 rounded-xl text-sm font-semibold transition-all">
              Details
            </Link>
            <button onClick={handleAddToCart} className="flex-1 bg-brand-gold hover:bg-brand-gold-hover text-black text-center py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              <FaShoppingBag size={12} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}