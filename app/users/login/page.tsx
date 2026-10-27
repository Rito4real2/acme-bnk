'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'

export default function UserLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      window.dispatchEvent(new Event('authChange'));

      // Redirect user to dashboard
      router.push('/users/dashboard');
      
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-4">
      {/* Top Back Navigation Bar */}
      <Link 
        href='/'
        className='mb-5 p-4 flex items-center justify-start bg-gray-700 rounded-lg w-full fixed top-0 max-w-xl left-1/2 -translate-x-1/2 hover:bg-gray-600 transition-colors'
      >
        <Image 
          src='/images/back.svg' 
          alt='back' 
          height={20} 
          width={20}
        />
        <span className="text-white text-sm ml-2">Back to Homepage</span>
      </Link>

      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-900 space-y-6 mt-14">

        {/* Top Header / Brand */}
        <div className="w-full max-w-7xl mx-auto flex justify-center">
          <h1 className="text-red-800 font-mono text-xl sm:text-2xl font-bold tracking-wider bg-gray-800 px-3 py-1 rounded">
            ACME BANK
          </h1>
        </div>

        <div>
          <h1 className="text-2xl font-bold font-mono text-red-800">
            Sign In to Your Account
          </h1>
          <p className="text-sm text-gray-300 mt-1 font-mono">
            Enter your credentials to access your portal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium font-mono text-red-700">
              Email Address or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono bg-gray-300"
              placeholder='user@example.com or jondoe'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-red-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" font-mono w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
             className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-white font-mono rounded-full bg-red-800 hover:bg-red-700 hover:text-white transition-colors w-full md:w-auto"
          >
            {loading 
              ? 'Logging in...'
              : 'Log In'
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 font-mono">
          Don't have an account?{' '}
        <Link href="/users/signup" className="text-red-700 font-medium hover:underline">
        Register here
        </Link>
        </p>
      </div>
    </div>
  );
}