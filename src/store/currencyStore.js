import { create } from "zustand";

const RATES = { BDT: 1, USD: 0.0091, EUR: 0.0084, INR: 0.76 };
const SYMBOLS = { BDT: "৳", USD: "$", EUR: "€", INR: "₹" };

export const useCurrencyStore = create((set, get) => ({
  currency: "BDT", // ডিফল্ট BDT
  setCurrency: (curr) => set({ currency: curr }),
  
  formatPrice: (priceInBDT) => {
    const curr = get().currency;
    const rate = RATES[curr] || 1;
    const converted = priceInBDT * rate;
    
    // USD/EUR এর জন্য ডেসিমাল দেখাবে, BDT/INR এর জন্য রাউন্ড করবে
    if (curr === "USD" || curr === "EUR") {
      return `${SYMBOLS[curr]}${converted.toFixed(2)}`;
    }
    return `${SYMBOLS[curr]}${Math.round(converted)}`;
  }
}));