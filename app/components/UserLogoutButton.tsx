'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image'

const logout = { id: 1, src: '/images/logout.svg'}

export default function UserLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    const API_BASED_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    setLoading(true)
    try {
    const res =  await fetch(`${API_BASED_URL}/api/auth/logout`, { 
      method: 'POST',
      credentials: 'include'
     });

      if (!res.ok) {
        throw new Error('Logout Failed');
      }

      window.dispatchEvent(new Event('authChange'));

      router.push('/users/login');

      router.refresh();

    } catch (error) {
      console.error('Failed to log out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      title='Logout'
      className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-gray-200 font-mono bg-red-700 hover:bg-red-900 hover:text-gray-300 transition-colors w-full md:w-auto shadow-sm rounded-lg"
    >
      <Image 
      src={logout.src} 
      alt='logout'
      height={20}
      width={20}>
      </Image>
      {loading ? 'logging out...' : 'Logout'}
    </button>
  );
}