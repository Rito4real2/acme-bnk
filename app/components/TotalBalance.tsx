'use client';

import React, { useState } from 'react';

interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

interface TotalBalanceProps {
  user: UserProfile;
}

export default function TotalBalance({ user }: TotalBalanceProps) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-gray-900 p-3 flex md:flex-row items-center justify-between gap-6 w-full max-w-4xl mx-auto mt-10">
      <div className="flex items-center justify-between w-full p-4 bg-gray-800 rounded-2xl text-white shadow-md">
        
        {/* Left Side: Label */}
        <span className="text-xs sm:text-sm font-mono text-gray-400">Total Balance</span>

        {/* Right Side: Balance & Eye Toggle Button */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm sm:text-base font-mono tracking-tight">
            {showBalance 
              ? `$${user.balance !== undefined ? user.balance.toFixed(2) : '0.00'}`
              : '$••••••'
            }
          </span>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-400 hover:text-white transition cursor-pointer p-1"
            title={showBalance ? "Hide Balance" : "Show Balance"}
          >
            {showBalance ? (
              /* Eye Open Icon */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              /* Eye Closed Icon */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}