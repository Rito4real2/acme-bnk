'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReceiptModal, { Transaction } from '@/app/components/ReceiptModal';
import TransactionHistoryTable, { Loan } from '@/components/TransactionHistoryTable';
import NavigationBar from '@/app/components/NavigationBar';

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'send' | 'receive' | 'loans'>('all');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions and loans on component mount
  useEffect(() => {
    async function fetchActivityData() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const [txRes, loansRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/transaction/my-history`, {
            cache: 'no-store',
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/users/loans`, {
            cache: 'no-store',
            credentials: 'include',
          }),
        ]);

        const txData = txRes.ok ? await txRes.json() : null;
        const loansData = loansRes.ok ? await loansRes.json() : null;

        // Parse transactions safely
        let rawTransactions: Transaction[] = [];
        if (txData) {
          if (Array.isArray(txData)) {
            rawTransactions = txData;
          } else if (typeof txData === 'object') {
            rawTransactions =
              txData.transactions ||
              txData.data ||
              txData.docs ||
              txData.history ||
              [];
          }
        }

        // Parse loans safely
        let rawLoans: Loan[] = [];
        if (loansData) {
          if (Array.isArray(loansData)) {
            rawLoans = loansData;
          } else if (typeof loansData === 'object') {
            rawLoans =
              loansData.loans ||
              loansData.data ||
              loansData.docs ||
              [];
          }
        }

        setTransactions(rawTransactions);
        setLoans(rawLoans);
      } catch (error) {
        console.error('Failed to fetch transaction and loan history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityData();
  }, []);

  // Filter items based on the active tab selection
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'send') return tx.type?.toUpperCase() === 'WITHDRAWAL' || tx.type?.toUpperCase() === 'SEND';
    if (activeTab === 'receive') return tx.type?.toUpperCase() === 'DEPOSIT' || tx.type?.toUpperCase() === 'RECEIVE';
    return true; // 'all' or 'loans'
  });

  const filteredLoans = activeTab === 'loans' || activeTab === 'all' ? loans : [];

  return (
    <div className="min-h-screen bg-gray-900 font-mono pb-24 text-white">
      <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-700">Transactions & Activity</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your funds, transfers, and applications.</p>
          </div>
          <Link
            href="/users/dashboard"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs transition border border-gray-800 shadow-sm"
          >
            Dashboard
          </Link>
        </div>

        {/* Send & Receive Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/users/send"
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 group"
          >
            <div className="p-3 bg-red-500 rounded-full mb-2 group-hover:scale-110 transition">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <span className="font-bold text-base">Send Funds</span>
            <span className="text-xs text-gray-200 mt-0.5">Transfer to bank or crypto</span>
          </Link>

          <Link
            href="/users/receive"
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-800 to-gray-800 hover:from-gray-700 hover:to-gray-700 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 border border-gray-700 group"
          >
            <div className="p-3 bg-green-600 rounded-full mb-2 group-hover:scale-110 transition">
              <svg className="w-6 h-6 text-green-200 hover:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span className="font-bold text-base">Receive Funds</span>
            <span className="text-xs text-gray-400 mt-0.5">Top up account</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-800 pb-3 overflow-x-auto">
          {(['all', 'send', 'receive', 'loans'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-red-700 text-white shadow'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transaction History Section */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-300 capitalize">{activeTab} Activity</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm animate-pulse">Loading activity...</div>
          ) : (
            <TransactionHistoryTable 
              transactions={activeTab === 'loans' ? [] : filteredTransactions} 
              loans={filteredLoans} 
            />
          )}
        </div>

      </main>

      {/* Navigation Bar */}
      <NavigationBar />
    </div>
  );
}