import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import bank from '@/public/images/bank.png';
import globe from '@/public/images/globe.svg';
import chat from '@/public/images/chat.svg';

const LandingPage = () => {
  const footerHighlights = [
    {
      id: 1,
      imageSrc: globe,
      imageAlt: 'Globe Badge',
      defaultText: 'Internet Banking',
    },
    {
      id: 2,
      imageSrc: chat,
      imageAlt: 'chat Badge',
      defaultText: 'Support',
    },
  ];

  return (
     <div className='w-full h-full'>

      {/* Hero Background Section  */}

      <main className='w-full h-[200px] mb-75'>

          <div className='absolute inset-0 -z-10 w-full h-[500px]'>

            <Image
            src={bank}
            alt='Bank background image'
            fill
            sizes="100vw"
            className="object-cover object-center"
            ></Image>

          </div>

        {/* Top Header / Brand */}
        <div className="w-full max-w-7xl mx-auto flex justify-end p-6 sm:p-10">
          <h1 className="text-amber-900 font-mono text-xl sm:text-2xl font-bold tracking-wider bg-white/80 px-3 py-1 rounded">
            ACME BANK
          </h1>
        </div>

        {/* Hero Content / Copy */}
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col gap-4 mt-8">
          <div className="w-full max-w-xl flex flex-col gap-3 bg-white/90 p-6 rounded-lg shadow-sm">
            <span className="font-bold text-2xl sm:text-3xl font-mono text-gray-900">
              Banking Made Easy
            </span>
            <p className="font-mono text-sm sm:text-base text-gray-700">
              Experience a new world of banking, simplified with the new ACME Bank Mobile Banking App.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link 
              className="w-[330px] sm:w-auto text-center bg-red-700 text-white px-6 py-2.5 rounded-lg hover:bg-amber-900 font-medium font-mono text-sm transition shadow"
              href="/users/signup"
            >
              Get started
            </Link>
            <Link 
              className="w-[330px] sm:w-auto text-center bg-white text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-100 font-medium font-mono text-sm transition shadow border border-gray-300"
              href="/users/login"
            >
              Login
            </Link>
          </div>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white w-full pt-10 pb-6 px-4 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">

          {/* Account Prompt */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <p className="font-mono text-sm text-gray-300">Not an ACME user?</p>
            <Link 
              className="font-mono font-bold text-red-600 hover:text-amber-900 transition-colors"
              href="/users/signup"
            >
              Open Account
            </Link>
          </div>

          {/* HIGHLIGHTS SECTION */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full">
            {footerHighlights.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-gray-800 px-6 py-3 rounded-full hover:bg-gray-500 transition-colors min-w-[200px] justify-center"
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain shrink-0 filter invert"
                />
                <span className="text-xs sm:text-sm font-medium tracking-wide font-mono text-gray-200">
                  {item.defaultText}
                </span>
              </div>
            ))}
          </div>

          {/* COPYRIGHT */}
          <div className="border-t border-gray-800 w-full pt-6 mt-4">
            <p className="font-mono text-xs sm:text-sm text-gray-400 text-center">
              © 2026 ACME Bank PLC. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;