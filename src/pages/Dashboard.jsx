import { Icons } from '../components/Icons';
import RecentTransactions from '../components/RecentTransactions';
import { useLanguage } from '../context/LanguageContext';

function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Título y estado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('dashboardTitle') || 'Overview Dashboard'}</h1>
          <p className="text-xs text-slate-400 mt-1">{t('dashboardSubtitle') || 'Real-time stats and overall operational metrics.'}</p>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 backdrop-blur-md">
          {t('lastUpdated') || 'Last updated'}: {t('justNow') || 'Just now'}
        </span>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title={t('totalRevenue') || 'Total Revenue'} 
          value="$24,500" 
          change={`↗ +12% ${t('vsLastMonth') || 'vs last month'}`} 
          isPositive 
          icon={Icons?.Dollar ? <Icons.Dollar className="w-5 h-5" /> : <span>💲</span>} 
          color="emerald" 
        />
        <MetricCard 
          title={t('activeUsersMetric') || 'Active Users'} 
          value="1,234" 
          change={`↗ +5% ${t('vsLastMonth') || 'vs last month'}`} 
          isPositive 
          icon={Icons?.Users ? <Icons.Users className="w-5 h-5" /> : <span>👥</span>} 
          color="indigo" 
        />
        <MetricCard 
          title={t('newSignups') || 'New Sign-ups'} 
          value="342" 
          change={`↘ -2% ${t('vsLastMonth') || 'vs last month'}`} 
          isPositive={false} 
          icon={Icons?.UserAdd ? <Icons.UserAdd className="w-5 h-5" /> : <span>👤</span>} 
          color="purple" 
        />
        <MetricCard 
          title={t('conversionRate') || 'Conversion Rate'} 
          value="4.5%" 
          change={`↗ +0.8% ${t('vsLastMonth') || 'vs last month'}`} 
          isPositive 
          icon={Icons?.TrendingUp ? <Icons.TrendingUp className="w-5 h-5" /> : <span>📈</span>} 
          color="amber" 
        />
      </div>

      {/* Tabla / Componente de Transacciones Recientes */}
      {RecentTransactions ? <RecentTransactions /> : null}
    </div>
  );
}

function MetricCard({ title, value, change, isPositive, icon, color }) {
  const colorMap = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className="bg-[#1e293b]/70 border border-slate-700/50 p-5 rounded-2xl shadow-sm flex items-start justify-between backdrop-blur-md hover:border-indigo-500/30 transition-colors">
      <div>
        <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        <p className={`text-xs font-medium mt-2 flex items-center space-x-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          <span>{change}</span>
        </p>
      </div>
      <div className={`p-3 border rounded-xl ${colorMap[color] || colorMap.indigo}`}>{icon}</div>
    </div>
  );
}

export default Dashboard;