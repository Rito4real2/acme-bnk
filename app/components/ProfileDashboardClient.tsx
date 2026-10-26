// client/src/app/users/profile/ProfileDashboardClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'

interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
  avatarUrl?: string; // Added avatarUrl field
}

interface ProfileDashboardClientProps {
  user: UserProfile; // For UserLogoutButton
}

export default function ProfileDashboardClient({ user}: { user: UserProfile; }) {
  return (
    <div className="bg-gray-900 p-1 flex md:flex-row items-center justify-between gap-6">
      
      {/* User Info + Avatar */}
      <div className="flex flex-row justify-between items-center gap-4">
        
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-600 shrink-0">
          <Image
            src={user.avatarUrl || '/images/person.svg'}
            alt={`${user.fullName}'Avatar'`}
            fill
            className="object-cover bg-gray-900"
            loading='eager'
          />
        </div>
        
        <div>
          <h1 className='font-medium text-sm font-mono text-white'>Welcome! {user.fullName}</h1>
        </div>
      </div>

    </div>
  );
}