import React from 'react';
import { AnalysisResult, UserFinancialProfile } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Target, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  profile: UserFinancialProfile;
  onReset: () => void;
  isDarkMode: boolean;
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const Dashboard: React.FC<Props> = ({ result, profile, onReset, isDarkMode }) => {
  
  // Calculate total monthly expenses to derive absolute amounts for the pie chart
  const totalExpenses = profile.expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Prepare data with calculated amounts
  const pieData = result.expenseBreakdown.map(item => ({
    ...item,
    amount: Math.round((item.percentage / 100) * totalExpenses)
  }));
  
  // Custom Gauge for Health Score
  const ScoreGauge = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (score / 100) * circumference;
    const trackColor = isDarkMode ? '#1e293b' : '#f1f5f9';
    
    return (
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="40" stroke={trackColor} strokeWidth="8" fill="transparent" />
          <circle 
            cx="50%" cy="50%" r="40" stroke="#0ea5e9" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-slate-800 dark:text-white">{score}</span>
          <span className="text-xs text-slate-400 font-medium">SCORE</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Analysis</h1>
          <p className="text-slate-500 dark:text-slate-400">Based on your provided data</p>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
        >
          Start New Analysis
        </button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Net Worth</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">${result.netWorth.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"><Wallet className="w-5 h-5"/></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Monthly Flow</p>
              <p className={`text-2xl font-bold ${result.monthlyCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.monthlyCashFlow >= 0 ? '+' : ''}${result.monthlyCashFlow.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full"><DollarSign className="w-5 h-5"/></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Savings Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.savingsRate}%</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full"><Target className="w-5 h-5"/></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Debt/Income</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.debtToIncomeRatio}%</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full"><AlertTriangle className="w-5 h-5"/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Insights & Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-bl-full opacity-50 -mr-8 -mt-8"></div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 relative z-10">Executive Summary</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">{result.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {result.keyInsights.map((insight, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                  {insight}
                </span>
              ))}
            </div>
          </div>

          {/* Projection Chart */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" /> Wealth Projection (10 Years)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.wealthProjection}>
                  <defs>
                    <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#94a3b8' : '#94a3b8', fontSize: 12}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: isDarkMode ? '#94a3b8' : '#94a3b8', fontSize: 12}} 
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                      borderRadius: '8px', 
                      border: isDarkMode ? '1px solid #334155' : 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: isDarkMode ? '#f8fafc' : '#1e293b' }}
                    labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="aggressive" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorAggressive)" 
                    name="Aggressive Strategy"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conservative" 
                    stroke="#0ea5e9" 
                    fillOpacity={1} 
                    fill="url(#colorConservative)" 
                    name="Conservative Strategy"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
               <h3 className="text-lg font-bold text-slate-800 dark:text-white">Action Plan</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">Prioritized steps to improve your financial health</p>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
               {result.actionPlan.map((action, idx) => (
                 <div key={idx} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{action.title}</h4>
                     </div>
                     <span className={`px-2 py-1 rounded text-xs font-medium ${
                       action.priority === 'High' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                       action.priority === 'Medium' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                     }`}>
                       {action.priority} Priority
                     </span>
                   </div>
                   <p className="text-slate-600 dark:text-slate-400 text-sm ml-11 mb-2">{action.description}</p>
                   <div className="ml-11 flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 font-medium">
                     <ArrowUpRight className="w-3 h-3" /> Impact: {action.impact}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar: Score & Breakdown */}
        <div className="space-y-8">
          
          {/* Health Score Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Financial Health</h3>
            <ScoreGauge score={result.financialHealthScore} />
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              Your score is calculated based on savings, debt, and asset allocation diversity.
            </p>
          </div>

          {/* Expenses Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Expense Breakdown</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                    nameKey="category"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#0f172a' : '#fff'} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number, name: string, entry: any) => [`${value}% ($${entry.payload.amount.toLocaleString()})`, name]}
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      borderColor: isDarkMode ? '#334155' : '#f1f5f9',
                      color: isDarkMode ? '#f8fafc' : '#0f172a',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {pieData.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-slate-600 dark:text-slate-300">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-slate-400 text-xs">${item.amount.toLocaleString()}</span>
                     <span className="font-medium text-slate-800 dark:text-white">{item.percentage}%</span>
                  </div>
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