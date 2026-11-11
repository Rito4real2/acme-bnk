'use client';
import React, { useState } from 'react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: 'How secure are my account and transactions with Astrofinex Bank?',
    answer: 'Your accounts and communications are protected with multi-factor authentication, JWT token sessions stored in HTTP-Only cookies, and encrypted data layers powered by MongoDB Atlas and secure TLS protocols.',
  },
  {
    id: 2,
    question: 'How do incoming support inquiries and attachments get processed?',
    answer: 'Incoming emails and support replies sent to our subdomain webhook are automatically fetched via Resend, parsed for binary attachments, uploaded securely to Cloudinary, and saved directly to our database for instant viewing in your inbox.',
  },
  {
    id: 3,
    question: 'Can I reply to Support directly from my dashboard?',
    answer: 'Yes! The live client inbox features an integrated reply drawer for each message, allowing you to send responses back to us seamlessly.',
  },
  {
    id: 4,
    question: 'How do I open an account or get started?',
    answer: 'Simply click the "Get started" or "Open Account" button in the hero or footer sections, complete our streamlined digital onboarding form, and gain instant access to your secure client portal.',
  },
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<number | null>(1); // Default first item open

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-gray-900 py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-cyan-500/20">
            Support & Knowledge
          </span>
          <h2 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-mono text-sm sm:text-base text-gray-400">
            Got questions about our banking services or digital ledger architecture? Find answers below.
          </p>
        </div>

        {/* Accordion List */}
        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-gray-800/60 border border-gray-700/60 rounded-xl overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none group"
                >
                  <span className="font-mono text-sm sm:text-base font-bold text-gray-200 group-hover:text-amber-400 transition-colors">
                    {faq.question}
                  </span>
                  <span className="font-mono text-lg font-bold text-cyan-400 ml-4 shrink-0 transition-transform duration-200">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-gray-700/50">
                    <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}