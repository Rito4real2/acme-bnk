'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    country: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${backendUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || data?.error || 'Registration failed');
        return;
      }

      router.push('/users/dashboard');
      router.refresh();
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-mono text-amber-900">Create an Account</h1>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              Sign up to get started with your account.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='John Doe'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='johndoe'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='john@example.com'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="United States of America">United States of America</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Uruguay">Uruguay</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='••••••••'
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='••••••••'
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-white font-mono rounded-full bg-amber-900 hover:bg-amber-800 hover:text-white transition-colors w-full md:w-auto"
          >
            {loading ? 'Creating Account...': 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 font-mono">
          Already have an account?
          {" "}
          <Link
            href="/users/login"
            className="text-amber-900 font-medium hover:underline"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}