import React, { useState, useEffect } from 'react';
import { AppState, UserFinancialProfile, AnalysisResult } from './types';
import { INITIAL_PROFILE } from './constants';
import FinancialForm from './components/FinancialForm';
import AnalysisLoader from './components/AnalysisLoader';
import Dashboard from './components/Dashboard';
import { analyzeFinances } from './services/geminiService';
import { TrendingUp, ShieldCheck, Moon, Sun } from 'lucide-react';

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
      // Simulate minimum loading time for UX (so the loader is seen)
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 3000));
      const analysisPromise = analyzeFinances(data);
      
      const [result] = await Promise.all([analysisPromise, minLoadTime]);
      
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Failed to generate analysis. Please check your API Key and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary-200 selection:text-primary-900 transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Wealth<span className="text-primary-600">Wise</span></span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:flex items-center gap-1.5 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Bank-Grade Encryption
              </span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {appState === AppState.INPUT && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl mb-4">
                Architect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Financial Future</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Stop guessing. Let our advanced AI model analyze your income, assets, and debts to build a personalized roadmap to wealth.
              </p>
            </div>
            <FinancialForm initialData={userProfile} onSubmit={handleFormSubmit} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <AnalysisLoader />
        )}

        {appState === AppState.RESULTS && analysisResult && (
          <Dashboard 
            result={analysisResult} 
            profile={userProfile} 
            onReset={handleReset} 
            isDarkMode={isDarkMode}
          />
        )}

        {appState === AppState.ERROR && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <ShieldCheck className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analysis Failed</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{error || "An unexpected error occurred."}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} WealthWise AI. All calculations are estimates based on user input.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;