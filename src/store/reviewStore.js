import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,

  fetchReviews: async (themeId) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("theme_id", themeId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      set({ reviews: data });
    }
    set({ isLoading: false });
  },

  addReview: async (reviewData) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "You must be logged in to review." };
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          theme_id: reviewData.themeId,
          user_id: userId,
          reviewer_name: reviewData.name,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      set((state) => ({ reviews: [data, ...state.reviews] }));
      return { success: true };
    }
    return { success: false, error: error?.message || "Failed to submit." };
  },
}));