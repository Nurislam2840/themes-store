import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// সেশন পরিবর্তনের লিসেনার
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
      // নতুন ইউজার লগইন করলে কার্ট হাইড্রেট করব
      setTimeout(() => {
        useCartWishlistStore.getState().hydrate();
      }, 100);
    }
    if (event === "SIGNED_OUT") {
      useCartWishlistStore.setState({ cart: [], wishlist: [], isHydrated: false });
    }
  });
}

export const useCartWishlistStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  isHydrated: false,

  hydrate: async () => {
    const userId = await getUserId();
    if (!userId) {
      set({ cart: [], wishlist: [], isHydrated: true });
      return;
    }

    // কার্ট এবং উইশলিস্টের আইডি আনা
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
    if (!userId) return;

    const existing = get().cart.find((c) => c.themeId === theme.id);
    
    if (existing) {
      set({ cart: get().cart.map((c) => c.themeId === theme.id ? { ...c, quantity: c.quantity + qty } : c) });
    } else {
      set({
        cart: [...get().cart, {
          themeId: theme.id,
          quantity: qty,
          title: theme.title,
          price: theme.price,
          slug: theme.slug,
          image_url: theme.image_url,
          category: theme.category,
        }],
      });
    }

    await supabase.rpc("add_to_cart", { p_theme_id: theme.id, p_qty: qty });
  },

  removeFromCart: async (themeId) => {
    const userId = await getUserId();
    if (!userId) return;
    set({ cart: get().cart.filter((c) => c.themeId !== themeId) });
    await supabase.from("cart_items").delete().eq("user_id", userId).eq("theme_id", themeId);
  },

  updateQuantity: async (themeId, qty) => {
    if (qty <= 0) return get().removeFromCart(themeId);
    const userId = await getUserId();
    if (!userId) return;
    set({ cart: get().cart.map((c) => c.themeId === themeId ? { ...c, quantity: qty } : c) });
    await supabase.from("cart_items").update({ quantity: qty }).eq("user_id", userId).eq("theme_id", themeId);
  },

  toggleWishlist: async (theme) => {
    const userId = await getUserId();
    if (!userId) return;
    const exists = get().wishlist.some((w) => w.themeId === theme.id);
    if (exists) {
      set({ wishlist: get().wishlist.filter((w) => w.themeId !== theme.id) });
      await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("theme_id", theme.id);
    } else {
      set({ wishlist: [...get().wishlist, {
          themeId: theme.id,
          title: theme.title,
          price: theme.price,
          slug: theme.slug,
          image_url: theme.image_url,
          category: theme.category,
        }] 
      });
      await supabase.from("wishlist_items").insert({ user_id: userId, theme_id: theme.id });
    }
  },

  removeFromWishlist: async (themeId) => {
    const userId = await getUserId();
    if (!userId) return;
    set({ wishlist: get().wishlist.filter((w) => w.themeId !== themeId) });
    await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("theme_id", themeId);
  },

  clearCart: async () => {
    const userId = await getUserId();
    if (!userId) return;
    set({ cart: [] });
    await supabase.from("cart_items").delete().eq("user_id", userId);
  },
}));