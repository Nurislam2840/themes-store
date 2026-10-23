"use client";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useAlert } from "@/providers/AlertProvider";
import { 
  FaEnvelope, FaWhatsapp, FaUser, FaPaperPlane, 
  FaSpinner, FaMapMarkerAlt, FaClock, FaHeadset 
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactPage() {
  const form = useRef();
  const { showAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // EmailJS এনভায়রনমেন্ট ভ্যারিয়েবল থেকে কী নেওয়া হচ্ছে
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // যদি কী সেট না করা থাকে, তবে ডেমো হিসেবে সাকসেস দেখাবে (টেস্টিং এর জন্য)
    if (!serviceId || !templateId || !publicKey) {
      setTimeout(() => {
        showAlert("Demo Mode: Message simulated successfully! (Please set EmailJS keys in .env.local)", "success");
        setIsSubmitting(false);
        form.current.reset();
      }, 1500);
      return;
    }

    try {
      await emailjs.sendForm(serviceId, templateId, form.current, publicKey);
      showAlert("Message sent successfully! We will get back to you soon.", "success");
      form.current.reset();
    } catch (error) {
      console.error(error);
      showAlert("Failed to send message. Please try WhatsApp.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden pt-32 pb-20 px-6">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-card border border-brand-border text-brand-gold text-sm font-medium mb-6">
            <FaHeadset />
            <span>24/7 Customer Support</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gold-gradient">Touch</span>
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">
            Have a question about our themes, licensing, or custom work? Drop us a message and we'll respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Side: Contact Information Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Profile Card */}
            <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-brand-gold/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-2xl rounded-full group-hover:bg-brand-gold/10 transition-all"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-black text-2xl font-bold">
                  NI
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">MD NUR ISLAM</h3>
                  <p className="text-brand-gold text-sm font-medium">Founder & Lead Developer</p>
                </div>
              </div>
              <p className="text-brand-muted text-sm leading-relaxed">
                Passionate about building high-performance web applications and premium digital products.
              </p>
            </div>

            {/* Email Card */}
            <a href="mailto:imdnur284@gmail.com" className="block bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-brand-gold/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider mb-1">Email Us</p>
                  <p className="text-white font-medium text-sm">imdnur284@gmail.com</p>
                </div>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a href="https://wa.me/8801758496622" target="_blank" rel="noopener noreferrer" className="block bg-[#121214] border border-white/5 rounded-2xl p-5 hover:border-green-500/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <FaWhatsapp />
                </div>
                <div>
                  <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider mb-1">WhatsApp</p>
                  <p className="text-white font-medium text-sm">+880 1758 496622</p>
                </div>
              </div>
            </a>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center">
                <FaMapMarkerAlt className="text-brand-gold text-xl mb-2" />
                <p className="text-white font-semibold text-sm">Location</p>
                <p className="text-brand-muted text-xs mt-1">Dhaka, Bangladesh</p>
              </div>
              <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center">
                <FaClock className="text-brand-gold text-xl mb-2" />
                <p className="text-white font-semibold text-sm">Response Time</p>
                <p className="text-brand-muted text-xs mt-1">Within 24 Hours</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-[#121214] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
            <p className="text-brand-muted text-sm mb-8">Fill out the form below and we will contact you shortly.</p>

            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Your Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input 
                      type="text" 
                      name="name" // EmailJS এর {{name}} ভ্যারিয়েবলের সাথে মিলানো হলো
                      required 
                      placeholder="John Doe"
                      className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Your Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input 
                      type="email" 
                      name="email" // EmailJS এর {{email}} ভ্যারিয়েবলের সাথে মিলানো হলো
                      required 
                      placeholder="you@example.com"
                      className="w-full bg-[#09090B] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  name="title" // EmailJS এর {{title}} ভ্যারিয়েবলের সাথে মিলানো হলো
                  required 
                  placeholder="How can we help you?"
                  className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  name="message" // EmailJS এর {{message}} ভ্যারিয়েবলের সাথে মিলানো হলো
                  rows="5" 
                  required 
                  placeholder="Tell us more about your project or inquiry..."
                  className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-brand-gold transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gold-gradient hover:opacity-90 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><FaSpinner className="animate-spin" /> Sending Message...</>
                ) : (
                  <><FaPaperPlane /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}