"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import Link from "next/link";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, 
  FaArrowRight, FaHeart 
} from "react-icons/fa";

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
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Section */}
        <div className="bg-gray-50 dark:bg-gradient-to-r dark:from-[#121214] dark:to-[#0A0A0C] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-2xl">
          <div className="text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Stay in the loop</h3>
            <p className="text-gray-500 dark:text-brand-muted text-sm max-w-md">Get the latest updates on new theme releases, exclusive discounts, and premium resources.</p>
          </div>
          <form className="w-full lg:w-auto flex items-center bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 rounded-xl p-1.5 focus-within:border-brand-gold transition-colors shadow-sm">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent text-gray-900 dark:text-white text-sm px-3 md:px-4 py-2.5 outline-none w-full lg:w-64 placeholder:text-gray-400 dark:placeholder:text-brand-muted"
            />
            <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black p-2.5 md:p-3 rounded-lg transition-colors flex items-center justify-center flex-shrink-0">
              <FaArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Main Footer Grid: Mobile=1 Col, Tablet=2 Col, Desktop=4 Col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-12">
          
          {/* Brand Info */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-300 rounded-xl flex items-center justify-center text-brand-dark font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">T</div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Themes<span className="text-brand-gold">Store</span></span>
            </Link>
            <p className="text-gray-500 dark:text-brand-muted text-sm leading-relaxed mb-6">
              Discover the best premium themes for your next big project. Beautifully designed, highly optimized.
            </p>
            <div className="flex items-center gap-2 mt-auto">
              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"><FaFacebookF size={12} /></a>}
              {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all"><FaTwitter size={12} /></a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] transition-all"><FaInstagram size={12} /></a>}
              {settings?.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all"><FaLinkedinIn size={12} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/themes" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">All Themes</Link></li>
              <li><Link href="/pricing" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Area */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-base mb-4">Customer Area</h4>
            <ul className="space-y-2.5">
              <li><Link href="/account/login" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Login / Register</Link></li>
              <li><Link href="/my-downloads" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">My Downloads</Link></li>
              <li><Link href="/wishlist" className="text-gray-500 dark:text-brand-muted text-sm hover:text-brand-gold transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold text-base mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-0.5">
                  <FaMapMarkerAlt size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-brand-muted mb-0.5">Our Location</p>
                  <p className="text-gray-900 dark:text-white text-sm font-medium truncate">{settings?.location || "Dhaka, Bangladesh"}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-0.5">
                  <FaEnvelope size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-brand-muted mb-0.5">Email Us</p>
                  <a href={`mailto:${settings?.email}`} className="text-gray-900 dark:text-white text-sm font-medium hover:text-brand-gold transition-colors break-all">{settings?.email || "imdnur284@gmail.com"}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-0.5">
                  <FaPhoneAlt size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-brand-muted mb-0.5">Call / WhatsApp</p>
                  <a href={`https://wa.me/${settings?.phone?.replace(/\D/g, '')}`} className="text-gray-900 dark:text-white text-sm font-medium hover:text-brand-gold transition-colors">{settings?.phone || "+880 1758 496622"}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-brand-muted text-xs text-center md:text-left flex items-center justify-center md:justify-start gap-1 flex-wrap">
            &copy; {currentYear} ThemesStore. Designed with <FaHeart className="text-red-500 text-[10px] animate-pulse" /> by <span className="text-gray-900 dark:text-white hover:text-brand-gold transition-colors font-medium cursor-pointer">MD NUR ISLAM</span>
          </p>
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