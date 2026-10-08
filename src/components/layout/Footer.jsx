import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Info */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg">
              T
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Themes Store
            </span>
          </Link>
          <p className="text-sm mb-6 leading-relaxed">
            Premium Next.js, WordPress, and HTML themes designed for developers, agencies, and businesses. Launch your project faster.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-600 hover:border-cyan-600 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-600 hover:border-cyan-600 transition">
              <FaTwitter />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-600 hover:border-cyan-600 transition">
              <FaGithub />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-600 hover:border-cyan-600 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-cyan-400 transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-cyan-400 transition">About Us</Link></li>
            <li><Link href="/#themes" className="hover:text-cyan-400 transition">Browse Themes</Link></li>
            <li><Link href="/pricing" className="hover:text-cyan-400 transition">Pricing Plans</Link></li>
            <li><Link href="/wishlist" className="hover:text-cyan-400 transition">My Wishlist</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/contact" className="hover:text-cyan-400 transition">Contact Us</Link></li>
            <li><Link href="/contact" className="hover:text-cyan-400 transition">FAQ</Link></li>
            <li><Link href="/blog" className="hover:text-cyan-400 transition">Blog</Link></li>
            <li><Link href="#" className="hover:text-cyan-400 transition">Documentation</Link></li>
            <li><Link href="#" className="hover:text-cyan-400 transition">License & Terms</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-4">Get in Touch</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a href="https://wa.me/8801758496622" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan-400 transition">
                <FaWhatsapp className="text-cyan-400 text-lg flex-shrink-0" />
                <span>+880 1758 496622</span>
              </a>
            </li>
            <li>
              <a href="mailto:imdnur284@gmail.com" className="flex items-center gap-3 hover:text-cyan-400 transition break-all">
                <FaEnvelope className="text-cyan-400 text-lg flex-shrink-0" />
                <span>imdnur284@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3">
        <p>&copy; {new Date().getFullYear()} Themes Store. All rights reserved.</p>
        <p className="flex items-center gap-1">Made with <span className="text-red-500">❤️</span> in Bangladesh</p>
      </div>
    </footer>
  );
}