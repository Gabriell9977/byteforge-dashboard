import { useState } from 'react';
import Toast from '../components/Toast';
import { Icons } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

const initialInvoices = [
  { id: 'INV-2026-001', date: '2026-10-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2026-002', date: '2026-09-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2026-003', date: '2026-08-01', amount: '$29.00', status: 'Paid' },
  { id: 'INV-2026-004', date: '2026-07-01', amount: '$29.00', status: 'Paid' },
];

function Billing() {
  const [invoices] = useState(initialInvoices);
  const [toastMessage, setToastMessage] = useState(null);
  const { t } = useLanguage();

  const handleDownload = (id) => {
    // Pasamos la llave base y el ID como un objeto o string dinámico que el Toast procesará
    setToastMessage(`downloadingInvoiceMsg:${id}`);
  };

  const handleUpgrade = () => {
    // Pasamos directamente la llave de traducción
    setToastMessage('subscriptionUpgradedMsg');
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t('billingTitle') || 'Billing & Subscription'}</h1>
        <p className="text-xs text-slate-400 mt-1">{t('billingSubtitle') || 'Manage payment methods, invoices, and plan details.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan actual */}
        <div className="bg-[#1e293b]/75 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              {t('currentSubscription') || 'Current Subscription'}
            </span>
            <h2 className="text-xl font-bold text-white">{t('proPlanTitle') || 'Pro Developer Plan'}</h2>
            <p className="text-xs text-slate-400 mt-1">{t('planDescription') || '$29.00 / month (Billed monthly). Next renewal date: Nov 1, 2026.'}</p>
          </div>
          <div>
            <button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/35 cursor-pointer"
            >
              {t('upgradeToEnterprise') || 'Upgrade to Enterprise'}
            </button>
          </div>
        </div>

        {/* Método de pago con icono MasterCard real */}
        <div className="bg-[#1e293b]/75 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">{t('paymentMethodTitle') || 'Payment Method'}</h2>
            <div className="flex items-center space-x-3.5 mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <div className="w-12 h-9 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 shadow-inner flex-shrink-0">
                {Icons?.Mastercard ? <Icons.Mastercard /> : <span className="text-[10px] text-white font-bold">MC</span>}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Mastercard ending in •••• 4242</p>
                <p className="text-[11px] text-slate-400">Expires 08/2028</p>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => setToastMessage('openingCardManagerMsg')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs cursor-pointer"
            >
              {t('updatePaymentDetails') || 'Update Payment Details'}
            </button>
          </div>
        </div>
      </div>

      {/* Historial de Facturas */}
      <div className="bg-[#1e293b]/75 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-white">{t('invoiceHistoryTitle') || 'Billing History & Receipts'}</h2>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
            <thead className="bg-slate-800/50 text-[11px] uppercase text-slate-400 border-b border-slate-700/60">
              <tr>
                <th className="px-4 py-3">{t('invoiceNumberHeader') || 'Invoice Number'}</th>
                <th className="px-4 py-3">{t('billingDateHeader') || 'Billing Date'}</th>
                <th className="px-4 py-3">{t('amountHeader') || 'Amount'}</th>
                <th className="px-4 py-3">{t('statusHeader') || 'Status'}</th>
                <th className="px-4 py-3 text-right">{t('actionHeader') || 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-200">{inv.id}</td>
                  <td className="px-4 py-3.5 text-slate-400">{inv.date}</td>
                  <td className="px-4 py-3.5 font-semibold text-white">{inv.amount}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.status === 'Paid' ? (t('statusPaid') || 'Paid') : inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDownload(inv.id)}
                      className="inline-flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 font-medium text-xs cursor-pointer"
                    >
                      {Icons?.Download ? <Icons.Download className="w-3.5 h-3.5" /> : <span>📥</span>}
                      <span>{t('downloadPdfBtn') || 'Download PDF'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default Billing;