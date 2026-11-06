import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

const revenueData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 5000, expenses: 3800 },
  { name: 'Apr', revenue: 4500, expenses: 3900 },
  { name: 'May', revenue: 6000, expenses: 4800 },
  { name: 'Jun', revenue: 7500, expenses: 4300 },
  { name: 'Jul', revenue: 8500, expenses: 4800 },
  { name: 'Aug', revenue: 9200, expenses: 5100 },
  { name: 'Sep', revenue: 10500, expenses: 5400 },
  { name: 'Oct', revenue: 13000, expenses: 6000 },
];

const trafficData = [
  { day: 'Mon', visitors: 1200, views: 3400 },
  { day: 'Tue', visitors: 2100, views: 4800 },
  { day: 'Wed', visitors: 1800, views: 4100 },
  { day: 'Thu', visitors: 2900, views: 6200 },
  { day: 'Fri', visitors: 3800, views: 8500 },
  { day: 'Sat', visitors: 4200, views: 9800 },
  { day: 'Sun', visitors: 3600, views: 7900 },
];

function Analytics() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {t('analyticsTitle') || 'Analytics & Financial Reports'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('analyticsSubtitle') || 'Deep dive into revenue trends and system traffic patterns.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-[#1e293b]/75 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4 min-w-0">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white">
              {t('revenueVsExpenses') || 'Revenue vs Expenses'}
            </h2>
            <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full font-medium">
              {t('monthlyBreakdown') || 'Monthly Breakdown'}
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="revenue" name={t('revenueLabel') || 'Revenue ($)'} stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expenses" name={t('expensesLabel') || 'Expenses ($)'} stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Traffic */}
        <div className="bg-[#1e293b]/75 border border-slate-700/50 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4 min-w-0">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white">
              {t('weeklyTrafficTitle') || 'Weekly Traffic & Pageviews'}
            </h2>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              {t('dailyActivity') || 'Daily Activity'}
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="visitors" name={t('uniqueVisitors') || 'Unique Visitors'} fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="views" name={t('pageViews') || 'Page Views'} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;