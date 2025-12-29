import React, { useEffect, useState } from 'react';
import { ANALYSIS_STEPS } from '../constants';

const AnalysisLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500); // Change step every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      <div className="relative w-24 h-24 mb-12">
        {/* Spinning Rings */}
        <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 border-4 border-secondary-400 rounded-full border-b-transparent animate-spin-reverse opacity-70"></div>
        
        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-primary-600 dark:text-primary-400">
          {(() => {
            const Icon = ANALYSIS_STEPS[currentStep].icon;
            return <Icon className="w-8 h-8 animate-pulse" />;
          })()}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Analyzing your Wealth</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Please wait while our AI architect processes your profile</p>

      <div className="w-full max-w-md space-y-4">
        {ANALYSIS_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div 
              key={index} 
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
                isActive ? 'bg-white dark:bg-slate-900 shadow-md scale-105 border border-slate-100 dark:border-slate-800' : 'opacity-50'
              } ${isCompleted ? 'opacity-40' : ''}`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-500'}`}>
                {step.message}
              </span>
              {isCompleted && <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisLoader;