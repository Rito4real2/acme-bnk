'use client';

import { useState, useEffect, useCallback } from 'react';
import ProofModal from '@/components/ProofModal';

interface TransactionUser {
  fullName?: string;
  emailAddress?: string;
}

interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
}

interface Item {
  _id: string;
  user?: TransactionUser;
  type: string;
  amount: number | string;
  paymentMethod?: string;
  proofOfPayment?: string;
  status: string;
  walletAddress?: string;
  bankDetails?: BankDetails;
  createdAt?: string;
  isLoan?: boolean;
  loanDuration?: number;
  monthlyIncome?: number;
  employmentStatus?: string;
  purposeOfLoan?: string;
  bankStatementUrl?: string;
  exisitingDebt?: string | boolean;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeProofUrl, setActiveProofUrl] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<Item | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch transactions and loans from Express backend
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const [txRes, loansRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/transaction/all`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }),
        fetch(`${API_BASE_URL}/api/users/loans`, { // Adjust admin loans route if different
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }),
      ]);

      const txData = txRes.ok ? await txRes.json() : [];
      const loansData = loansRes.ok ? await loansRes.json() : [];

      console.log('Transactions API Response:', txData);
      console.log('Loans API Response:', loansData);

      const rawTransactions: Item[] = Array.isArray(txData) ? txData : txData.transactions || txData.data || [];
      
      const rawLoans: Item[] = (Array.isArray(loansData) ? loansData : loansData.loans || loansData.data || []).map((loan: any) => ({
        ...loan,
        isLoan: true,
        type: 'LOAN',
        amount: loan.loanAmount,
        paymentMethod: loan.employmentStatus,
        proofOfPayment: loan.bankStatementUrl,
      }));

      // Merge and sort newest first
      const combined = [...rawTransactions, ...rawLoans].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setItems(combined);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch admin dashboard requests.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Approve / Reject actions for both Transactions & Loans
  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED', isLoan?: boolean) => {
    setUpdatingId(id);
    setActionMessage(null);
    setError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const endpoint = isLoan 
      ? `${API_BASE_URL}/api/users/loans/${id}/status` 
      : `${API_BASE_URL}/api/transaction/${id}/status`;

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: status.toUpperCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update status to ${status}`);
      }

      setActionMessage(`${isLoan ? 'Loan application' : 'Transaction'} successfully ${status.toLowerCase()}.`);

      // Optimistic state update
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
    } catch (err: any) {
      setError(err.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete action for both Transactions & Loans
  const handleDelete = async (id: string, isLoan?: boolean) => {
    if (!window.confirm(`Are you sure you want to delete this ${isLoan ? 'loan application' : 'transaction'}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setActionMessage(null);
    setError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const endpoint = isLoan 
      ? `${API_BASE_URL}/api/users/loans/${id}` 
      : `${API_BASE_URL}/api/transaction/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete record');
      }

      setActionMessage(`${isLoan ? 'Loan' : 'Transaction'} successfully deleted.`);

      // Remove from local state
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      setError(err.message || 'Deletion failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Dashboard - Requests & Activity
        </h1>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}
        {actionMessage && (
          <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm sm:text-base">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4 min-w-[160px]">User</th>
                  <th className="p-4 min-w-[90px]">Type</th>
                  <th className="p-4 min-w-[100px]">Amount</th>
                  <th className="p-4 min-w-[110px]">Method / Status</th>
                  <th className="p-4 min-w-[200px]">Details / Purpose</th>
                  <th className="p-4 min-w-[110px]">Document</th>
                  <th className="p-4 min-w-[100px]">Status</th>
                  <th className="p-4 min-w-[180px] text-right sm:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : items.length > 0 ? (
                  items.map((item) => {
                    const isLoan = item.isLoan;
                    const hasBankDetails = Boolean(item.bankDetails?.accountNumber);
                    const hasWallet = Boolean(item.walletAddress);

                    return (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        {/* User Info */}
                        <td className="p-4">
                          <p className="font-semibold text-gray-900 truncate max-w-[160px]">
                            {item.user?.fullName || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">
                            {item.user?.emailAddress}
                          </p>
                        </td>

                        {/* Type */}
                        <td className="p-4 capitalize">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                              isLoan
                                ? 'bg-amber-100 text-amber-800'
                                : item.type?.toUpperCase() === 'RECEIVE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="p-4 font-medium whitespace-nowrap">
                          ${typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}
                        </td>

                        {/* Method */}
                        <td className="p-4 whitespace-nowrap uppercase text-xs font-semibold text-gray-600">
                          {isLoan ? item.employmentStatus : (item.paymentMethod || 'N/A')}
                        </td>

                        {/* Details / Purpose */}
                        <td className="p-4">
                          {isLoan ? (
                            <div className="text-xs space-y-0.5">
                              <p className="font-semibold text-gray-900 truncate max-w-[180px]" title={item.purposeOfLoan}>
                                {item.purposeOfLoan}
                              </p>
                              <p className="text-gray-500">Duration: {item.loanDuration} mos</p>
                            </div>
                          ) : hasWallet ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded border text-gray-800 max-w-[130px] truncate">
                                {item.walletAddress}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.walletAddress!, item._id)}
                                className="text-[10px] px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded font-medium text-gray-700"
                              >
                                {copiedId === item._id ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          ) : hasBankDetails ? (
                            <div className="text-xs space-y-0.5">
                              <p className="font-semibold text-gray-900">{item.bankDetails?.bankName}</p>
                              <p className="font-mono text-gray-600">Acc: {item.bankDetails?.accountNumber}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No details</span>
                          )}

                          {(hasWallet || hasBankDetails || isLoan) && (
                            <button
                              type="button"
                              onClick={() => setSelectedDetails(item)}
                              className="mt-1 text-[11px] text-blue-600 hover:underline block font-medium"
                            >
                              View full details
                            </button>
                          )}
                        </td>

                        {/* Receipt / Bank Statement */}
                        <td className="p-4 whitespace-nowrap">
                          {item.proofOfPayment ? (
                            <button
                              type="button"
                              onClick={() => setActiveProofUrl(item.proofOfPayment!)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition inline-flex items-center gap-1"
                            >
                              🔍 View Doc
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No file</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-bold capitalize ${
                              item.status?.toUpperCase() === 'APPROVED' || item.status?.toUpperCase() === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : item.status?.toUpperCase() === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 whitespace-nowrap text-right sm:text-left">
                          <div className="flex items-center justify-end sm:justify-start gap-2 flex-wrap">
                            {item.status?.toUpperCase() === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  disabled={updatingId === item._id || deletingId === item._id}
                                  onClick={() => handleStatusUpdate(item._id, 'APPROVED', isLoan)}
                                  className="px-2.5 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 active:bg-green-800 transition shadow-sm disabled:opacity-50"
                                >
                                  {updatingId === item._id ? '...' : 'Approve'}
                                </button>
                                <button
                                  type="button"
                                  disabled={updatingId === item._id || deletingId === item._id}
                                  onClick={() => handleStatusUpdate(item._id, 'REJECTED', isLoan)}
                                  className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 active:bg-red-800 transition shadow-sm disabled:opacity-50"
                                >
                                  {updatingId === item._id ? '...' : 'Reject'}
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              disabled={deletingId === item._id}
                              onClick={() => handleDelete(item._id, isLoan)}
                              className="px-2.5 py-1 bg-gray-800 text-white rounded text-xs font-semibold hover:bg-gray-900 active:bg-black transition shadow-sm disabled:opacity-50"
                            >
                              {deletingId === item._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Proof / Document Preview Modal */}
      {activeProofUrl && (
        <ProofModal imageUrl={activeProofUrl} onClose={() => setActiveProofUrl(null)} />
      )}

      {/* Full Details Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border relative">
            <button
              onClick={() => setSelectedDetails(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
              {selectedDetails.isLoan ? 'Loan Application Details' : 'Payment & Destination Details'}
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">User:</span>
                <span className="font-semibold">{selectedDetails.user?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-semibold uppercase">{selectedDetails.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold">${selectedDetails.amount}</span>
              </div>

              {selectedDetails.isLoan ? (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Financial & Employment info</p>
                  <div className="bg-gray-50 p-3 rounded border space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Duration:</span>
                      <span className="font-medium">{selectedDetails.loanDuration} Months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Monthly Income:</span>
                      <span className="font-medium">${selectedDetails.monthlyIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Employment:</span>
                      <span className="font-medium">{selectedDetails.employmentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Existing Debt:</span>
                      <span className="font-medium">{String(selectedDetails.exisitingDebt || 'No')}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-gray-500 text-xs block">Purpose:</span>
                      <p className="font-medium text-gray-800 text-xs mt-0.5">{selectedDetails.purposeOfLoan}</p>
                    </div>
                  </div>
                </div>
              ) : selectedDetails.walletAddress ? (
                <div className="border-t pt-3 space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Crypto Wallet Address</p>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border gap-2">
                    <span className="font-mono text-xs text-gray-800 break-all select-all">
                      {selectedDetails.walletAddress}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedDetails.walletAddress!, 'modal-wallet')}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                    >
                      {copiedId === 'modal-wallet' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              ) : selectedDetails.bankDetails && (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Bank Account Information</p>
                  <div className="bg-gray-50 p-3 rounded border space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Bank Name:</span>
                      <span className="font-medium text-gray-800">{selectedDetails.bankDetails.bankName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Account Name:</span>
                      <span className="font-medium text-gray-800">{selectedDetails.bankDetails.accountHolderName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Account Number:</span>
                      <span className="font-mono font-bold text-gray-800 select-all">{selectedDetails.bankDetails.accountNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedDetails(null)}
                className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-semibold hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}