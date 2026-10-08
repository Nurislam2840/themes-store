"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [reviews, setReviews] = useState({});
  const [themes, setThemes] = useState([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const exchangeRate = 120;

  useEffect(() => {
    const savedWishlist = localStorage.getItem('nurislam_wishlist');
    const savedCurrency = localStorage.getItem('nurislam_currency');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    localStorage.setItem('nurislam_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('nurislam_currency', currency);
  }, [wishlist, currency]);

  const fetchThemes = async () => {
    setIsLoadingThemes(true);
    const { data, error } = await supabase.from('themes').select('*');
    if (error) {
      console.error('fetchThemes ERROR:', error.message);
      setThemes([]);
    } else {
      setThemes(data || []);
    }
    setIsLoadingThemes(false);
  };

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    const { data, error } = await supabase.from('reviews').select('*');
    if (!error && data) {
      const grouped = data.reduce((acc, rev) => {
        if (!acc[rev.theme_slug]) acc[rev.theme_slug] = [];
        acc[rev.theme_slug].push(rev);
        return acc;
      }, {});
      setReviews(grouped);
    }
    setIsLoadingReviews(false);
  };

  useEffect(() => {
    fetchThemes();
    fetchReviews();
  }, []);

  const toggleWishlist = (theme) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === theme.id);
      if (exists) return prev.filter((item) => item.id !== theme.id);
      return [...prev, theme];
    });
  };
  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  const toggleCurrency = () => setCurrency((prev) => (prev === 'USD' ? 'BDT' : 'USD'));
  const formatPrice = (priceInUSD) => {
    if (currency === 'USD') return `$${priceInUSD}`;
    return `৳${(priceInUSD * exchangeRate).toLocaleString('en-BD')}`;
  };

  const addReview = async (themeSlug, review) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ theme_slug: themeSlug, name: review.name, rating: review.rating, comment: review.comment }])
      .select();
    if (!error && data) {
      setReviews((prev) => ({ ...prev, [themeSlug]: [data[0], ...(prev[themeSlug] || [])] }));
      return { success: true };
    }
    return { success: false, error: error?.message };
  };

  const deleteReview = async (reviewId, themeSlug) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) {
      setReviews((prev) => ({
        ...prev,
        [themeSlug]: (prev[themeSlug] || []).filter(r => r.id !== reviewId)
      }));
      return { success: true };
    }
    return { success: false };
  };

  const getAllReviews = async () => {
    const { data, error } = await supabase.from('reviews').select('*');
    if (!error) return { success: true, reviews: data };
    return { success: false, reviews: [] };
  };

  const getReviews = (themeSlug) => reviews[themeSlug] || [];
  const getAverageRating = (themeSlug) => {
    const themeReviews = reviews[themeSlug] || [];
    if (themeReviews.length === 0) return 0;
    const sum = themeReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / themeReviews.length).toFixed(1);
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('theme-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) return { success: false, error: uploadError.message };

      const { data: urlData } = supabase.storage
        .from('theme-images')
        .getPublicUrl(filePath);

      return { success: true, url: urlData.publicUrl };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const createTheme = async (theme) => {
    const { data, error } = await supabase.from('themes').insert([theme]).select();
    if (!error && data) {
      setThemes((prev) => [data[0], ...prev]);
      return { success: true };
    }
    return { success: false, error: error?.message };
  };

  const updateTheme = async (id, theme) => {
    const { data, error } = await supabase.from('themes').update(theme).eq('id', id).select();
    if (!error && data) {
      setThemes((prev) => prev.map(t => t.id === id ? data[0] : t));
      return { success: true };
    }
    return { success: false, error: error?.message };
  };

  const deleteTheme = async (id) => {
    const { error } = await supabase.from('themes').delete().eq('id', id);
    if (!error) {
      setThemes((prev) => prev.filter(t => t.id !== id));
      return { success: true };
    }
    return { success: false, error: error?.message };
  };

  const createOrder = async (orderData) => {
    const { data, error } = await supabase.from('orders').insert([orderData]).select();
    if (!error && data) return { success: true, order: data[0] };
    return { success: false, error: error?.message };
  };

  const getAllOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) return { success: true, orders: data };
    return { success: false, orders: [] };
  };

  const updateOrderStatus = async (orderId, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) return { success: true };
    return { success: false };
  };

  const deleteOrder = async (orderId) => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (!error) return { success: true };
    return { success: false, error: error?.message };
  };

  return (
    <StoreContext.Provider value={{ 
      wishlist, toggleWishlist, isInWishlist, 
      currency, toggleCurrency, formatPrice,
      addReview, getReviews, getAverageRating, isLoadingReviews, deleteReview, getAllReviews,
      themes, isLoadingThemes, createTheme, updateTheme, deleteTheme, fetchThemes, uploadImage,
      createOrder, getAllOrders, updateOrderStatus, deleteOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);