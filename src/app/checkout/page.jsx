"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FaCheckCircle, FaMobileAlt, FaInfoCircle, FaShoppingCart } from 'react-icons/fa';
import { useStore } from '@/context/StoreContext';

function CheckoutContent() {
  const { createOrder } = useStore();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const themeSlug = searchParams.get('theme') || 'nurislam-logistics';
  const themeTitle = searchParams.get('title') || 'Selected Theme';
  const themePrice = searchParams.get('price') || '49';

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    bkash_number: '',
    transaction_id: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const orderData = {
      ...form,
      theme_slug: themeSlug,
      theme_title: themeTitle,
      price: `$${themePrice}`,
      status: 'pending'
    };

    const result = await createOrder(orderData);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setForm({ customer_name: '', customer_email: '', customer_phone: '', bkash_number: '', transaction_id: '' });
    } else {
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto w-full flex-grow">

      {isSuccess ? (
        <div className="bg-gray-900 border border-green-500/30 rounded-3xl p-10 text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            <FaCheckCircle />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 text-white">Order Submitted!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Thank you! Your payment info has been received. Our team is verifying your transaction. <br /><br />
            <span className="text-cyan-400 font-semibold">It will take up to 1 minute.</span> You'll receive your download link via email once approved.
          </p>
          <Link href="/" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-xl transition inline-block">
            Back to Store
          </Link>
        </div>
      ) : (
        <div>
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-xs font-bold tracking-widest mb-2">THEMES STORE</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Complete Your Payment</h1>
            <p className="text-gray-400">Follow the steps below to purchase your theme.</p>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-3xl p-6 mb-8">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FaShoppingCart /> Your Order
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg md:text-xl font-bold text-white">{themeTitle}</h4>
                <p className="text-xs text-gray-400 mt-1">Themes Store License • Lifetime Access</p>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-bold text-cyan-400">${themePrice}</p>
                <p className="text-xs text-gray-500">USD</p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              ❌ {errorMsg}
            </div>
          )}

          {/* Step 1: Instructions */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
              Send Money
            </h3>
            
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl text-center mb-4">
              <p className="text-sm text-gray-400 mb-2">Send Money (Personal) to:</p>
              <p className="text-4xl font-extrabold text-cyan-400 mb-2 tracking-wider">01758496622</p>
              <p className="text-sm text-gray-400">bKash / Nagad (Personal)</p>
            </div>

            <div className="flex items-start gap-3 text-sm text-yellow-400/80 bg-yellow-500/5 p-4 rounded-lg border border-yellow-500/20">
              <FaInfoCircle className="mt-1 flex-shrink-0" />
              <p>Please send the exact amount. After sending the money, copy the Transaction ID (TrxID) from your bKash/Nagad app and fill the form below.</p>
            </div>
          </div>

          {/* Step 2: Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
              Verify Payment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Full Name</label>
                <input type="text" name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="e.g. Nur Islam" required 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Email Address</label>
                <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange} placeholder="you@example.com" required 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Phone Number</label>
                <input type="text" name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="e.g. 017XXXXXXXX" required 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white text-sm" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">bKash/Nagad Number You Sent From</label>
                <input type="text" name="bkash_number" value={form.bkash_number} onChange={handleChange} placeholder="e.g. 017XXXXXXXX" required 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white text-sm" />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Transaction ID (TrxID)</label>
                <input type="text" name="transaction_id" value={form.transaction_id} onChange={handleChange} placeholder="e.g. 8N7A6D5F4G" required 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white text-sm" />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 mt-4">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaMobileAlt /> Submit Payment Info
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="pt-32 pb-20 flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </main>
  );
}