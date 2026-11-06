import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config/api';
import Toast from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();
  const { t, lang, changeLanguage } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Acceso denegado: Credenciales inválidas, cuenta pendiente o eliminada.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin();
      navigate('/app');
    } catch (err) {
      setToastMessage(err.message || 'Error de conexión con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setToastMessage('enterEmailFirst');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al solicitar recuperación.');

      setToastMessage('recoveryInstructionsSent');
    } catch (err) {
      setToastMessage(err.message || 'Error al conectar con el servidor.');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-[#0a0d14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative flex items-center justify-center px-4">
      
      {/* Selector de Idioma Flotante */}
      <div className="absolute top-6 right-6 flex items-center space-x-1 bg-slate-900/80 border border-white/10 rounded-xl p-1 backdrop-blur-md z-50">
        <button
          onClick={() => changeLanguage('es')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            lang === 'es' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          ES
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>

      {/* ================= BACKGROUND NEÓN & ORBES ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-900/20 to-[#0a0d14] animate-pulse duration-1000" />
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.08]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      {/* Card de Login */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl relative space-y-6">
        
        {/* Header / Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 group cursor-pointer mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              BF
            </div>
            <span className="font-bold text-2xl text-white tracking-wide bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              ByteForge
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white">{t('welcomeBack') || 'Welcome back'}</h1>
          <p className="text-xs text-slate-400">{t('enterCredentials') || 'Enter your credentials to access your dashboard'}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">{t('emailAddressLabel') || 'Email Address'}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder') || 'correo@ejemplo.com'}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-indigo-500/80 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">{t('passwordLabel') || 'Password'}</label>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-[11px] text-indigo-400 hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                {t('forgotPassword') || 'Forgot password?'}
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder') || '••••••••'}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-indigo-500/80 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <span>{t('signInDashboard') || 'Sign In to Dashboard →'}</span>
            )}
          </button>
        </form>

        {/* Footer de la Card */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-white/5">
          {t('dontHaveAccount') || "Don't have an account?"}{' '}
          <Link to="/register" className="text-indigo-400 font-medium hover:underline">
            {t('requestAccess') || 'Request access'}
          </Link>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default Login;