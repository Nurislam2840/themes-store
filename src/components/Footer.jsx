"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, 
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
    <footer className="relative bg-[#0A0A0C] border-t border-white/5 pt-20 pb-8 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Newsletter (Design same as before) */}
        <div className="bg-gradient-to-r from-[#121214] to-[#0A0A0C] border border-white/5 rounded-3xl p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Stay in the loop</h3>
            <p className="text-brand-muted text-sm max-w-md">Get the latest updates on new theme releases, exclusive discounts, and premium resources.</p>
          </div>
          <form className="relative z-10 w-full md:w-auto flex items-center bg-[#09090B] border border-white/10 rounded-xl p-1.5 focus-within:border-brand-gold transition-colors">
            <input type="email" placeholder="Enter your email" className="bg-transparent text-white text-sm px-4 py-2 outline-none w-full md:w-64 placeholder:text-brand-muted" />
            <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black p-2.5 rounded-lg transition-colors flex items-center justify-center"><FaArrowRight size={14} /></button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-yellow-300 rounded-xl flex items-center justify-center text-brand-dark font-black text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">T</div>
              <span className="text-2xl font-bold tracking-tight text-white">Themes<span className="text-brand-gold">Store</span></span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-8">Discover the best premium themes for your next big project. Beautifully designed, highly optimized.</p>
            <div className="flex items-center gap-3">
              {settings?.facebook && <a href={settings.facebook} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-all hover:-translate-y-1"><FaFacebookF /></a>}
              {settings?.twitter && <a href={settings.twitter} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-sky-500 transition-all hover:-translate-y-1"><FaTwitter /></a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-pink-600 transition-all hover:-translate-y-1"><FaInstagram /></a>}
              {settings?.linkedin && <a href={settings.linkedin} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:-translate-y-1"><FaLinkedinIn /></a>}
            </div>
          </div>

          <div className="lg:pl-8">
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>Home</Link></li>
              <li><Link href="/themes" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>All Themes</Link></li>
              <li><Link href="/pricing" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>Pricing</Link></li>
              <li><Link href="/contact" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Customer Area</h4>
            <ul className="space-y-4">
              <li><Link href="/account/login" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>Login / Register</Link></li>
              <li><Link href="/my-downloads" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>My Downloads</Link></li>
              <li><Link href="/wishlist" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>Wishlist</Link></li>
              <li><Link href="/admin/login" className="text-brand-muted text-sm hover:text-brand-gold flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold"></span>Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-1"><FaMapMarkerAlt size={14} /></div>
                <div><p className="text-xs text-brand-muted mb-1">Our Location</p><p className="text-white text-sm font-medium">{settings?.location || "Dhaka, Bangladesh"}</p></div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-1"><FaEnvelope size={14} /></div>
                <div><p className="text-xs text-brand-muted mb-1">Email Us</p><a href={`mailto:${settings?.email}`} className="text-white text-sm font-medium hover:text-brand-gold transition-colors">{settings?.email || "imdnur284@gmail.com"}</a></div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-1"><FaPhoneAlt size={14} /></div>
                <div><p className="text-xs text-brand-muted mb-1">Call / WhatsApp</p><a href={`https://wa.me/${settings?.phone?.replace(/\D/g, '')}`} className="text-white text-sm font-medium hover:text-brand-gold transition-colors">{settings?.phone || "+880 1758 496622"}</a></div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-muted text-sm text-center md:text-left flex items-center gap-1">&copy; {currentYear} ThemesStore. Designed with <FaHeart className="text-red-500 text-xs animate-pulse mx-1" /> by MD NUR ISLAM</p>
          <div className="flex items-center gap-4 text-sm text-brand-muted">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}