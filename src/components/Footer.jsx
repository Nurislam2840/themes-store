"use client";
import Link from "next/link";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, 
  FaArrowRight, FaHeart 
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", color: "hover:bg-blue-600 hover:border-blue-600" },
    { icon: <FaTwitter />, href: "#", color: "hover:bg-sky-500 hover:border-sky-500" },
    { icon: <FaInstagram />, href: "#", color: "hover:bg-pink-600 hover:border-pink-600" },
    { icon: <FaLinkedinIn />, href: "#", color: "hover:bg-blue-700 hover:border-blue-700" },
    { icon: <FaGithub />, href: "#", color: "hover:bg-gray-700 hover:border-gray-700" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "All Themes", href: "/themes" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact Us", href: "/contact" },
  ];

  const customerLinks = [
    { name: "Login / Register", href: "/account/login" },
    { name: "My Downloads", href: "/my-downloads" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Admin Portal", href: "/admin/login" },
  ];

  return (
    <footer className="relative bg-[#0A0A0C] border-t border-white/5 pt-20 pb-8 overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#121214] to-[#0A0A0C] border border-white/5 rounded-3xl p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Stay in the loop</h3>
            <p className="text-brand-muted text-sm max-w-md">Get the latest updates on new theme releases, exclusive discounts, and premium resources.</p>
          </div>
          <form className="relative z-10 w-full md:w-auto flex items-center bg-[#09090B] border border-white/10 rounded-xl p-1.5 focus-within:border-brand-gold transition-colors">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent text-white text-sm px-4 py-2 outline-none w-full md:w-64 placeholder:text-brand-muted"
            />
            <button type="submit" className="bg-brand-gold hover:bg-brand-gold-hover text-black p-2.5 rounded-lg transition-colors flex items-center justify-center">
              <FaArrowRight size={14} />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-yellow-300 rounded-xl flex items-center justify-center text-brand-dark font-black text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
                T
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Themes<span className="text-brand-gold">Store</span>
              </span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-8">
              Discover the best premium themes for your next big project. Beautifully designed, highly optimized.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-300 ${social.color} hover:-translate-y-1`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-brand-muted text-sm hover:text-brand-gold transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Customer Area</h4>
            <ul className="space-y-4">
              {customerLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-brand-muted text-sm hover:text-brand-gold transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-1">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-1">Our Location</p>
                  <p className="text-white text-sm font-medium">Dhaka, Bangladesh</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-1">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-1">Email Us</p>
                  <a href="mailto:imdnur284@gmail.com" className="text-white text-sm font-medium hover:text-brand-gold transition-colors">imdnur284@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-1">
                  <FaPhoneAlt size={14} />
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-1">Call / WhatsApp</p>
                  <a href="https://wa.me/8801758496622" className="text-white text-sm font-medium hover:text-brand-gold transition-colors">+880 1758 496622</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-muted text-sm text-center md:text-left flex items-center gap-1">
            &copy; {currentYear} ThemesStore. Designed with <FaHeart className="text-red-500 text-xs animate-pulse mx-1" /> by <a href="#" className="text-white hover:text-brand-gold transition-colors font-medium">MD NUR ISLAM</a>
          </p>
          <div className="flex items-center gap-4 text-sm text-brand-muted">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}