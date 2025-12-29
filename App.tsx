import React, { useState, useEffect } from 'react';
import { AppState, UserFinancialProfile, AnalysisResult } from './types';
import { INITIAL_PROFILE } from './constants';
import FinancialForm from './components/FinancialForm';
import AnalysisLoader from './components/AnalysisLoader';
import Dashboard from './components/Dashboard';
import { analyzeFinances } from './services/geminiService';
import { TrendingUp, ShieldCheck, Moon, Sun, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [userProfile, setUserProfile] = useState<UserFinancialProfile>(INITIAL_PROFILE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleFormSubmit = async (data: UserFinancialProfile) => {
    setUserProfile(data);
    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 3500));
      const result = await analyzeFinances(data);
      await minLoadTime;
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("We encountered an error analyzing your secure data. Please ensure your inputs are complete and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary-200 transition-colors duration-500">
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleReset}>
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              Wealth<span className="text-primary-600">Wise</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-1.5 rounded-full">
              <Lock className="w-3 h-3 text-emerald-500" /> AES-256 Analysis
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {appState === AppState.INPUT && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Master Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 animate-gradient-x">Capital Strategy.</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Connect your financial profile to our proprietary AI core for a institutional-grade wealth audit and 10-year growth projection.
              </p>
            </div>
            <FinancialForm initialData={userProfile} onSubmit={handleFormSubmit} />
          </div>
        )}

        {appState === AppState.ANALYZING && <AnalysisLoader />}

        {appState === AppState.RESULTS && analysisResult && (
          <Dashboard result={analysisResult} profile={userProfile} onReset={handleReset} isDarkMode={isDarkMode} />
        )}

        {appState === AppState.ERROR && (
          <div className="text-center py-32 max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 mb-8">
              <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Strategic Error</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">{error}</p>
            <button onClick={handleReset} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-500/30 transition-all">
              Re-initialize Advisor
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} WealthWise AI • Institutional Grade Analytics
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="cursor-pointer hover:text-primary-500 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-primary-500 transition-colors">Risk Disclosure</span>
            <span className="cursor-pointer hover:text-primary-500 transition-colors">Methodology</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;