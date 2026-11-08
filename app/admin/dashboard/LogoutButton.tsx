// client/src/app/dashboard/UserLogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? '' // In production (Vercel/Nginx), use relative paths so the proxy handles it
        : 'http://localhost:5000'; // In local dev, point directly to your local backend
    setLoading(true)
    try {
    const res =  await fetch(`${API_BASE_URL}/api/auth/logout`, { 
      method: 'POST',
      credentials: 'include'
     });

      if (!res.ok) {
        throw new Error('Logout Failed');
      }

      window.dispatchEvent(new Event('authChange'));

      router.push('/admin/login');

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
      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
    >
      {loading ? 'logging out...' : 'Logout'}
    </button>
  );
}