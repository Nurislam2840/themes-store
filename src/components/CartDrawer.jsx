// src/components/CartDrawer.jsx
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaTrash, FaPlus, FaMinus, FaTimes, FaSpinner, FaImage, FaLock, FaCoins } from "react-icons/fa";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { useCurrencyStore } from "@/store/currencyStore";
import CustomSelect from "@/components/ui/CustomSelect"; // ✅ কাস্টম সিলেক্ট

export default function CartDrawer({ cartCount }) {
  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity, isHydrated } = useCartWishlistStore();
  const { currency, setCurrency, formatPrice } = useCurrencyStore();
  const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative p-1.5 text-brand-muted hover:text-brand-gold transition-all">
        <FaShoppingBag size={18} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-brand-gold text-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]" onClick={() => setOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-[100dvh] w-full sm:max-w-md bg-[#0E0E11]/95 backdrop-blur-2xl border-l border-white/10 z-[101] flex flex-col shadow-2xl"
            >
              <div className="flex-shrink-0 p-6 border-b border-white/5 bg-gradient-to-r from-[#121214] to-[#0E0E11]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center"><FaShoppingBag className="text-brand-gold" size={18} /></div>
                    <div>
                      <h2 className="text-white font-bold text-xl tracking-tight">Your Cart</h2>
                      <p className="text-brand-muted text-xs font-medium mt-0.5">{cart.reduce((s, i) => s + i.quantity, 0)} items added</p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-brand-muted hover:text-white transition-all"><FaTimes size={16} /></button>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/5">
                  <FaCoins className="text-brand-gold text-xs" />
                  <span className="text-brand-muted text-[10px] uppercase tracking-wider font-semibold">Currency:</span>
                  <div className="w-24">
                    <CustomSelect
                      options={[
                        { value: "BDT", label: "৳ BDT" },
                        { value: "USD", label: "$ USD" },
                        { value: "EUR", label: "€ EUR" },
                        { value: "INR", label: "₹ INR" },
                      ]}
                      value={currency}
                      onChange={setCurrency}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#0E0E11]">
                {!isHydrated ? (
                  <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-brand-gold" /></div>
                ) : cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-brand-muted text-center">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-2"><FaShoppingBag size={40} className="opacity-30" /></div>
                    <h3 className="text-white font-bold text-lg">Your cart is empty</h3>
                    <p className="text-sm max-w-[200px]">Looks like you haven't added anything yet.</p>
                    <button onClick={() => setOpen(false)} className="mt-4 px-6 py-2.5 rounded-lg border border-brand-gold text-brand-gold font-semibold hover:bg-brand-gold hover:text-black transition-colors">Start Shopping</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <motion.div key={item.themeId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                        className="group flex gap-4 bg-[#18181B] rounded-2xl p-3 border border-white/5 hover:border-white/10 transition-all shadow-sm"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#09090B] border border-white/5 flex items-center justify-center">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.title} fill sizes="80px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <FaImage className="text-brand-muted text-2xl opacity-50" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                          <div>
                            <Link href={`/themes/${item.slug}`} onClick={() => setOpen(false)} className="text-white text-sm font-bold line-clamp-1 hover:text-brand-gold transition-colors">{item.title}</Link>
                            <p className="text-brand-gold font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-[#09090B] border border-white/10 rounded-lg p-1">
                              <button onClick={() => updateQuantity(item.themeId, item.quantity - 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/10 transition-all"><FaMinus size={10} /></button>
                              <span className="text-white text-xs font-bold w-8 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.themeId, item.quantity + 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/10 transition-all"><FaPlus size={10} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.themeId)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all" title="Remove item"><FaTrash size={12} /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="flex-shrink-0 border-t border-white/5 p-6 bg-[#0E0E11] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-sm text-brand-muted"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                    <div className="flex justify-between text-sm text-brand-muted"><span>Tax & Fees</span><span className="text-green-400">Calculated at checkout</span></div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/5"><span>Total</span><span className="text-brand-gold">{formatPrice(total)}</span></div>
                  </div>

                  <Link href="/checkout" onClick={() => setOpen(false)} className="relative group block w-full bg-gold-gradient text-black font-bold text-center py-4 rounded-xl overflow-hidden transition-transform hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">Proceed to Checkout <FaLock size={12} className="opacity-70" /></span>
                  </Link>
                  <p className="text-center text-[10px] text-brand-muted mt-3 flex items-center justify-center gap-1"><FaLock /> Secure 256-bit SSL Encrypted Payment</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}