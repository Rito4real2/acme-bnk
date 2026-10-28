'use client';
import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react';
import ProfileForm from '@/app/components/ProfileForm';
import AvatarUpload from '@/app/components/AvatarUpload';
import KycUpload from '@/app/components/KycUpload';
import EmailVerification from '@/app/components/EmailVerification';
import UserLogoutButton from '@/app/components/UserLogoutButton';
import NavigationBar from '@/app/components/NavigationBar';

export default function UserSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
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

  const edit = {id: 1, src: '/images/edit.svg'}

  return (
    <div className="min-h-screen bg-gray-800 p-6 pb-30">
      {/* Top Back Navigation Bar */}
      <Link 
        href='/users/dashboard'
        className='mb-5 p-4 flex items-center justify-start bg-gray-700 rounded-b-2xl rounded-bl-2xl w-full fixed top-0 left-1/2 -translate-x-1/2 hover:bg-gray-600 transition-colors'
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

        {/* Profile Details Card with Edit Button */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-900 shadow-sm space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-300">Account Information</h2>
            <button
              onClick={() => setIsEditing(true)}
              title='Edit'
              className="flex px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer font-mono"
            >
              <Image src={edit.src} height={20} width={20} alt='Edit'></Image>
              Edit Profile
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Click the button above to update your personal details, email and currency preference.
          </p>
        </div>

        {/* Modal / Popup Overlay for Profile Form */}
        {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-700 space-y-6 text-white relative my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h2 className="text-2xl font-bold text-red-700">Edit Profile</h2>
              <p className="text-sm text-gray-400 mt-1">
                Update your profile information below.
              </p>
            </div>

            {/* Your Existing Profile Form Wrapped in the Modal */}
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <ProfileForm />
            </div>

          </div>
        </div>
      )}

        {/* Logout button */}
        <UserLogoutButton />
        
      </div>

      {/* Navigation Bar */}
        <NavigationBar />
    </div>
  );
}