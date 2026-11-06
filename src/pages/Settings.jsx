import { useState } from 'react';
import Toast from '../components/Toast';
import { Icons } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

function Settings() {
  const currentUser = JSON.parse(localStorage.getItem('user')) || { 
    name: 'Gabriel Marte', 
    email: 'gabriel@byteforge.dev', 
    role: 'Viewer' 
  };

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [emailReports, setEmailReports] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const { t } = useLanguage();

  const handleSave = (e) => {
    e.preventDefault();
    
    const updatedUser = { ...currentUser, name, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const storedUsers = JSON.parse(localStorage.getItem('byteforge_system_users')) || [];
    const updatedUsers = storedUsers.map(u => u.email === currentUser.email ? updatedUser : u);
    localStorage.setItem('byteforge_system_users', JSON.stringify(updatedUsers));

    // Usamos la llave directa para mantener la reactividad del idioma
    setToastMessage('settingsSavedMsg');
  };

  return (
    <div className="space-y-6 relative max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('settingsTitle') || 'System & Profile Settings'}</h1>
          <p className="text-xs text-slate-400 mt-1">{t('settingsSubtitle') || 'Update workspace details and notification preferences.'}</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/35 cursor-pointer whitespace-nowrap"
        >
          {Icons?.Check ? <Icons.Check className="w-4 h-4" /> : <span>💾</span>}
          <span>{t('saveChangesBtn') || 'Save Changes'}</span>
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-[#1e293b]/75 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{t('personalInfoTitle') || 'Personal Information'}</h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {t('roleLabel') || 'Role'}: {currentUser.role}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('displayNameLabel') || 'Display Name'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-700 rounded-xl text-xs bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t('emailAddressLabel') || 'Email Address'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-700 rounded-xl text-xs bg-slate-900/90 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#1e293b]/75 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-5">
        <h2 className="text-base font-bold text-white">{t('notificationPreferencesTitle') || 'Notification Preferences'}</h2>
        
        <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
          <div>
            <p className="text-xs font-semibold text-slate-200">{t('emailReportsTitle') || 'Email Reports'}</p>
            <p className="text-[11px] text-slate-400">{t('emailReportsDesc') || 'Receive weekly traffic and revenue digests.'}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailReports}
              onChange={() => setEmailReports(!emailReports)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xs font-semibold text-slate-200">{t('securityAlertsTitle') || 'Security Alerts'}</p>
            <p className="text-[11px] text-slate-400">{t('securityAlertsDesc') || 'Get notified when new login activity occurs.'}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securityAlerts}
              onChange={() => setSecurityAlerts(!securityAlerts)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default Settings;