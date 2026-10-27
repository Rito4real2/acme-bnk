'use client';
import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react';
import ProfileForm from '@/app/components/ProfileForm';
import AvatarUpload from '@/app/components/AvatarUpload';
import KycUpload from '@/app/components/KycUpload';
import EmailVerification from '@/app/components/EmailVerification';
import UserLogoutButton from '@/app/components/UserLogoutButton';

export default function UserSettingsPage() {
  const [userData, setUserData] = useState({
    avatarUrl: '/images/person.svg',
    emailAddress: '',
    isEmailVerified: false,
    kycStatus: 'NOT_SUBMITTED',
    kycRejectionReason: '',
  });

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/users/profile`, {
        credentials: 'include',
      });
      const data = await res.json();

      // 🔍 DEBUG LOG: Check what the frontend received
    console.log('--- [FRONTEND DEBUG] PROFILE API RESPONSE ---', data.user);

    const user = data.user || (data._id ? data : null);

      if (user) {
        setUserData({
          avatarUrl: user.avatarUrl || '/images/person.svg',
          emailAddress: user.emailAddress || '',
          isEmailVerified: user.isEmailVerified || false,
          kycStatus: user.kycStatus || 'NOT_SUBMITTED',
          kycRejectionReason: user.kycRejectionReason || '',
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, [backendUrl]);

  // Fetch profile on initial load
  useEffect(() => {
    fetchUserProfile();

    // Optional: Re-fetch when user switches back to the tab (handy when testing admin approvals)
    const handleFocus = () => fetchUserProfile();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUserProfile]);

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      {/* Top Back Navigation Bar */}
      <Link 
        href='/users/dashboard'
        className='mb-5 p-4 flex items-center justify-start bg-gray-700 rounded-lg w-full fixed top-0 left-1/2 -translate-x-1/2 hover:bg-gray-600 transition-colors'
      >
        <Image 
          src='/images/back.svg' 
          alt='back' 
          height={20} 
          width={20}
        />
        <span className="text-white text-sm font-mono ml-2">Back to Dashboard</span>
      </Link>

      <div className="max-w-4xl mx-auto space-y-6 mt-12">
        <h1 className="text-2xl font-bold font-mono text-gray-300">User Account Settings</h1>
        
        {/* Avatar Upload Component */}
        <AvatarUpload 
          currentAvatarUrl={userData.avatarUrl} 
          onAvatarUpdated={(newUrl) => setUserData({ ...userData, avatarUrl: newUrl })} 
        />

        {/* Email Verification Component */}
        <EmailVerification 
        key={`${userData.emailAddress}-${userData.isEmailVerified}`}
        email={userData.emailAddress} 
        isVerified={userData.isEmailVerified} />

        {/* KYC Upload Component */}
        <KycUpload 
        key={`${userData.kycStatus}-${userData.kycRejectionReason}`}
        kycStatus={userData.kycStatus}
        rejectionReason={userData.kycRejectionReason}
         />

        {/* Existing Profile Form */}
        <ProfileForm />

        {/* Logout button */}
        <UserLogoutButton />
        
      </div>
    </div>
  );
}