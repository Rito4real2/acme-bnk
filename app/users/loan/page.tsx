'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NavigationBar from '@/app/components/NavigationBar';

export default function LoanApplicationPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Controls modal visibility
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userCurrency, setUserCurrency] = useState('$');

  const [formData, setFormData] = useState({
    loanAmount: '',
    loanDuration: '',
    monthlyIncome: '',
    exisitingDebt: 'No',
    employmentStatus: 'Self Employed',
    purposeOfLoan: '',
  });

  const [bankStatementFile, setBankStatementFile] = useState<File | null>(null);

  // Fetch user profile on mount to get their saved currency preference
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/users/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();

        if (res.ok && data) {
          const currencySymbol = data.currency || data.user?.currency;
          if (currencySymbol) {
            setUserCurrency(currencySymbol);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user currency preference');
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBankStatementFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!bankStatementFile) {
      setError('Please upload a bank statement file or image.');
      return;
    }

    setLoading(true);

    try {
      const dataPayload = new FormData();
      dataPayload.append('loanAmount', formData.loanAmount);
      dataPayload.append('loanDuration', formData.loanDuration);
      dataPayload.append('monthlyIncome', formData.monthlyIncome);
      dataPayload.append('exisitingDebt', formData.exisitingDebt);
      dataPayload.append('employmentStatus', formData.employmentStatus);
      dataPayload.append('purposeOfLoan', formData.purposeOfLoan);
      dataPayload.append('bankStatement', bankStatementFile);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/loans/apply`, {
        method: 'POST',
        credentials: 'include',
        body: dataPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit loan application.');
      }

      setSuccessMessage('Loan application submitted successfully! and awaiting approval.');
      setFormData({
        loanAmount: '',
        loanDuration: '',
        monthlyIncome: '',
        exisitingDebt: 'No',
        employmentStatus: 'Self Employed',
        purposeOfLoan: '',
      });
      setBankStatementFile(null);

      setTimeout(() => {
        setIsOpen(false);
        router.push('/users/dashboard');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 font-mono relative">
      
      {/* Top Back Navigation Bar */}
      <Link 
        href='/users/dashboard'
        className='mb-5 p-4 flex items-center justify-start bg-gray-700 rounded-b-2xl rounded-bl-2xl w-full fixed top-0 max-w-xl left-1/2 -translate-x-1/2 hover:bg-gray-600 transition-colors'
      >
        <Image 
          src='/images/back.svg' 
          alt='back' 
          height={20} 
          width={20}
        />
        <span className="text-white text-sm ml-2">Back to Dashboard</span>
      </Link>

      {/* Trigger Button to Open Loan Form Modal */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Need Financial Assistance?</h1>
        <p className="text-gray-400 text-sm">Apply for a flexible loan with quick approval reviews.</p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold text-base transition shadow-lg cursor-pointer"
        >
          Apply for a Loan
        </button>
      </div>

      {/* Modal / Popup Form Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-700 space-y-6 text-white relative my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h2 className="text-2xl font-bold text-red-700">Loan Application</h2>
              <p className="text-sm text-gray-400 mt-1">
                Fill in your financial details and upload your bank statement to apply.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-red-400">
                  Loan Amount ({userCurrency})
                </label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 rounded-lg mt-1 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={`${userCurrency}5000`}
                  required
                />
              </div>

              {/* Loan Duration */}
              <div>
                <label className="block text-sm font-medium text-red-400">Loan Duration (Months)</label>
                <input
                  type="number"
                  name="loanDuration"
                  value={formData.loanDuration}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 rounded-lg mt-1 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="12"
                  required
                />
              </div>

              {/* Monthly Income */}
              <div>
                <label className="block text-sm font-medium text-red-400">
                  Monthly Income ({userCurrency})
                </label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 rounded-lg mt-1 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={`3000 (${userCurrency})`}
                  required
                />
              </div>

              {/* Existing Debt */}
              <div>
                <label className="block text-sm font-medium text-red-400">Existing Debt?</label>
                <select
                  name="exisitingDebt"
                  value={formData.exisitingDebt}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 rounded-lg mt-1 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              {/* Employment Status Select Field */}
              <div>
                <label className="block text-sm font-medium text-red-400">Employment Status</label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 rounded-lg mt-1 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Permanent Employee">Permanent Employee</option>
                  <option value="Contract Based">Contract Based</option>
                  <option value="Self Employed">Self Employed</option>
                </select>
              </div>

              {/* Purpose of Loan */}
              <div>
                <label className="block text-sm font-medium text-red-400">Purpose of Loan</label>
                <textarea
                  name="purposeOfLoan"
                  value={formData.purposeOfLoan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2.5 border border-gray-600 rounded-lg mt-1 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Business expansion, home renovation, etc."
                  required
                />
              </div>

              {/* Bank Statement File Upload */}
              <div>
                <label className="block text-sm font-medium text-red-400">Bank Statement (Image or PDF)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-600 rounded-lg mt-1 text-gray-300 bg-gray-700 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-red-700 hover:file:bg-red-500 hover:text-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || fetchingUser}
                className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Uploading & Submitting...' : 'Submit Loan Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <NavigationBar />

    </div>
  );
}