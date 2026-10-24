"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaHeart, FaUser, FaSignOutAlt, FaDownload, 
  FaChevronDown, FaBars, FaTimes, FaCode, FaReact, 
  FaWordpress, FaHtml5, FaLayerGroup 
} from "react-icons/fa";
import { useCartWishlistStore } from "@/store/cartWishlistStore";
import { supabase } from "@/lib/supabase";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemesHovered, setIsThemesHovered] = useState(false);

  const cartCount = useCartWishlistStore((s) => s.cart.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useCartWishlistStore((s) => s.wishlist.length);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !session.user.is_anonymous) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        setUser(profile?.role === "admin" ? null : session.user);
      } else {
        setUser(null);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && !session.user.is_anonymous) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        setUser(profile?.role === "admin" ? null : session.user);
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); setIsMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const categories = [
    { name: "All Themes", icon: <FaLayerGroup />, href: "/themes", color: "text-brand-gold" },
    { name: "Next.js", icon: <FaCode />, href: "/themes?category=Next.js", color: "text-white" },
    { name: "React", icon: <FaReact />, href: "/themes?category=React", color: "text-cyan-400" },
    { name: "WordPress", icon: <FaWordpress />, href: "/themes?category=WordPress", color: "text-blue-400" },
    { name: "HTML/CSS", icon: <FaHtml5 />, href: "/themes?category=HTML/CSS", color: "text-orange-400" },
  ];

  const links = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-3 md:px-6 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 md:gap-3 group z-50">
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-brand-gold to-yellow-300 flex items-center justify-center text-brand-dark font-black text-lg md:text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-white hidden sm:block">
              Themes<span className="text-brand-gold">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className={`relative text-sm font-semibold tracking-wide transition-colors hover:text-white ${pathname === "/" ? "text-brand-gold" : "text-brand-muted"}`}>
              Home
            </Link>
            <div className="relative" onMouseEnter={() => setIsThemesHovered(true)} onMouseLeave={() => setIsThemesHovered(false)}>
              <Link href="/themes" className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors ${isThemesHovered || pathname.includes("/themes") ? "text-brand-gold" : "text-brand-muted"}`}>
                Themes <FaChevronDown size={10} className={`transition-transform duration-300 ${isThemesHovered ? "rotate-180" : ""}`} />
              </Link>
              <AnimatePresence>
                {isThemesHovered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-72 z-50">
                    <div className="bg-[#121214]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2">
                      {categories.map((cat, i) => (
                        <Link key={i} href={cat.href} className="flex items-center gap-3 px-4 py-3 text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-colors">
                          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${cat.color}`}>{cat.icon}</div>
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {links.filter(l => l.name !== "Home").map((link) => (
              <Link key={link.name} href={link.href} className={`text-sm font-semibold tracking-wide transition-colors hover:text-white ${pathname === link.href ? "text-brand-gold" : "text-brand-muted"}`}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions (Compact for Mobile) */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button onClick={() => setIsSearchOpen(true)} className="p-1.5 md:p-2 text-brand-muted hover:text-white transition-all">
              <FaSearch size={16} className="md:w-[18px] md:h-[18px]" />
            </button>

            <Link href="/wishlist" className="relative p-1.5 md:p-2 text-brand-muted hover:text-brand-gold transition-all">
              <FaHeart size={16} className="md:w-[18px] md:h-[18px]" />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-gold text-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>

            <CartDrawer cartCount={cartCount} />

            <div className="relative ml-1 md:ml-2">
              {user ? (
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-1.5 py-1.5 md:px-3 md:py-2 rounded-full text-sm font-semibold text-white transition-all">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-brand-gold to-yellow-300 text-black flex items-center justify-center text-[10px] font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-3 w-56 bg-[#121214]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                       <div className="px-4 py-2 border-b border-white/5 mb-2">
                        <p className="text-xs text-brand-muted">Signed in as</p>
                        <p className="text-sm text-white font-semibold truncate">{user.email}</p>
                      </div>
                      <Link href="/my-downloads" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-muted hover:text-white hover:bg-white/5">
                        <FaDownload size={14} /> My Downloads
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 text-left">
                        <FaSignOutAlt size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link href="/account/login" className="flex items-center gap-1.5 bg-brand-gold text-black px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <FaUser size={10} />
                  <span className="hidden sm:block">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1.5 text-white ml-1">
              {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 250 }} className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-[#09090B]/98 backdrop-blur-2xl border-r border-white/10 z-40 md:hidden overflow-y-auto">
              <div className="flex flex-col p-4 space-y-1">
                <Link href="/" className={`px-4 py-3 rounded-xl text-sm font-semibold ${pathname === "/" ? "bg-brand-gold/10 text-brand-gold" : "text-brand-muted"}`}>Home</Link>
                <p className="text-xs text-brand-muted uppercase tracking-wider px-4 pt-3 pb-1">Themes</p>
                {categories.map((cat, i) => (
                  <Link key={i} href={cat.href} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-muted flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center ${cat.color}`}>{cat.icon}</div>
                    {cat.name}
                  </Link>
                ))}
                <p className="text-xs text-brand-muted uppercase tracking-wider px-4 pt-3 pb-1">Pages</p>
                {links.filter(l => l.name !== "Home").map((link) => (
                  <Link key={link.name} href={link.href} className={`px-4 py-3 rounded-xl text-sm font-semibold ${pathname === link.href ? "bg-brand-gold/10 text-brand-gold" : "text-brand-muted"}`}>
                    {link.name}
                  </Link>
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