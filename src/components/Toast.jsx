import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Se oculta automáticamente a los 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgStyles = type === 'success' 
    ? 'bg-green-600 text-white' 
    : 'bg-blue-600 text-white';

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 text-sm font-medium transition-all transform animate-bounce-short ${bgStyles}`}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white font-bold ml-2 focus:outline-none"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;