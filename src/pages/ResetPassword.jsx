import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API_URL from '../config/api';
import Toast from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setToastMessage(t('passwordsDoNotMatch') || 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'El enlace es inválido o ha expirado.');
      }

      setSuccess(true);
    } catch (err) {
      setToastMessage(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-[#0a0d14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur-2xl relative space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
            ✓
          </div>
          <h1 className="text-xl font-bold text-white">
            {t('resetSuccessTitle') || '¡Contraseña Actualizada!'}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('resetSuccessText') || 'Tu contraseña ha sido restablecida correctamente. Ya puedes acceder con tus nuevas credenciales.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            {t('goToLogin') || 'Ir a Iniciar Sesión'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-[#0a0d14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative flex items-center justify-center px-4">
      
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-900/20 to-[#0a0d14] animate-pulse duration-1000" />
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] animate-pulse" />
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl relative space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-3 group cursor-pointer mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              BF
            </div>
            <span className="font-bold text-2xl text-white tracking-wide bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              ByteForge
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white">{t('resetPasswordTitle') || 'Restablecer Contraseña'}</h1>
          <p className="text-xs text-slate-400">{t('resetPasswordSubtitle') || 'Ingresa tu nueva contraseña a continuación'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              {t('newPasswordLabel') || 'NUEVA CONTRASEÑA'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-indigo-500/80 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              {t('confirmPasswordLabel') || 'CONFIRMAR CONTRASEÑA'}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-indigo-500/80 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <span>{t('updatePasswordBtn') || 'Actualizar Contraseña →'}</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-white/5">
          <Link to="/login" className="text-indigo-400 font-medium hover:underline">
            {t('backToLogin') || '← Volver al inicio de sesión'}
          </Link>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default ResetPassword;