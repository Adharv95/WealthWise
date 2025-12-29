import React from 'react';
import { AnalysisResult, UserFinancialProfile } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { TrendingUp, AlertTriangle, Target, ArrowUpRight, DollarSign, Wallet, ShieldCheck, Info } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  profile: UserFinancialProfile;
  onReset: () => void;
  isDarkMode: boolean;
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const Dashboard: React.FC<Props> = ({ result, profile, onReset, isDarkMode }) => {
  const totalExpenses = profile.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const pieData = result.expenseBreakdown.map(item => ({
    ...item,
    amount: Math.round((item.percentage / 100) * totalExpenses)
  }));
  
  const ScoreGauge = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const trackColor = isDarkMode ? '#1e293b' : '#f1f5f9';
    
    return (
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="45" stroke={trackColor} strokeWidth="10" fill="transparent" />
          <circle 
            cx="50%" cy="50%" r="45" stroke="url(#scoreGradient)" strokeWidth="10" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{score}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Health Score</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3 h-3" /> Audit Verified
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Blueprint</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Strategic roadmap for your wealth generation.</p>
        </div>
        <button 
          onClick={onReset}
          className="group px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all flex items-center gap-2 shadow-sm"
        >
          Reset Profile
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Net Worth', value: `$${result.netWorth.toLocaleString()}`, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Monthly Flow', value: `${result.monthlyCashFlow >= 0 ? '+' : ''}$${result.monthlyCashFlow.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Savings Rate', value: `${result.savingsRate}%`, icon: Target, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/10' },
          { label: 'DTI Ratio', value: `${result.debtToIncomeRatio}%`, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
            <div className={`w-10 h-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center mb-4`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Executive Insights */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary-500/10 transition-colors"></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Executive Insights</h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium italic border-l-4 border-primary-500 pl-4">
              "{result.summary}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.keyInsights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Info className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projection Chart */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-500" /> Wealth Projection
              </h3>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-500"></div> Aggressive</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary-500"></div> Conservative</div>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.wealthProjection}>
                  <defs>
                    <linearGradient id="areaAgg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="areaCons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} tickFormatter={(v) => `$${v/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderRadius: '16px', border: '1px solid #334155', padding: '12px' }}
                    itemStyle={{ fontWeight: '700', fontSize: '12px' }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="aggressive" stroke="#8b5cf6" strokeWidth={3} fill="url(#areaAgg)" />
                  <Area type="monotone" dataKey="conservative" stroke="#0ea5e9" strokeWidth={3} fill="url(#areaCons)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Action Plan</h3>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{result.actionPlan.length} Steps</span>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
               {result.actionPlan.map((action, idx) => (
                 <div key={idx} className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                   <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white">{action.title}</h4>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        action.priority === 'High' ? 'bg-red-500 text-white' : 
                        action.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {action.priority} Priority
                      </span>
                   </div>
                   <p className="text-slate-500 dark:text-slate-400 mb-4">{action.description}</p>
                   <div className="flex items-center gap-2 text-xs font-black text-primary-600 dark:text-primary-400">
                     <ArrowUpRight className="w-4 h-4" /> IMPACT: {action.impact}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <ScoreGauge score={result.financialHealthScore} />
            <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-6 leading-relaxed">
              Your score represents the structural integrity of your finances based on debt-to-income and liquid reserves.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Expense Allocation</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="percentage" nameKey="category">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '10px' }}
                    formatter={(v: number, n: string) => [`${v}%`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {pieData.map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.category}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;