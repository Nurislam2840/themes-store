// src/store/cartWishlistStore.js
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// লোকাল স্টোরেজ থেকে কার্ট ও উইশলিস্ট লোড
const loadFromLocal = () => {
  if (typeof window === "undefined") return { cart: [], wishlist: [] };
  try {
    const cart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    const wishlist = JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
    return { cart, wishlist };
  } catch {
    return { cart: [], wishlist: [] };
  }
};

// লোকাল স্টোরেজে কার্ট ও উইশলিস্ট সেভ
const saveToLocal = (cart, wishlist) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("guest_cart", JSON.stringify(cart));
  localStorage.setItem("guest_wishlist", JSON.stringify(wishlist));
};

export const useCartWishlistStore = create((set, get) => ({
  ...loadFromLocal(),
  isHydrated: false,

  hydrate: async () => {
    const userId = await getUserId();
    
    // ইউজার লগইন না করলে লোকাল স্টোরেজ থেকে ডেটা নেবে
    if (!userId) {
      const { cart, wishlist } = loadFromLocal();
      set({ cart, wishlist, isHydrated: true });
      return;
    }

    // লগইন করলে ডাটাবেস থেকে ডেটা আনবে
    const [{ data: cartRows }, { data: wishRows }] = await Promise.all([
      supabase.from("cart_items").select("theme_id, quantity").eq("user_id", userId),
      supabase.from("wishlist_items").select("theme_id").eq("user_id", userId),
    ]);

    const cartThemeIds = (cartRows ?? []).map(r => r.theme_id);
    const wishThemeIds = (wishRows ?? []).map(r => r.theme_id);
    const allThemeIds = [...new Set([...cartThemeIds, ...wishThemeIds])];

    if (allThemeIds.length === 0) {
      // ডাটাবেস খালি থাকলে গেস্ট কার্ট মাইগ্রেট করার ট্রাই করবে
      const guestData = loadFromLocal();
      if (guestData.cart.length > 0 || guestData.wishlist.length > 0) {
        // এখানে চাইলে গেস্ট ডেটা ডাটাবেসে সিঙ্ক করার লজিক বসানো যেতে পারে
        // আপাতত গেস্ট কার্ট ক্লিয়ার করে দিচ্ছি সেফটির জন্য
        localStorage.removeItem("guest_cart");
        localStorage.removeItem("guest_wishlist");
      }
      set({ cart: [], wishlist: [], isHydrated: true });
      return;
    }

    const { data: themesData } = await supabase
      .from("themes")
      .select("id, title, price, slug, image_url, category")
      .in("id", allThemeIds);

    const themeMap = {};
    (themesData ?? []).forEach(t => { themeMap[t.id] = t; });

    const cart = (cartRows ?? []).map(r => {
      const t = themeMap[r.theme_id];
      if (!t) return null;
      return {
        themeId: r.theme_id,
        quantity: r.quantity,
        title: t.title,
        price: t.price,
        slug: t.slug,
        image_url: t.image_url,
        category: t.category,
      };
    }).filter(Boolean);

    const wishlist = (wishRows ?? []).map(r => {
      const t = themeMap[r.theme_id];
      if (!t) return null;
      return {
        themeId: r.theme_id,
        title: t.title,
        price: t.price,
        slug: t.slug,
        image_url: t.image_url,
        category: t.category,
      };
    }).filter(Boolean);

    set({ cart, wishlist, isHydrated: true });
  },

  addToCart: async (theme, qty = 1) => {
    const userId = await getUserId();
    const currentCart = get().cart;
    let newCart;

    const existing = currentCart.find((c) => c.themeId === theme.id);
    if (existing) {
      newCart = currentCart.map((c) => c.themeId === theme.id ? { ...c, quantity: c.quantity + qty } : c);
    } else {
      newCart = [...currentCart, {
        themeId: theme.id,
        quantity: qty,
        title: theme.title,
        price: theme.price,
        slug: theme.slug,
        image_url: theme.image_url,
        category: theme.category,
      }];
    }

    set({ cart: newCart });

    if (!userId) {
      saveToLocal(newCart, get().wishlist); // গেস্ট হলে লোকাল স্টোরেজে সেভ
      return;
    }

    // লগইন থাকলে ডাটাবেসে সেভ
    await supabase.rpc("add_to_cart", { p_theme_id: theme.id, p_qty: qty });
  },

  removeFromCart: async (themeId) => {
    const userId = await getUserId();
    const newCart = get().cart.filter((c) => c.themeId !== themeId);
    set({ cart: newCart });

    if (!userId) {
      saveToLocal(newCart, get().wishlist);
      return;
    }
    await supabase.from("cart_items").delete().eq("user_id", userId).eq("theme_id", themeId);
  },

  updateQuantity: async (themeId, qty) => {
    if (qty <= 0) return get().removeFromCart(themeId);
    const userId = await getUserId();
    const newCart = get().cart.map((c) => c.themeId === themeId ? { ...c, quantity: qty } : c);
    set({ cart: newCart });

    if (!userId) {
      saveToLocal(newCart, get().wishlist);
      return;
    }
    await supabase.from("cart_items").update({ quantity: qty }).eq("user_id", userId).eq("theme_id", themeId);
  },

  toggleWishlist: async (theme) => {
    const userId = await getUserId();
    const exists = get().wishlist.some((w) => w.themeId === theme.id);
    let newWishlist;

    if (exists) {
      newWishlist = get().wishlist.filter((w) => w.themeId !== theme.id);
    } else {
      newWishlist = [...get().wishlist, {
        themeId: theme.id,
        title: theme.title,
        price: theme.price,
        slug: theme.slug,
        image_url: theme.image_url,
        category: theme.category,
      }];
    }

    set({ wishlist: newWishlist });

    if (!userId) {
      saveToLocal(get().cart, newWishlist);
      return;
    }

    if (exists) {
      await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("theme_id", theme.id);
    } else {
      await supabase.from("wishlist_items").insert({ user_id: userId, theme_id: theme.id });
    }
  },

  removeFromWishlist: async (themeId) => {
    const userId = await getUserId();
    const newWishlist = get().wishlist.filter((w) => w.themeId !== themeId);
    set({ wishlist: newWishlist });

    if (!userId) {
      saveToLocal(get().cart, newWishlist);
      return;
    }
    await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("theme_id", themeId);
  },

  clearCart: async () => {
    const userId = await getUserId();
    set({ cart: [] });

    if (!userId) {
      saveToLocal([], get().wishlist);
      return;
    }
    await supabase.from("cart_items").delete().eq("user_id", userId);
  },
}));