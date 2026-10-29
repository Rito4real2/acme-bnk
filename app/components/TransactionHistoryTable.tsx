'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';
import '../lib/locales/i18n';

export interface Loan {
  _id: string;
  loanAmount: number;
  loanDuration: number;
  monthlyIncome: number;
  exisitingDebt?: string | boolean;
  employmentStatus: string;
  purposeOfLoan: string;
  bankStatementUrl: string;
  status: string;
  createdAt: string;
}

interface Props {
  transactions?: Transaction[];
  loans?: Loan[];
}

export default function TransactionHistoryTable({ transactions = [], loans = [] }: Props) {
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [modalType, setModalType] = useState<'transaction' | 'loan'>('transaction');
  const [showAll, setShowAll] = useState(false);
  const { t, i18n } = useTranslation();

  // Normalize and tag loan applications so they integrate into the activity feed
  const formattedLoans = loans.map((loan) => ({
    ...loan,
    isLoan: true,
    type: 'LOAN',
    amount: loan.loanAmount,
    paymentMethod: loan.employmentStatus,
    createdAt: loan.createdAt,
    status: loan.status,
  }));

  // Combine both arrays and sort by date (most recent first)
  const allItems = [...transactions, ...formattedLoans].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  // Safely check array length
  if (!allItems || allItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg font-mono">
        {t('transactions.no_transactions', 'No transactions or loan applications found yet.')}
      </div>
    );
  }

  // Slice to show only the 10 most recent items unless "View All" is toggled
  const displayedItems = showAll ? allItems : allItems.slice(0, 10);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-800 text-gray-300 uppercase text-xs font-mono">
              <th className="p-3">{t('transactions.type', 'Type')}</th>
              <th className="p-3">{t('transactions.amount', 'Amount')}</th>
              <th className="p-3">{t('transactions.method', 'Details / Method')}</th>
              <th className="p-3">{t('transactions.status', 'Status')}</th>
              <th className="p-3">{t('transactions.date', 'Date')}</th>
              <th className="p-3 text-right">{t('transactions.receipt', 'Action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {displayedItems.map((item: any) => {
              const isLoan = item.isLoan;
              return (
                <tr key={item._id} className="hover:bg-gray-800">
                  <td className="p-3 font-semibold font-mono">
                    <span
                      className={
                        isLoan
                          ? 'text-amber-600'
                          : item.type?.toUpperCase() === 'RECEIVE'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                     {isLoan 
                        ? 'LOAN' 
                        : t(`transactions.types.${item.type?.toLowerCase()}`, { defaultValue: item.type })
                      }
                  </span>
                </td>
                <td className="p-3 font-bold text-gray-200">
                  ${typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}
                </td>
                <td className="p-3 font-mono text-xs">
                  {isLoan ? (
                    <span className="text-gray-200 truncate max-w-[180px] block" title={item.purposeOfLoan}>
                      {item.purposeOfLoan} ({item.loanDuration} months)
                    </span>
                  ) : (
                    <span className='text-gray-200 font-mono text-sm'>
                      {t(
                        `transactions.paymentMethod.${item.paymentMethod?.toLowerCase()}`,
                        { defaultValue: item.paymentMethod || 'N/A' }
                      )}
                    </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold font-mono ${
                        item.status?.toUpperCase() === 'APPROVED' || item.status?.toUpperCase() === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : item.status?.toUpperCase() === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300 font-mono text-xs">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString(i18n.language)
                      : t('common.not_applicable', 'N/A')}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedTx(item);
                        setModalType(isLoan ? 'loan' : 'transaction');
                      }}
                      className="shadow-sm px-3 py-1 bg-red-700 hover:bg-red-600 text-gray-200 rounded text-xs font-medium font-mono transition cursor-pointer"
                    >
                      {t('transactions.view', 'View')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View All / Show Less Toggle Button */}
      {allItems.length > 10 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-xs font-semibold font-mono transition shadow-sm cursor-pointer"
          >
            {showAll
              ? t('transactions.show_less', 'Show Less')
              : t('transactions.view_all', `View All (${allItems.length})`)}
          </button>
        </div>
      )}

      {/* Standard Transaction Receipt Modal */}
      <ReceiptModal
        transaction={modalType === 'transaction' ? selectedTx : null}
        onClose={() => setSelectedTx(null)}
      />

      {/* Loan Details Modal */}
      {selectedTx && modalType === 'loan' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4 text-red-800 font-mono">
            <h3 className="text-xl font-bold text-gray-400">Loan Application Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Amount:</strong> ${selectedTx.loanAmount?.toFixed(2)}
              </p>
              <p>
                <strong>Duration:</strong> {selectedTx.loanDuration} Months
              </p>
              <p>
                <strong>Monthly Income:</strong> ${selectedTx.monthlyIncome?.toFixed(2)}
              </p>
              <p>
                <strong>Employment Status:</strong> {selectedTx.employmentStatus}
              </p>
              <p>
                <strong>Existing Debt:</strong> {selectedTx.exisitingDebt === true || selectedTx.exisitingDebt === 'true' ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Purpose:</strong> {selectedTx.purposeOfLoan}
              </p>
              <p>
                <strong>Status:</strong> <span className="uppercase font-semibold">{selectedTx.status}</span>
              </p>
              {selectedTx.bankStatementUrl && (
                <p>
                  <strong>Bank Statement:</strong>{' '}
                  <a
                    href={selectedTx.bankStatementUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Document
                  </a>
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}