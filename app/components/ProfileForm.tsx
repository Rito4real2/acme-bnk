'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../lib/locales/i18n';

export interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  country?: string;
  balance?: number;
  role?: 'user' | 'admin';
  avatarUrl?: string;
}

interface ProfileSettingsProps {
  initialData?: UserProfile;
}

export default function ProfileSettings({ initialData }: ProfileSettingsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Profile Info States
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [userName, setUserName] = useState(initialData?.userName || '');
  const [emailAddress, setEmailAddress] = useState(initialData?.emailAddress || '');
  const [gender, setGender] = useState(initialData?.gender || 'other');
  const [country, setCountry] = useState(initialData?.country || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Change States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', isError: false });

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileStatus(null);
    setProfileError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName, userName, emailAddress, gender, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || t('profile.errors.update_failed', 'Failed to update profile settings.'));
        return;
      }

      setProfileStatus(data.message || t('profile.success', 'Profile updated successfully!'));
      router.refresh();
    } catch (err) {
      setProfileError(t('profile.errors.connection', 'Unable to connect to server. Please try again.'));
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Change Submission
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ text: '', isError: false });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordMessage({ text: 'New passwords do not match', isError: true });
    }

    if (passwordData.newPassword.length < 6) {
      return setPasswordMessage({ text: 'Password must be at least 6 characters long', isError: true });
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPasswordMessage({ text: 'Password updated successfully!', isError: false });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordMessage({ text: err.message, isError: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-8 font-mono">
      
      {/* SECTION 1: EDIT PROFILE */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-900">
        <h2 className="text-xl font-bold font-mono text-gray-300 mb-4">{t('profile.title', 'Edit Profile')}</h2>

        {profileStatus && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">
            {profileStatus}
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
            {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium font-mono text-red-600">{t('profile.full_name', 'Full Name')}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-900 focus:ring-2 focus:ring-red-500 outline-none bg-gray-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-600">{t('profile.username', 'Username')}</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-900 bg-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-700">{t('profile.email', 'Email Address')}</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-900 bg-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-700">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-900 focus:ring-2 focus:ring-red-500 outline-none bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700">{t('profile.gender', 'Gender')}</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-900 bg-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="male">{t('profile.genders.male', 'Male')}</option>
              <option value="female">{t('profile.genders.female', 'Female')}</option>
              <option value="other">{t('profile.genders.other', 'Other / Prefer not to say')}</option>
            </select>
          </div>

          {initialData?.balance !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-500">{t('profile.account_balance', 'Account Balance')}</label>
              <input
                type="text"
                value={`$${initialData.balance.toFixed(2)}`}
                disabled
                className="w-full p-2 border rounded mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-gray-200 rounded-lg font-medium font-mono transition disabled:opacity-50 cursor-pointer"
          >
            {profileLoading ? t('profile.saving', 'Saving Changes...') : t('profile.save_settings', 'Save Settings')}
          </button>
        </form>
      </div>

      {/* SECTION 2: CHANGE PASSWORD */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-900">
        <h2 className="text-xl font-bold font-mono text-gray-300 mb-4">Change Password</h2>

        {passwordMessage.text && (
          <div className={`p-3 mb-4 rounded text-sm ${passwordMessage.isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {passwordMessage.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-red-700">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full p-2 pr-10 border rounded-md text-gray-900 bg-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {/* Eye Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium font-mono text-red-700">New Password</label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full p-2 pr-10 border rounded-md text-gray-900 bg-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-red-700">Confirm New Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full p-2 pr-10 border rounded-md text-gray-900 bg-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full py-2.5 bg-red-800 hover:bg-redhgg-900 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 cursor-pointer"
          >
            {passwordLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

    </div>
  );
}