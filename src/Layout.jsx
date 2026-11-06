import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icons } from './components/Icons';
import { useLanguage } from './context/LanguageContext';

function Layout({ darkMode, setDarkMode, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t, lang, changeLanguage } = useLanguage();

  // Sincronizar la clase 'dark' en el elemento raíz <html> del documento globalmente
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('byteforge_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('byteforge_theme', 'light');
    }
  }, [darkMode]);

  // Rutas con nombres traducidos dinámicamente mediante el hook de idioma
  const navItems = [
    { name: t('dashboard'), path: '/app', icon: Icons.Dashboard },
    { name: t('analytics'), path: '/app/analytics', icon: Icons.Analytics },
    { name: t('users'), path: '/app/users', icon: Icons.Users },
    { name: t('billing'), path: '/app/billing', icon: Icons.Billing },
    { name: t('settings'), path: '/app/settings', icon: Icons.Settings },
  ];

  return (
    <div className="flex min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-slate-100 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Backdrop en móvil */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Lateral */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-200 shadow-xl border-r border-slate-200 dark:border-slate-700/50 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header Logo */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              BF
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-wide">ByteForge</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Links de navegación */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {IconComponent && <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />}
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Perfil abajo del Sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30 flex-shrink-0">
              GM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">Gabriel Marte</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Admin Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full bg-slate-100 dark:bg-[#0f172a] overflow-x-hidden">
        <header className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none border border-slate-300 dark:border-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="relative w-36 sm:w-64">
              <input
                type="text"
                placeholder={t('searchPlaceholder') || "Search..."}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Selector de Idioma (ES / EN) */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-1">
              <button
                onClick={() => changeLanguage('es')}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'es' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Botón de Modo Oscuro / Claro */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {darkMode ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-colors whitespace-nowrap cursor-pointer"
            >
              {Icons.Logout ? <Icons.Logout className="w-4 h-4" /> : <span>🚪</span>}
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;