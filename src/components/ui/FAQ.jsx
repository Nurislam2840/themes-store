"use client";

import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: 'How do I download my purchased theme?', a: 'After successful payment and verification, a download link will be sent to your email address within 1 minute.' },
    { q: 'What payment methods do you accept?', a: 'We accept bKash and Nagad personal transfers. Our payment number is 01758496622.' },
    { q: 'Do you offer support for the themes?', a: 'Yes! We provide 24/7 support for all our premium themes. You can contact us via WhatsApp or email.' },
    { q: 'Can I use the theme for multiple projects?', a: 'It depends on your license. A Personal license allows 1 project, while a Commercial license allows multiple projects.' },
  ];

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400">Find answers to common questions about our themes.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-white hover:bg-gray-800/50 transition"
              >
                <span className="pr-4">{faq.q}</span>
                <span className="text-cyan-400 flex-shrink-0">{openIndex === index ? <FaMinus /> : <FaPlus />}</span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5 text-gray-400 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}