// src/store/cartWishlistStore.js
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

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

const saveToLocal = (cart, wishlist) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("guest_cart", JSON.stringify(cart));
  localStorage.setItem("guest_wishlist", JSON.stringify(wishlist));
};

const clearLocal = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("guest_cart");
  localStorage.removeItem("guest_wishlist");
};

export const useCartWishlistStore = create((set, get) => ({
  ...loadFromLocal(),
  isHydrated: false,

  hydrate: async () => {
    const userId = await getUserId();
    
    if (!userId) {
      const { cart, wishlist } = loadFromLocal();
      set({ cart, wishlist, isHydrated: true });
      return;
    }

    const guestData = loadFromLocal();
    
    // ✅ Guest Data মার্জ করা
    if (guestData.cart.length > 0) {
      for (const item of guestData.cart) {
        await supabase.rpc("add_to_cart", { p_theme_id: item.themeId, p_qty: item.quantity });
      }
    }
    if (guestData.wishlist.length > 0) {
      for (const item of guestData.wishlist) {
        await supabase.from("wishlist_items").upsert({ user_id: userId, theme_id: item.themeId }, { onConflict: "user_id,theme_id" });
      }
    }
    
    // মার্জ শেষে লোকাল স্টোরেজ ক্লিয়ার
    clearLocal();

    const [{ data: cartRows }, { data: wishRows }] = await Promise.all([
      supabase.from("cart_items").select("theme_id, quantity").eq("user_id", userId),
      supabase.from("wishlist_items").select("theme_id").eq("user_id", userId),
    ]);

    const cartThemeIds = (cartRows ?? []).map(r => r.theme_id);
    const wishThemeIds = (wishRows ?? []).map(r => r.theme_id);
    const allThemeIds = [...new Set([...cartThemeIds, ...wishThemeIds])];

    if (allThemeIds.length === 0) {
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
      return { themeId: r.theme_id, quantity: r.quantity, title: t.title, price: t.price, slug: t.slug, image_url: t.image_url, category: t.category };
    }).filter(Boolean);

    const wishlist = (wishRows ?? []).map(r => {
      const t = themeMap[r.theme_id];
      if (!t) return null;
      return { themeId: r.theme_id, title: t.title, price: t.price, slug: t.slug, image_url: t.image_url, category: t.category };
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
      newCart = [...currentCart, { themeId: theme.id, quantity: qty, title: theme.title, price: theme.price, slug: theme.slug, image_url: theme.image_url, category: theme.category }];
    }

    set({ cart: newCart });

    if (!userId) {
      saveToLocal(newCart, get().wishlist);
      return;
    }
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
      newWishlist = [...get().wishlist, { themeId: theme.id, title: theme.title, price: theme.price, slug: theme.slug, image_url: theme.image_url, category: theme.category }];
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