import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const initialTransactions = [
  { id: 'TX-1001', user: 'Ana Gómez', amount: '$250.00', status: 'Completed', date: '2026-10-28' },
  { id: 'TX-1002', user: 'Carlos Rodríguez', amount: '$120.00', status: 'Pending', date: '2026-10-29' },
  { id: 'TX-1003', user: 'María Fernández', amount: '$450.00', status: 'Completed', date: '2026-10-29' },
  { id: 'TX-1004', user: 'Luis Hernández', amount: '$85.00', status: 'Failed', date: '2026-10-30' },
  { id: 'TX-1005', user: 'Elena Pérez', amount: '$310.00', status: 'Completed', date: '2026-10-30' },
];

function RecentTransactions() {
  const [filter, setFilter] = useState('');
  const { t } = useLanguage();

  const filteredData = initialTransactions.filter(tx =>
    tx.user.toLowerCase().includes(filter.toLowerCase()) ||
    tx.id.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Failed':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b]/70 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm space-y-4 backdrop-blur-md transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('recentTransactionsTitle') || 'Recent Transactions'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('recentTransactionsSubtitle') || 'Overview of the latest user payments and activities.'}
          </p>
        </div>
        <input
          type="text"
          placeholder={t('filterPlaceholder') || 'Filter by name or ID...'}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800/50 text-[11px] uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('txId') || 'Transaction ID'}</th>
              <th className="px-4 py-3 font-semibold">{t('customer') || 'Customer'}</th>
              <th className="px-4 py-3 font-semibold">{t('amount') || 'Amount'}</th>
              <th className="px-4 py-3 font-semibold">{t('status') || 'Status'}</th>
              <th className="px-4 py-3 font-semibold">{t('date') || 'Date'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/40">
            {filteredData.length > 0 ? (
              filteredData.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-medium text-slate-900 dark:text-slate-100">{tx.id}</td>
                  <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200">{tx.user}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100">{tx.amount}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusBadge(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{tx.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  {t('noTransactionsFound') || `No transactions matching "${filter}".`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTransactions;