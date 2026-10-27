// src/components/Footer.jsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAlert } from "@/providers/AlertProvider";
import Link from "next/link";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, 
  FaArrowRight, FaHeart, FaSpinner 
} from "react-icons/fa";

const supabase = createClient();

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { showAlert } = useAlert();
  const [settings, setSettings] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }
    setSubscribing(true);
    // এখানে আপনি চাইলে newsletter_subscribers table-এ insert করতে পারেন
    // উদাহরণ:
    // await supabase.from("newsletter_subscribers").insert([{ email: newsletterEmail }]);
    await new Promise((r) => setTimeout(r, 500)); // demo delay
    setSubscribing(false);
    setNewsletterEmail("");
    showAlert("Subscribed successfully!", "success");
  };

  const phoneDigits = settings?.phone?.replace?.(/\D/g, "") ?? "8801758496622";

  return (
    <footer className="relative bg-white dark:bg-[#0A0A0C] border-t border-gray-200 dark:border-white/5 pt-12 md:pt-16 pb-8 overflow-hidden transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Newsletter Section */}
        <div className="bg-gray-50 dark:bg-[#121214] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Stay in the loop</h3>
            <p className="text-gray-500 dark:text-brand-muted text-xs md:text-sm">Get the latest updates on new theme releases.</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center bg-white dark:bg-[#09090B] border border-gray-200 dark:border-white/10 rounded-lg p-1">
            <input 
              type="email" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email" 
              className="bg-transparent text-gray-900 dark:text-white text-xs px-3 py-2 outline-none w-full md:w-56 placeholder:text-gray-400"
            />
            <button type="submit" disabled={subscribing} className="bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-60 text-black p-2 rounded-md transition-colors flex items-center justify-center flex-shrink-0">
              {subscribing ? <FaSpinner className="animate-spin" size={12} /> : <FaArrowRight size={12} />}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-gold text-black rounded-lg flex items-center justify-center font-bold text-lg">T</div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Themes<span className="text-brand-gold">Store</span></span>
            </Link>
            <p className="text-gray-500 dark:text-brand-muted text-xs leading-relaxed mb-4">
              Discover the best premium themes for your project.
            </p>
            <div className="flex items-center gap-2">
              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:text-brand-gold"><FaFacebookF size={12} /></a>}
              {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:text-brand-gold"><FaTwitter size={12} /></a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:text-brand-gold"><FaInstagram size={12} /></a>}
              {settings?.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:text-brand-gold"><FaLinkedinIn size={12} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">Home</Link></li>
              <li><Link href="/themes" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">All Themes</Link></li>
              <li><Link href="/pricing" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">Pricing</Link></li>
              <li><Link href="/contact" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Area */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-3">Customer Area</h4>
            <ul className="space-y-2">
              <li><Link href="/account/login" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">Login / Register</Link></li>
              <li><Link href="/my-downloads" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">My Downloads</Link></li>
              <li><Link href="/wishlist" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">Wishlist</Link></li>
              <li><Link href="/security-policy" className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">Security Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-3">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start justify-center sm:justify-start gap-2">
                <FaMapMarkerAlt className="text-brand-gold mt-0.5" size={12} />
                <span className="text-gray-500 dark:text-brand-muted text-xs break-all">{settings?.location || "Dhaka, Bangladesh"}</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start gap-2">
                <FaEnvelope className="text-brand-gold mt-0.5" size={12} />
                <a href={`mailto:${settings?.email || "imdnur284@gmail.com"}`} className="text-gray-500 dark:text-brand-muted text-xs break-all hover:text-brand-gold">{settings?.email || "imdnur284@gmail.com"}</a>
              </li>
              <li className="flex items-start justify-center sm:justify-start gap-2">
                <FaPhoneAlt className="text-brand-gold mt-0.5" size={12} />
                <a href={`https://wa.me/${phoneDigits}`} className="text-gray-500 dark:text-brand-muted text-xs hover:text-brand-gold">{settings?.phone || "+880 1758 496622"}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 dark:text-brand-muted text-[10px] md:text-xs text-center md:text-left">
            &copy; {currentYear} ThemesStore. Designed with <FaHeart className="text-red-500 inline text-[8px]" /> by MD NUR ISLAM
          </p>
          <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 dark:text-brand-muted">
            <Link href="/privacy" className="hover:text-brand-gold">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
            <Link href="/terms" className="hover:text-brand-gold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}