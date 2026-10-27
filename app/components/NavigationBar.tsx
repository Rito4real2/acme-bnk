import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  isAction?: boolean;
}

const NavigationBar = () => {
  const navItems: NavItem[] = [
    { name: 'Home', href: '/users/dashboard', icon: '/images/home.svg' },
    { name: 'invest', href: '/dashboard/invest', icon: '/images/investment.svg' },
    { name: 'Transfer', href: '/dashboard/transfer', icon: '/images/send.svg', isAction: true },
    { name: 'Loan', href: '/dashboard/loan', icon: '/images/loan.svg' },
    { name: 'Profile', href: '/users/settings', icon: '/images/person.svg' },
  ];

  return (
    <nav aria-label="Main Navigation" className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-around bg-gray-900/95 backdrop-blur-md rounded-2xl w-full max-w-md px-3 py-2 shadow-2xl border border-gray-800">

        {/* Transfer Link */}
        {navItems.map((item, index) => {
          if (item.isAction) {
            return (
              <div key={index} className="relative flex flex-col items-center">
                <Link
                  href={item.href}
                  className="absolute -top-0 flex items-center justify-center bg-gray-500 hover:bg-gray-400 text-white hover:text-red-600 rounded-full shadow-lg border-4 border-gray-900 w-14 h-14 transition-transform active:scale-95 mt-1"
                  title={item.name}
                >
                  <Image
                    src={item.icon}
                    width={24}
                    height={24}
                    alt={item.name}
                    className="w-6 h-6 object-contain filter invert"
                  />
                </Link>
                <span className="text-[9px] font-mono text-gray-300 font-bold mt-13 cursor-pointer">
                  {item.name}
                </span>
              </div>
            );
          }

          {/* Other Links */}

          return (
            <Link
              key={index}
              href={item.href}
              title={item.name}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors cursor-pointer w-14"
            >
              <Image
                src={item.icon}
                width={20}
                height={20}
                alt={item.name}
                className="w-5 h-5 object-contain"
              />
              <span className="text-[9px] font-mono mt-1 tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;