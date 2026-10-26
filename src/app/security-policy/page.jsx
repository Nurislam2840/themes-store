import Link from "next/link";
import { FaShieldAlt, FaArrowLeft, FaEnvelope, FaCheckCircle } from "react-icons/fa";

export const metadata = {
  title: "Security Policy | ThemesStore",
  description: "Report security vulnerabilities responsibly.",
};

export default function SecurityPolicyPage() {
  return (
    <main className="min-h-screen bg-[#09090B] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to Store
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
            <FaShieldAlt /> Security
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Security <span className="text-transparent bg-clip-text bg-gold-gradient">Policy</span>
          </h1>
          <p className="text-brand-muted text-lg">We take security seriously. Help us keep our platform safe.</p>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-4">Responsible Disclosure</h2>
          <p className="text-brand-muted leading-relaxed mb-6">
            If you discover a security vulnerability in ThemesStore, we appreciate your help in disclosing it to us in a responsible manner.
          </p>

          <h3 className="text-xl font-bold text-white mb-3 mt-8">Guidelines</h3>
          <ul className="space-y-3 text-brand-muted">
            <li className="flex gap-3"><FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" size={14} /> Please do not publicly disclose the vulnerability until we have resolved it.</li>
            <li className="flex gap-3"><FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" size={14} /> Provide detailed steps to reproduce the issue.</li>
            <li className="flex gap-3"><FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" size={14} /> Do not exploit the vulnerability beyond what is necessary to demonstrate the issue.</li>
            <li className="flex gap-3"><FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" size={14} /> Do not access, modify, or delete user data.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mb-3 mt-8">Contact</h3>
          <a href="mailto:imdnur284@gmail.com" className="inline-flex items-center gap-3 bg-brand-gold hover:bg-brand-gold-hover text-black font-bold px-6 py-3 rounded-xl transition-colors">
            <FaEnvelope /> imdnur284@gmail.com
          </a>

          <p className="text-brand-muted text-sm mt-8 pt-6 border-t border-white/5">
            We aim to respond within 72 hours. Thank you for helping keep ThemesStore safe.
          </p>
        </div>
      </div>
    </main>
  );
}