"use client";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { useAlert } from "@/providers/AlertProvider";

export default function ThemeDetailActions({ theme }) {
  const addToCart = useCartWishlistStore((s) => s.addToCart);
  const toggleWishlist = useCartWishlistStore((s) => s.toggleWishlist);
  const wishlisted = useCartWishlistStore((s) =>
    s.wishlist.some((w) => w.themeId === theme.id)
  );
  const inCart = useCartWishlistStore((s) =>
    s.cart.some((c) => c.themeId === theme.id)
  );
  const { showAlert } = useAlert();

  const handleAdd = async () => {
    await addToCart(theme);
    showAlert("Added to cart", "success");
  };

  const handleWish = async () => {
    await toggleWishlist(theme);
    showAlert(wishlisted ? "Removed from wishlist" : "Added to wishlist", "success");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleAdd}
        disabled={inCart}
        className="flex-1 bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2"
      >
        <FaShoppingBag /> {inCart ? "Already in Cart" : "Add to Cart"}
      </button>
      <button
        onClick={handleWish}
        className={`flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border ${
          wishlisted
            ? "bg-brand-gold/10 border-brand-gold text-brand-gold"
            : "bg-brand-card border-brand-border hover:border-brand-gold text-white"
        }`}
      >
        <FaHeart fill={wishlisted ? "currentColor" : "none"} />
        {wishlisted ? "In Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}