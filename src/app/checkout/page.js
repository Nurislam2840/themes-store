// src/app/checkout/page.js
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { useAlert } from "@/providers/AlertProvider";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { FaLock, FaSpinner, FaShoppingBag } from "react-icons/fa";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showAlert } = useAlert();

  const { cart, isHydrated } = useCartWishlistStore();
  const singleSlug = searchParams.get("theme");

  const [singleTheme, setSingleTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "Dhaka, Bangladesh",
  });

  useEffect(() => {
    const init = async () => {
      if (singleSlug) {
        const { data, error } = await supabase
          .from("themes")
          .select("id, title, price, slug")
          .eq("slug", singleSlug)
          .single();
        if (error || !data) {
          showAlert("Theme not found", "error");
          router.push("/");
          return;
        }
        setSingleTheme(data);
      }
      setLoading(false);
    };
    init();
  }, [singleSlug, router, showAlert]);

  useEffect(() => {
    const prefillEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !session.user.is_anonymous) {
        setForm((prev) => ({ ...prev, email: session.user.email || "" }));
      }
    };
    prefillEmail();
  }, []);

  const items = singleTheme
    ? [{ themeId: singleTheme.id, title: singleTheme.title, price: singleTheme.price, quantity: 1, slug: singleTheme.slug }]
    : cart;

  // UI-তে দেখানোর জন্য দাম হিসাব
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      showAlert("Your cart is empty", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.is_anonymous) {
        setIsSubmitting(false);
        showAlert("Please login or create an account to complete your purchase.", "info");
        router.push("/account/login?redirect=/checkout");
        return;
      }

      // ✅ ফিক্স: এখানে শুধু slug এবং quantity পাঠানো হচ্ছে (দাম বা amount পাঠানো হচ্ছে না)
      const response = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email || session.user.email,
          customerPhone: form.phone,
          customerAddress: form.address,
          items: items.map((i) => ({
            slug: i.slug,
            quantity: i.quantity,
          })),
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.gatewayUrl;
      } else {
        showAlert(data.error || "Payment initialization failed", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong with the payment gateway", "error");
      setIsSubmitting(false);
    }
  };

  if (loading || !isHydrated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <FaSpinner className="text-4xl text-brand-gold animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-brand-muted px-6">
        <FaShoppingBag size={56} className="opacity-20" />
        <h2 className="text-2xl text-white font-bold">Your cart is empty</h2>
        <button onClick={() => router.push("/")} className="text-brand-gold underline">
          Browse themes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Secure Checkout</h1>
        <p className="text-brand-muted">Complete your purchase securely via SSLCommerz.</p>
      </div>

      <div className="bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/30 rounded-3xl p-6 mb-8">
        <h3 className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-3 flex items-center gap-2">
          <FaLock /> Order Summary ({items.length} item{items.length > 1 ? "s" : ""})
        </h3>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-white">{item.title}</h4>
                <p className="text-xs text-brand-muted">Qty: {item.quantity || 1}</p>
              </div>
              <p className="text-lg font-bold text-brand-gold">
                ৳{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-brand-gold/20 mt-4 pt-4 flex justify-between items-center">
          <span className="text-white font-semibold">Total</span>
          <span className="text-2xl font-bold text-brand-gold">৳{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6">Billing Details</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-brand-muted mb-2">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-gold transition text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-2">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-gold transition text-white text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-brand-muted mb-2">Phone Number</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="017XXXXXXXX" required className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-gold transition text-white text-sm" />
          </div>

          <div className="pt-4 mt-4 border-t border-brand-border/50">
            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-70 text-brand-dark font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 mt-4 text-lg">
              {isSubmitting ? (
                <><div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div> Processing...</>
              ) : (
                <>Pay Now (৳{total.toFixed(2)})</>
              )}
            </button>
            <p className="text-center text-xs text-brand-muted mt-4 flex items-center justify-center gap-2">
              <FaLock /> Secure payment processed by SSLCommerz
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-brand-dark text-white font-sans">
      <Suspense fallback={<div className="pt-32 flex justify-center"><FaSpinner className="text-4xl text-brand-gold animate-spin" /></div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}