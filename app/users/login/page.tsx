'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border space-y-6">

        {/* Top Header / Brand */}
        <div className="w-full max-w-7xl mx-auto flex justify-start">
          <h1 className="text-amber-900 font-mono text-xl sm:text-2xl font-bold tracking-wider bg-white/80 px-3 py-1 rounded">
            ACME BANK
          </h1>
        </div>

        <div>
          <h1 className="text-2xl font-bold font-mono text-amber-900">
            Sign In to Your Account
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">
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
            <label className="block text-sm font-medium font-mono text-gray-700">
              Email Address or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder='user@example.com or jondoe'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" font-mono w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
             className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-white font-mono rounded-full bg-amber-900 hover:bg-red-700 hover:text-white transition-colors w-full md:w-auto"
          >
            {loading 
              ? 'Logging in...'
              : 'Log In'
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 font-mono">
          Don't have an account?{' '}
        <Link href="/users/signup" className="text-red-900 font-medium hover:underline">
        Register here
        </Link>
        </p>
      </div>
    </div>
  );
}