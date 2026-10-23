"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCartWishlistStore } from "@/store/cartWishlistStore";

export function StoreHydrator() {
  const hydrate = useCartWishlistStore((s) => s.hydrate);

  useEffect(() => {
    // প্রথমবার হাইড্রেট করার চেষ্টা
    hydrate();

    // সেশন স্টেট পরিবর্তন (লগইন/লগআউট) হলে আবার হাইড্রেট
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        hydrate();
      }
      if (event === "SIGNED_OUT") {
        useCartWishlistStore.setState({ cart: [], wishlist: [], isHydrated: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [hydrate]);

  return null;
}