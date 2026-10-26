'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';
import TransactionHistoryTable from '@/components/TransactionHistoryTable';
import ProfileDashboardClient from '@/components/ProfileDashboardClient';
import TotalBalance from '@/app/components/TotalBalance';
import AccountDetails from '@/components/AccountDetails';
import UserChatWidget from '@/components/UserChatWidget';
import NavigationBar from '@/app/components/NavigationBar';

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
  country: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ 
    user: UserProfile; 
    transactions: Transaction[];
  } | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const [profileRes, txRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/profile`, {
            cache: 'no-store',
            credentials: 'include'
          }),
          fetch(`${API_BASE_URL}/api/transaction/my-history`, {
            cache: 'no-store',
            credentials: 'include'
          }),
        ]);

        if (!profileRes.ok) {
          router.push('/users/login');
          return;
        }

        const user = await profileRes.json();
        const txData = txRes.ok ? await txRes.json() : null;

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

        setData({ user, transactions: rawTransactions});
      } catch (error) {
        console.error('Failed to fetch dashboard data on client:', error);
        router.push('/users/login');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 font-mono flex items-center justify-center">
        <p className="text-sm text-gray-600 animate-pulse">Loading profile dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { user, transactions } = data;
  const userAvatarUrl = user.avatarUrl || '/images/person.svg';

  return (
    <div className="min-h-screen bg-gray-900 font-mono">
      <main className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header & Stats Client Wrapper */}
          <ProfileDashboardClient user={{ ...user, avatarUrl: userAvatarUrl }} />

          {/* Total Balance Section */}

          <TotalBalance user={ {...user}} />

          {/* Account Details Section */}
          <AccountDetails user={{ ...user }} />

          {/* Transaction History Section */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-[100px] shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-400">Transaction History</h2>
            <TransactionHistoryTable transactions={transactions} />
          </div>

        </div>
      </main>

      {/* Render Support Chat Widget in the bottom right corner */}
      <UserChatWidget user={{ _id: user._id, name: user.fullName }} />

      {/* Render Nav Bar */}
      <NavigationBar />
    </div>
  );
}