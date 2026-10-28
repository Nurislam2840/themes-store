// src/app/admin/layout.jsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FaHome, FaSignOutAlt, FaCrown, FaLayerGroup, FaShoppingCart, 
  FaStar, FaCog, FaTag, FaFileAlt, FaImage, FaChartBar, 
  FaList, FaBars, FaTimes, FaDatabase, FaChartPie, FaBlog
} from "react-icons/fa";

const supabase = createClient();

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    let timer;
    const resetTimer = () => setTimeLeft(15 * 60);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          supabase.auth.signOut().then(() => {
            router.push("/admin/login");
            alert("Session expired. Please login again.");
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      clearInterval(timer);
    };
  }, [router, pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <FaCrown /> },
    { name: "Reports (PDF)", href: "/admin/reports", icon: <FaChartPie /> },
    { name: "Themes", href: "/admin/themes", icon: <FaLayerGroup /> },
    { name: "Categories", href: "/admin/categories", icon: <FaDatabase /> },
    { name: "Orders", href: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Reviews", href: "/admin/reviews", icon: <FaStar /> },
    { name: "Blog Posts", href: "/admin/blog", icon: <FaBlog /> }, // ✅ নতুন ব্লগ মেনু
    { name: "Pricing", href: "/admin/pricing", icon: <FaTag /> },
    { name: "Banners", href: "/admin/banners", icon: <FaImage /> },
    { name: "Pages", href: "/admin/pages", icon: <FaFileAlt /> },
    { name: "Stats", href: "/admin/stats", icon: <FaChartBar /> },
    { name: "Features", href: "/admin/features", icon: <FaList /> },
    { name: "Menus", href: "/admin/menus", icon: <FaBars /> },
    { name: "Settings", href: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] flex">
      <aside className="w-64 bg-[#121214] border-r border-white/5 hidden md:flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gold text-black rounded-lg flex items-center justify-center font-bold">T</div>
            <span className="text-white font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === link.href ? "bg-brand-gold/10 text-brand-gold" : "text-brand-muted hover:bg-white/5 hover:text-white"}`}>
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-muted hover:bg-white/5 hover:text-white transition-colors">
            <FaHome /> View Store
          </Link>
          <button onClick={() => { supabase.auth.signOut(); router.push("/admin/login"); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)}></div>
          <aside className="w-64 bg-[#121214] border-r border-white/5 flex flex-col relative z-50">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-gold text-black rounded-lg flex items-center justify-center font-bold">T</div>
                <span className="text-white font-bold">Admin</span>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="text-white"><FaTimes /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${pathname === link.href ? "bg-brand-gold/10 text-brand-gold" : "text-brand-muted"}`}>
                  {link.icon} {link.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        <div className="md:hidden sticky top-0 w-full z-30 bg-[#121214] border-b border-white/5 p-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white"><FaBars size={20} /></button>
          <span className="text-white font-bold">Admin Panel</span>
          <Link href="/" className="text-brand-gold"><FaHome size={18} /></Link>
        </div>
        <div className="flex-1">{children}</div>
      </div>

      <div className="fixed bottom-4 right-4 z-[9999] bg-[#121214] border border-red-500/30 text-red-400 text-xs font-mono px-3 py-1.5 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity">
        Auto Logout: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </div>
    </div>
  );
}