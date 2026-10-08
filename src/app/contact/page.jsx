"use client";

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500 flex flex-col">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex-grow w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact & Support</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Have a question or need help with a theme? We are here for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            
            {/* WhatsApp / Call Card */}
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl flex items-start gap-6 hover:border-cyan-500/50 transition">
              <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                <FaPhoneAlt />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">WhatsApp / Call</h3>
                <a 
                  href="tel:+8801758496622" 
                  className="text-white text-lg font-semibold hover:text-cyan-400 transition block"
                >
                  01758496622
                </a>
                <p className="text-cyan-400 text-sm mt-1">Available 24/7 for urgent issues</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl flex items-start gap-6 hover:border-cyan-500/50 transition">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <a 
                  href="mailto:imdnur284@gmail.com" 
                  className="text-white text-lg font-semibold hover:text-cyan-400 transition break-all block"
                >
                  imdnur284@gmail.com
                </a>
                <p className="text-cyan-400 text-sm mt-1">We reply within 12 hours</p>
              </div>
            </div>

            {/* WhatsApp Quick Button */}
            <a 
              href="https://wa.me/8801758496622" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-3xl flex items-center justify-center gap-3 font-bold text-lg transition shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <FaWhatsapp className="text-2xl" />
              Chat on WhatsApp Now
            </a>

          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            
            {isSubmitted && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
                ✅ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input 
                type="text" 
                placeholder="Your Name" 
                required 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white" 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                required 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white" 
              />
              <textarea 
                placeholder="How can we help you?" 
                rows="4" 
                required 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition text-white"
              ></textarea>
              <button 
                type="submit" 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}