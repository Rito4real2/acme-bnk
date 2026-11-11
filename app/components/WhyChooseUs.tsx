import React from 'react';

const steps = [
  {
    step: '01',
    title: 'Instant Account Setup',
    description: 'Sign up in under 3 minutes with our streamlined digital onboarding process. No paperwork, no hidden branch visits—just secure, immediate access to your digital ledger.',
    badge: 'Fast Onboarding',
  },
  {
    step: '02',
    title: 'Bank-Grade Security & Encryption',
    description: 'Your assets and communications are protected by state-of-the-art multi-factor authentication, JWT token sessions, and end-to-end encrypted transaction logs.',
    badge: 'Secure Core',
  },
  {
    step: '03',
    title: 'Global Accessibility & 24/7 Support',
    description: 'Manage your capital across borders with real-time tracking, instant notifications, and direct access to our support inbox whenever you need assistance.',
    badge: 'Always Online',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-gray-900 py-20 px-4 sm:px-6 border-t border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded-full w-fit mx-auto border border-red-500/20">
            Why Choose Astrofinex Bank ?
          </span>
          <h2 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Speed, Security, and Simplicity
          </h2>
          <p className="font-mono text-sm sm:text-base text-gray-400">
            Discover how we are redefining modern banking through transparent engineering and seamless client experiences.
          </p>
        </div>

        {/* Step-by-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/60 border border-gray-700/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:border-red-500/50 transition-all group shadow-lg"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-gray-900 text-cyan-400 border border-gray-700">
                    {item.badge}
                  </span>
                  <span className="font-mono text-2xl font-black text-gray-600 group-hover:text-red-500 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-mono text-lg font-bold text-white tracking-wide">
                  {item.title}
                </h3>
                <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center gap-2 text-xs font-mono text-red-400 group-hover:text-amber-400 transition-colors">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}