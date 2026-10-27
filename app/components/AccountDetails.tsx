'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
  avatarUrl?: string;
  accountStatus: string;
  accountNumber: string;
  accountType: string;
  currency: string;
}

interface AccountDetailsProps {
  user: UserProfile;
  children?: React.ReactNode;
}

const AccountDetails = ({ user, children }: AccountDetailsProps) => {
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const handleCopyAccount = (accountNumber: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Account Section Card */}
      <section className="bg-gray-800 text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-xl">
        {/* Top Header Row */}
        <div className="flex items-center justify-center rounded-full shadow-sm w-20 px-2 py-0.5 bg-gray-700 text-center">
          <span className="text-xs font-mono tracking-wider text-red-500 uppercase">
            {user.accountStatus}
          </span>
        </div>

        {/* Balance & Account Number Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end pt-4 border-t border-indigo-500/30">
          
          {/* Account Number & Name */}
          <div className="flex flex-col gap-1">

            <div className="flex items-center gap-2">

              <span className="text-xs sm:text-base font-semibold font-mono tracking-wide text-gray-400">
                {user.accountNumber} - {user.accountType}
              </span>

              <button
                type="button"
                onClick={() => handleCopyAccount(user.accountNumber)}
                className="p-1.5 text-xs font-medium font-mono text-gray-300 bg-gray-800 hover:bg-gray-600 active:bg-gray-500 rounded transition cursor-pointer flex items-center justify-center shadow-sm"
                title="Copy Account Number"
              >
                {copiedAcc ? (
                  /* Check Icon */
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  /* Copy Icon */
                  <Image
                  src='/images/copy.svg'
                  alt='Copy'
                  width={20}
                  height={20}
                  ></Image>
                )}
              </button>

            </div>

            <p className="font-bold text-white font-mono text-sm sm:text-base">{user.fullName}</p>
          </div>

          {/* Balance & Eye Toggle */}
          <div className="sm:text-right flex flex-col sm:items-end w-full">

            <div className="flex items-center justify-between gap-2 mb-1 sm:justify-end w-62.5">

              <span className="text-xs text-gray-400 font-bold font-mono">Available Balance</span>

              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-200 hover:text-white transition cursor-pointer p-1"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? (
                  /* Eye Open Icon */
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  /* Eye Closed Icon */
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>

            </div>

            <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              {showBalance 
                ? `${user.currency}${user.balance !== undefined ? user.balance.toFixed(2) : '0.00'}`
                : `${user.currency}••••••`
              }
            </p>

          </div>

        </div>
      </section>

      {/* Main Action Buttons (Withdraw / Deposit) */}
      <main className="grid grid-cols-2 gap-4 w-full max-w-xl">
        {/* Action buttons can go here */}
      </main>

      {/* Optional Children Container */}
      {children && <div className="w-full max-w-xl">{children}</div>}
    </div>
  );
};

export default AccountDetails;