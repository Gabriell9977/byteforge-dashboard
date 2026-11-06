import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Landing() {
  const { t, lang, changeLanguage } = useLanguage();

  return (
    <div className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-[#0a0d14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* ================= BACKGROUND CON ANIMACIÓN DE NEÓN FLUIDA ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradiente animado principal de fondo */}
        <div className="absolute -top-[40%] -left-[20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-900/20 to-[#0a0d14] animate-pulse duration-1000" />

        {/* Orbe de luz magenta superior */}
        <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] animate-pulse" />

        {/* Orbe de luz cian/índigo inferior */}
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[160px]" />

        {/* Malla Grid tecnológica sutil */}
        <div 
          className="absolute inset-0 opacity-[0.08]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      {/* Navbar Superior con Glassmorphism */}
<nav className="w-full border-b border-white/5 bg-[#0a0d14]/70 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between transition-all">
  {/* Logo a la izquierda */}
  <div className="flex items-center space-x-3 group cursor-pointer">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
      BF
    </div>
    <span className="font-bold text-xl text-white tracking-wide bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
      ByteForge
    </span>
  </div>

  {/* Enlaces de navegación perfectamente centrados */}
  <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-300 absolute left-1/2 -translate-x-1/2">
    <a href="#features" className="hover:text-indigo-400 transition-colors">{t('navFeatures') || 'Features'}</a>
    <a href="#pricing" className="hover:text-indigo-400 transition-colors">{t('navPricing') || 'Pricing'}</a>
    <a href="#about" className="hover:text-indigo-400 transition-colors">{t('navAbout') || 'About'}</a>
  </div>

  {/* Botones de idioma y acceso a la derecha */}
  <div className="flex items-center space-x-3">
    {/* Selector de Idioma (ES / EN) */}
    <div className="flex items-center space-x-1 bg-slate-900 border border-white/10 rounded-xl p-1">
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

    <Link
      to="/login"
      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
    >
      {t('signIn') || 'Sign In'}
    </Link>
    <Link
      to="/login"
      className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all"
    >
      {t('getStarted') || 'Get Started'}
    </Link>
  </div>
</nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 max-w-5xl mx-auto text-center space-y-6 relative">
        
        {/* Badge Animado */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium shadow-inner backdrop-blur-md animate-bounce duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          <span>{t('heroBadge') || 'Introducing ByteForge v2.0'}</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {t('landingHeroTitle') || 'Next-Generation Analytics & SaaS Operations Management'}
        </h1>

        {/* Subtítulo descriptivo */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-medium leading-relaxed">
          {t('landingHeroSubtitle') || 'Scale your digital products faster with real-time analytics, user management, and automated billing insight.'}
        </p>

        {/* Botones de Acción Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all"
          >
            {t('accessDemoBtn') || 'Access Live Dashboard Demo →'}
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all hover:border-white/20"
          >
            {t('exploreFeaturesBtn') || 'Explore Features'}
          </a>
        </div>

        {/* Previsualización del Dashboard */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-2 sm:p-4 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex items-center space-x-2 pb-3 px-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-[11px] text-slate-500 font-mono pl-2">https://byteforge-dashboard.vercel.app/</span>
            </div>
            <div className="rounded-xl bg-[#0a0d14]/80 p-6 text-left space-y-4 mt-2 border border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{t('totalRevenue') || 'Total Revenue'}</span>
                  <p className="text-2xl font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors">$24,500</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all group">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{t('activeUsersMetric') || 'Active Users'}</span>
                  <p className="text-2xl font-bold text-white mt-1 group-hover:text-purple-400 transition-colors">1,234</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{t('conversionCard') || 'Conversion'}</span>
                  <p className="text-2xl font-bold text-white mt-1 group-hover:text-pink-400 transition-colors">4.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Características */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5 bg-slate-900/30 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">{t('featuresTitle') || 'Engineered for High-Growth Teams'}</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {t('featuresSubtitle') || 'Everything you need to monitor performance, manage client subscriptions, and enforce security policies in one unified system.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/40 p-6 rounded-2xl space-y-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="text-base font-bold text-white">{t('feature1Title') || 'Real-Time Data'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feature1Desc') || 'Instant synchronization across metrics, payment events, and user activities with zero latency.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 border border-white/5 hover:border-purple-500/40 p-6 rounded-2xl space-y-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                🔒
              </div>
              <h3 className="text-base font-bold text-white">{t('feature2Title') || 'Role Management'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feature2Desc') || 'Granular access control policies to restrict permissions for administrators, editors, and viewers.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 border border-white/5 hover:border-emerald-500/40 p-6 rounded-2xl space-y-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                💳
              </div>
              <h3 className="text-base font-bold text-white">{t('feature3Title') || 'Automated Billing'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('feature3Desc') || 'Streamlined invoice generation, recurring payment processing, and revenue reporting.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Planes de Precios */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">{t('pricingTitle') || 'Simple, Transparent Pricing'}</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {t('pricingSubtitle') || 'Choose the plan that fits your business scale. No hidden fees or surprise overages.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-slate-900/40 border border-white/5 hover:border-slate-700 p-6 rounded-2xl space-y-6 flex flex-col justify-between backdrop-blur-xl transition-all">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">{t('starterPlanTitle') || 'Starter'}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-white">$29</span>
                  <span className="text-xs text-slate-400">{t('perMonth') || '/month'}</span>
                </div>
                <p className="text-xs text-slate-400">{t('starterPlanDesc') || 'Ideal for small projects and solo creators starting out.'}</p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center space-x-2"><span className="text-indigo-400 font-bold">✓</span><span>{t('starterFeature1') || 'Up to 5,000 monthly users'}</span></li>
                  <li className="flex items-center space-x-2"><span className="text-indigo-400 font-bold">✓</span><span>{t('starterFeature2') || 'Standard analytics'}</span></li>
                  <li className="flex items-center space-x-2"><span className="text-indigo-400 font-bold">✓</span><span>{t('starterFeature3') || 'Email support'}</span></li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-2.5 rounded-xl border border-white/10 text-center font-semibold text-xs text-slate-200 hover:bg-white/5 transition-colors">
                {t('startFreeTrial') || 'Start Free Trial'}
              </Link>
            </div>

            {/* Pro Plan (Destacado) */}
            <div className="bg-slate-900/80 border-2 border-indigo-500/80 p-6 rounded-2xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20 backdrop-blur-2xl hover:scale-[1.02] transition-transform">
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                {t('mostPopular') || 'Most Popular'}
              </span>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">{t('proPlanName') || 'Pro'}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-white">$79</span>
                  <span className="text-xs text-slate-400">{t('perMonth') || '/month'}</span>
                </div>
                <p className="text-xs text-slate-400">{t('proPlanDescCard') || 'Perfect for growing SaaS companies and active dev teams.'}</p>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center space-x-2"><span className="text-purple-400 font-bold">✓</span><span>{t('proFeature1') || 'Unlimited monthly users'}</span></li>
                  <li className="flex items-center space-x-2"><span className="text-purple-400 font-bold">✓</span><span>{t('proFeature2') || 'Real-time custom reports'}</span></li>
                  <li className="flex items-center space-x-2"><span className="text-purple-400 font-bold">✓</span><span>{t('proFeature3') || 'Multi-team role management'}</span></li>
                  <li className="flex items-center space-x-2"><span className="text-purple-400 font-bold">✓</span><span>{t('proFeature4') || 'Priority 24/7 support'}</span></li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-center font-semibold text-xs text-white shadow-lg shadow-indigo-600/30 transition-all">
                {t('getStartedNow') || 'Get Started Now'}
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900/40 border border-white/5 hover:border-slate-700 p-6 rounded-2xl space-y-6 flex flex-col justify-between backdrop-blur-xl transition-all">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">{t('enterprisePlanTitle') || 'Enterprise'}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-white">$199</span>
                  <span className="text-xs text-slate-400">{t('perMonth') || '/month'}</span>
                </div>
                <p className="text-xs text-slate-400">{t('enterprisePlanDesc') || 'Designed for large organizations requiring custom SLAs.'}</p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center space-x-2"><span className="text-indigo-400 font-bold">✓</span><span>{t('enterpriseFeature1') || 'Dedicated infrastructure'}</span></li>
                  <li className="flex items-center space-x-2"><span className="text-indigo-400 font-bold">✓</span><span>{t('enterpriseFeature2') || 'Custom API integrations'}</span></li>
                  <li className="flex items-center space-x-2"><span className="text-indigo-400 font-bold">✓</span><span>{t('enterpriseFeature3') || 'Dedicated Account Manager'}</span></li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-2.5 rounded-xl border border-white/10 text-center font-semibold text-xs text-slate-200 hover:bg-white/5 transition-colors">
                {t('contactSales') || 'Contact Sales'}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 px-4 sm:px-8 py-8 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500 max-w-6xl mx-auto space-y-4 sm:space-y-0">
        <p>{t('footerRights') || '© 2026 ByteForge Inc. All rights reserved.'}</p>
        <div className="flex items-center justify-center space-x-6">
          <a href="#" className="hover:text-slate-300 transition-colors">{t('privacyPolicy') || 'Privacy Policy'}</a>
          <a href="#" className="hover:text-slate-300 transition-colors">{t('termsOfService') || 'Terms of Service'}</a>
          <a href="#" className="hover:text-slate-300 transition-colors">{t('documentation') || 'Documentation'}</a>
        </div>
      </footer>

    </div>
  );
}

export default Landing;