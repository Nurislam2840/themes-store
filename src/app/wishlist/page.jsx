// src/app/wishlist/page.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaTrash, FaShoppingBag, FaSpinner } from "react-icons/fa";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { useAlert } from "@/providers/AlertProvider";
import { useEffect } from "react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, isHydrated, hydrate } = useCartWishlistStore();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  if (!isHydrated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <FaSpinner className="text-4xl text-brand-gold animate-spin" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-brand-muted px-6 text-center">
        <FaHeart size={56} className="opacity-20" />
        <h1 className="text-2xl text-white font-bold">Your wishlist is empty</h1>
        <p>Save themes you love for later.</p>
        <Link href="/" className="mt-2 text-brand-gold underline hover:opacity-80">
          Browse themes
        </Link>
      </div>
    );
  }

  const handleAddToCart = async (item) => {
    await addToCart({
      id: item.themeId,
      title: item.title,
      price: item.price,
      slug: item.slug,
      image_url: item.image_url,
      category: item.category,
    });
    showAlert("Added to cart", "success");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 flex items-center gap-3">
        <FaHeart className="text-brand-gold" size={28} />
        My Wishlist
        <span className="text-brand-muted text-lg font-medium">({wishlist.length})</span>
      </h1>

      <div className="space-y-4">
        {wishlist.map((item) => (
          <div
            key={item.themeId}
            className="bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center hover:border-brand-gold/30 transition-colors"
          >
            <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-brand-border flex items-center justify-center">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 640px) 100vw, 96px" className="object-cover" />
              ) : (
                <FaHeart className="text-brand-muted text-2xl opacity-30" />
              )}
            </div>

            <div className="flex-1 min-w-0 w-full">
              <Link
                href={`/themes/${item.slug}`}
                className="text-white font-semibold hover:text-brand-gold transition-colors line-clamp-1 text-lg"
              >
                {item.title}
              </Link>
              <p className="text-brand-gold font-bold mt-1">${item.price}</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleAddToCart(item)}
                className="flex-1 sm:flex-none bg-gold-gradient text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <FaShoppingBag /> Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.themeId)}
                className="p-3 text-brand-muted hover:text-red-400 transition"
                aria-label="Remove from wishlist"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}