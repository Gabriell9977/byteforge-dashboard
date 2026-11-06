import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Toast({ message, type = 'success', onClose }) {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const renderMessage = () => {
    if (typeof message === 'string' && message.includes(':')) {
      const [key, p1, p2] = message.split(':');
      if (key === 'downloadingInvoiceMsg') return `${t(key)} #${p1}...`;
      if (key === 'userStatusUpdated') return `${t('userStatusPrefix') || 'User'} ${p1} ${t('isNowPrefix') || 'is now'} ${p2}.`;
      if (key === 'userUpdatedSuccess') return `${t('userUpdatedPrefix') || 'User'} ${p1} ${t('updatedSuccessSuffix') || 'updated successfully.'}`;
      if (key === 'userCreatedSuccess') return `${t('userCreatedPrefix') || 'User'} ${p1} ${t('createdSuccessSuffix') || 'created successfully.'}`;
      if (key === 'userRemovedSuccess') return `${t('userRemovedPrefix') || 'User'} ${p1} ${t('removedSuccessSuffix') || 'removed.'}`;
    }
    return t(message) || message;
  };

  const bgStyles = type === 'success' 
    ? 'bg-emerald-600 text-white shadow-emerald-900/20' 
    : 'bg-indigo-600 text-white shadow-indigo-900/20';

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-sm font-medium transition-all transform backdrop-blur-md border border-white/10 ${bgStyles}`}>
      <span>{renderMessage()}</span>
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white font-bold ml-2 focus:outline-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;