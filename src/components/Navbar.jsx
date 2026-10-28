// src/components/Navbar.jsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaHeart, FaUser, FaSignOutAlt, FaDownload, 
  FaChevronDown, FaBars, FaTimes, FaSun, FaMoon, FaAngleRight
} from "react-icons/fa";
import { useTheme } from "next-themes";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";

export default function Navbar({ initialTheme = "dark" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemesHovered, setIsThemesHovered] = useState(false);

  const [menuLinks, setMenuLinks] = useState([]);
  const [categories, setCategories] = useState([]);

  const { currency, setCurrency } = useCurrencyStore();
  const cartCount = useCartWishlistStore((s) => s.cart.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useCartWishlistStore((s) => s.wishlist.length);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: menus } = await supabase.from("menus").select("*").order("order_index");
      if (menus && menus.length > 0) setMenuLinks(menus);

      const { data: cats } = await supabase.from("categories").select("*").order("order_index");
      if (cats) {
        const mainCats = cats.filter(c => !c.parent_id);
        const formattedCats = mainCats.map(main => ({ ...main, subcategories: cats.filter(sub => sub.parent_id === main.id) }));
        setCategories(formattedCats);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !session.user.is_anonymous) {
        const { data: profile } = await supabase.from("profiles").select("role, theme").eq("id", session.user.id).single();
        if (profile?.role === "admin") { setUser(null); } 
        else {
          setUser(session.user);
          if (profile?.theme) setTheme(profile.theme);
        }
      } else { setUser(null); }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && !session.user.is_anonymous) {
        const { data: profile } = await supabase.from("profiles").select("role, theme").eq("id", session.user.id).single();
        if (profile?.role === "admin") { setUser(null); } 
        else {
          setUser(session.user);
          if (profile?.theme) setTheme(profile.theme);
        }
      } else { setUser(null); }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); setIsMenuOpen(false); }, [pathname]);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (user) await supabase.from("profiles").update({ theme: newTheme }).eq("id", user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setTheme(initialTheme);
    router.push("/");
    setIsMenuOpen(false); setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 md:px-6 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 md:gap-3 group z-50 shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-brand-gold to-yellow-300 flex items-center justify-center text-white dark:text-brand-dark font-black text-lg md:text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">T</div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:block">Themes<span className="text-brand-gold">Store</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {menuLinks.map((link) => (
              <Link key={link.id} href={link.href} className={`relative text-sm font-semibold tracking-wide transition-colors hover:text-brand-gold ${pathname === link.href ? "text-brand-gold" : "text-gray-600 dark:text-brand-muted"}`}>{link.name}</Link>
            ))}

            {/* ✅ নতুন Blog লিংক */}
            <Link href="/blog" className={`relative text-sm font-semibold tracking-wide transition-colors hover:text-brand-gold ${pathname.startsWith("/blog") ? "text-brand-gold" : "text-gray-600 dark:text-brand-muted"}`}>Blog</Link>

            <div className="relative" onMouseEnter={() => setIsThemesHovered(true)} onMouseLeave={() => setIsThemesHovered(false)}>
              <Link href="/themes" className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors ${isThemesHovered || pathname.includes("/themes") ? "text-brand-gold" : "text-gray-600 dark:text-brand-muted"}`}>
                Categories <FaChevronDown size={10} className={`transition-transform duration-300 ${isThemesHovered ? "rotate-180" : ""}`} />
              </Link>
              <AnimatePresence>
                {isThemesHovered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-64 z-50">
                    <div className="bg-white/95 dark:bg-[#121214]/95 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-2xl py-2">
                      {categories.map((cat) => (
                        <div key={cat.id} className="relative group/cat">
                          <Link href={`/themes?category=${cat.slug}`} className="flex justify-between items-center px-4 py-3 text-sm text-gray-600 dark:text-brand-muted hover:text-brand-gold dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            {cat.name}
                            {cat.subcategories.length > 0 && <FaAngleRight size={10} />}
                          </Link>
                          {cat.subcategories.length > 0 && (
                            <div className="absolute top-0 left-full hidden group-hover/cat:block w-48 pl-2">
                              <div className="bg-white/95 dark:bg-[#121214]/95 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-xl shadow-xl py-2">
                                {cat.subcategories.map(sub => (
                                  <Link key={sub.id} href={`/themes?category=${sub.slug}`} className="block px-4 py-2 text-sm text-gray-600 dark:text-brand-muted hover:text-brand-gold dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5">{sub.name}</Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="hidden lg:block bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-brand-gold transition-colors">
              <option value="BDT" className="bg-white dark:bg-[#121214]">৳ BDT</option>
              <option value="USD" className="bg-white dark:bg-[#121214]">$ USD</option>
              <option value="EUR" className="bg-white dark:bg-[#121214]">€ EUR</option>
              <option value="INR" className="bg-white dark:bg-[#121214]">₹ INR</option>
            </select>

            {mounted && (
              <button onClick={toggleTheme} className="p-1.5 text-gray-500 dark:text-brand-muted hover:text-brand-gold transition-all">
                {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
            )}
            <button onClick={() => setIsSearchOpen(true)} className="p-1.5 text-gray-500 dark:text-brand-muted hover:text-brand-gold transition-all"><FaSearch size={16} /></button>
            <Link href="/wishlist" className="relative p-1.5 text-gray-500 dark:text-brand-muted hover:text-brand-gold transition-all">
              <FaHeart size={16} />
              {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-brand-gold text-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">{wishCount}</span>}
            </Link>
            <CartDrawer cartCount={cartCount} />

            <div className="relative">
              {user ? (
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-center p-1.5 text-gray-500 dark:text-brand-muted hover:text-brand-gold">
                    <div className="w-6 h-6 rounded-full bg-brand-gold text-white dark:text-black flex items-center justify-center text-[10px] font-bold">{user.email.charAt(0).toUpperCase()}</div>
                  </button>
                  {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50">
                      <Link href="/my-downloads" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-brand-muted hover:text-brand-gold"><FaDownload size={14} /> My Downloads</Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-left"><FaSignOutAlt size={14} /> Logout</button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link href="/account/login" className="flex items-center justify-center p-1.5 text-gray-500 dark:text-brand-muted hover:text-brand-gold"><FaUser size={18} /></Link>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1.5 text-gray-900 dark:text-white">
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white dark:bg-[#09090B] border-r border-gray-100 dark:border-white/10 z-40 md:hidden overflow-y-auto shadow-2xl">
              <div className="flex flex-col p-4 space-y-1">
                {menuLinks.map((link) => (
                  <Link key={link.id} href={link.href} className={`px-4 py-3 rounded-xl text-sm font-semibold ${pathname === link.href ? "bg-brand-gold/10 text-brand-gold" : "text-gray-600 dark:text-brand-muted hover:bg-gray-50 dark:hover:bg-white/5"}`}>{link.name}</Link>
                ))}
                
                {/* ✅ মোবাইল মেনুতে Blog লিংক */}
                <Link href="/blog" className={`px-4 py-3 rounded-xl text-sm font-semibold ${pathname.startsWith("/blog") ? "bg-brand-gold/10 text-brand-gold" : "text-gray-600 dark:text-brand-muted hover:bg-gray-50 dark:hover:bg-white/5"}`}>Blog</Link>

                <p className="text-xs text-gray-400 dark:text-brand-muted uppercase tracking-wider px-4 pt-3 pb-1">Categories</p>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <Link href={`/themes?category=${cat.slug}`} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-brand-muted flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5">{cat.name}</Link>
                    {cat.subcategories.map(sub => (<Link key={sub.id} href={`/themes?category=${sub.slug}`} className="pl-8 pr-4 py-2 block text-sm text-gray-500 dark:text-brand-muted hover:bg-gray-50 dark:hover:bg-white/5">↳ {sub.name}</Link>))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}