'use client';

import Link from 'next/link';
import NavigationBar from '@/app/components/NavigationBar';

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-gray-900 font-mono pb-24 text-white flex flex-col justify-between">
      <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-700">Investments</h1>
            <p className="text-sm text-gray-400 mt-1">Grow your wealth with our upcoming plans.</p>
          </div>
          <Link
            href="/users/dashboard"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs transition border border-gray-800 shadow-sm"
          >
            Dashboard
          </Link>
        </div>

        {/* Centered Coming Soon Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl text-center space-y-3 max-w-md w-full">
            <div className="w-12 h-12 bg-red-700/10 text-red-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🚀
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Investments Coming Soon</h2>
            <p className="text-sm text-gray-400">
              We are working hard behind the scenes to bring you exciting investment opportunities. Stay tuned!
            </p>
          </div>
        </div>

      </main>

      {/* Navigation Bar */}
      <NavigationBar />
    </div>
  );
}