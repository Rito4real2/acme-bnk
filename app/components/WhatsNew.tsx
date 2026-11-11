'use client';
import React from 'react';
import Link from 'next/link';

const investmentOptions = [
  {
    title: 'Global Stocks & Equities',
    description: 'Gain fractional or full shares in top-tier global corporations. Build a diversified long-term portfolio with dividend-yielding stocks across major international exchanges.',
    badge: 'Equities',
    highlights: ['Real-time market tracking', 'Fractional shares enabled', 'Automated dividend reinvestment'],
  },
  {
    title: 'Cryptocurrencies & Digital Assets',
    description: 'Access high-liquidity digital assets including Bitcoin (BTC), Ethereum (ETH), and vetted altcoin ecosystems. Securely store and trade with institutional-grade custody.',
    badge: 'Crypto',
    highlights: ['24/7 global market access', 'High-security cold storage', 'Instant swap execution'],
  },
];

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    detail: 'Sign up in under 3 minutes with your email and secure password through our encrypted registration portal.',
  },
  {
    number: '02',
    title: 'Verify Your Identity',
    detail: 'Complete our fast KYC verification process to comply with regulatory standards and protect your account assets.',
  },
  {
    number: '03',
    title: 'Fund & Allocate',
    detail: 'Deposit capital via bank transfer or supported channels, then allocate funds instantly into stocks or crypto.',
  },
];

export default function WhatsNew() {
  return (
    <section className="w-full bg-gray-900 py-20 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-cyan-500/20">
            What's New & Investment Hub
          </span>
          <h2 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Diversify Your Wealth: From Stocks to Crypto
          </h2>
          <p className="font-mono text-sm sm:text-base text-gray-400">
            Explore our newly expanded multi-asset platform designed to bridge traditional equity markets with decentralized digital assets.
          </p>
        </div>

        {/* Investment Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {investmentOptions.map((opt, idx) => (
            <div
              key={idx}
              className="bg-gray-800/60 border border-gray-700/60 p-8 rounded-2xl flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-lg group"
            >
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-gray-900 text-amber-400 border border-gray-700 w-fit">
                  {opt.badge}
                </span>
                <h3 className="font-mono text-xl font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                  {opt.title}
                </h3>
                <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {opt.description}
                </p>
                <ul className="flex flex-col gap-2 mt-2">
                  {opt.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 font-mono text-xs text-gray-400">
                      <span className="text-cyan-400 font-bold">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-700/50">
                <Link
                  href="/users/signup"
                  className="font-mono text-xs font-bold text-red-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Start investing in {opt.badge}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Step-by-Step Registration Guide */}
        <div className="w-full bg-gray-800/40 border border-gray-700/40 p-8 sm:p-12 rounded-2xl flex flex-col gap-8 shadow-xl">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <h3 className="font-mono text-xl sm:text-2xl font-bold text-white">
              How to Register & Get Started in 3 Steps
            </h3>
            <p className="font-mono text-xs sm:text-sm text-gray-400">
              Your journey to secure multi-asset investing takes less than 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, sIdx) => (
              <div
                key={sIdx}
                className="bg-gray-900/80 border border-gray-800 p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden"
              >
                <span className="font-mono text-3xl font-black text-gray-700 absolute top-4 right-4 select-none">
                  {st.number}
                </span>
                <h4 className="font-mono text-base font-bold text-white z-10">
                  {st.title}
                </h4>
                <p className="font-mono text-xs text-gray-400 z-10 leading-relaxed">
                  {st.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/users/signup"
              className="bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-mono font-bold text-sm py-3.5 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 text-center"
            >
              Create Your Account Now →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}