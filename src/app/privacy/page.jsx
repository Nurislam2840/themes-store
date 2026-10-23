"use client";
import Link from "next/link";
import { FaArrowLeft, FaShieldAlt, FaLock, FaUserShield, FaCookie, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <FaUserShield />,
      title: "1. Information We Collect",
      content: "When you purchase a theme or create an account, we collect personal information such as your name, email address, and payment details. We also collect non-personal data like browser type, IP address, and pages visited to improve our services."
    },
    {
      icon: <FaLock />,
      title: "2. How We Use Your Information",
      content: "Your information is used to process transactions, deliver purchased themes, provide customer support, send order confirmations, and improve our platform. We never sell your data to third parties."
    },
    {
      icon: <FaShieldAlt />,
      title: "3. Data Protection & Security",
      content: "We implement industry-standard security measures including SSL encryption, secure payment gateways (SSLCommerz), and Supabase's secure infrastructure to protect your data from unauthorized access."
    },
    {
      icon: <FaCookie />,
      title: "4. Cookies & Tracking",
      content: "We use cookies to maintain your session, remember your cart, and analyze traffic. You can disable cookies in your browser settings, though some features may not function properly."
    },
    {
      icon: <FaEnvelope />,
      title: "5. Third-Party Services",
      content: "We use trusted third-party services: Supabase (database & auth), SSLCommerz (payments), EmailJS (email delivery). Each has its own privacy policy that we encourage you to review."
    },
    {
      icon: <FaUserShield />,
      title: "6. Your Rights",
      content: "You have the right to access, correct, or delete your personal information at any time. To exercise these rights, contact us at imdnur284@gmail.com."
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090B] relative overflow-hidden pt-32 pb-20 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Store
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6">
            <FaShieldAlt /> Legal Document
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gold-gradient">Policy</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Your privacy matters. Learn how we collect, use, and protect your personal information.
          </p>
          <p className="text-brand-muted/60 text-xs mt-4">Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-brand-gold/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xl flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                  <p className="text-brand-muted leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-brand-gold/10 to-transparent border border-brand-gold/20 rounded-2xl p-6 text-center">
          <p className="text-brand-muted text-sm">
            Questions about our privacy policy? <Link href="/contact" className="text-brand-gold font-semibold hover:underline">Contact us here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}