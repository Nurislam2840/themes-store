"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaArrowRight, FaHeart } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="relative bg-white dark:bg-[#0A0A0C] border-t border-gray-200 dark:border-white/5 pt-16 pb-8 overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="bg-gray-50 dark:bg-gradient-to-r dark:from-[#121214] dark:to-[#0A0A0C] border border-gray-200 dark:border-white/5 rounded-3xl p-6 md:p-10 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-2xl relative overflow-hidden">
          <div className="relative z-10 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stay in the loop</h3>
            <p className="text-gray-500 dark:text-brand-muted text-sm max-w-md">Get the latest updates on new theme releases, exclusive discounts, and premium resources.</p>
          </div>
          <form className="relative z-10 w-full lg:w-auto flex items-center bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 rounded-xl p-1.5 focus-within:border-brand-gold transition-colors shadow-sm dark:shadow-none">
            <input type="email" placeholder="Enter your email" className="bg-transparent text-gray-900 dark:text-white text-sm px-4 py-2.5 outline-none w-full lg:w-64 placeholder:text-gray-400 dark:placeholder:text-brand-muted" />
            <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black p-3 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"><FaArrowRight size={14} /></button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-300 rounded-xl flex items-center justify-center text-brand-dark font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">T</div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Themes<span className="text-brand-gold">Store</span></span>
            </Link>
            <p className="text-gray-500 dark:text-brand-muted text-sm leading-relaxed mb-6 max-w-sm">Discover the best premium themes for your next big project. Beautifully designed, highly optimized.</p>
            <div className="flex items-center gap-3">
              {settings?.facebook && <a href={settings.facebook} className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#1877F2] hover:text-white transition-all"><FaFacebookF size={14} /></a>}
              {settings?.twitter && <a href={settings.twitter} className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#1DA1F2] hover:text-white transition-all"><FaTwitter size={14} /></a>}
              {settings?.instagram && <a href={settings.instagram} className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#E1306C] hover:text-white transition-all"><FaInstagram size={14} /></a>}
              {settings?.linkedin && <a href={settings.linkedin} className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#0A66C2] hover:text-white transition-all"><FaLinkedinIn size={14} /></a>}
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-base mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/themes" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">All Themes</Link></li>
              <li><Link href="/pricing" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-base mb-5">Customer Area</h4>
            <ul className="space-y-3">
              <li><Link href="/account/login" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Login / Register</Link></li>
              <li><Link href="/my-downloads" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">My Downloads</Link></li>
              <li><Link href="/wishlist" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-base mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-0.5"><FaMapMarkerAlt size={12} /></div>
                <div><p className="text-xs text-gray-400 dark:text-brand-muted mb-0.5">Our Location</p><p className="text-gray-900 dark:text-white text-sm font-medium">{settings?.location || "Dhaka, Bangladesh"}</p></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-0.5"><FaEnvelope size={12} /></div>
                <div><p className="text-xs text-gray-400 dark:text-brand-muted mb-0.5">Email Us</p><a href={`mailto:${settings?.email}`} className="text-gray-900 dark:text-white text-sm font-medium hover:text-brand-gold transition-colors break-all">{settings?.email || "imdnur284@gmail.com"}</a></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-0.5"><FaPhoneAlt size={12} /></div>
                <div><p className="text-xs text-gray-400 dark:text-brand-muted mb-0.5">Call / WhatsApp</p><a href={`https://wa.me/${settings?.phone?.replace(/\D/g, '')}`} className="text-gray-900 dark:text-white text-sm font-medium hover:text-brand-gold transition-colors">{settings?.phone || "+880 1758 496622"}</a></div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-brand-muted text-xs text-center md:text-left flex items-center gap-1">&copy; {currentYear} ThemesStore. Designed with <FaHeart className="text-red-500 text-[10px] animate-pulse mx-1" /> by <span className="text-gray-900 dark:text-white hover:text-brand-gold transition-colors font-medium cursor-pointer">MD NUR ISLAM</span></p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-brand-muted">
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}