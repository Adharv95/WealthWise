import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, DollarSign, Briefcase, CreditCard, PieChart } from 'lucide-react';
import { UserFinancialProfile, Asset, Liability, Expense } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  initialData: UserFinancialProfile;
  onSubmit: (data: UserFinancialProfile) => void;
}

const FinancialForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [profile, setProfile] = useState<UserFinancialProfile>(initialData);
  const [step, setStep] = useState(1);

  const updateField = (field: keyof UserFinancialProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Generic handler for array fields (assets, liabilities, expenses)
  const addItem = <K extends 'assets' | 'liabilities' | 'expenses'>(
    field: K,
    newItem: Omit<UserFinancialProfile[K][number], 'id'>
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], { ...newItem, id: uuidv4() }] as any
    }));
  };

  const removeItem = (field: 'assets' | 'liabilities' | 'expenses', id: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((item: any) => item.id !== id) as any
    }));
  };

  const updateItem = <K extends 'assets' | 'liabilities' | 'expenses'>(
    field: K,
    id: string,
    updates: Partial<UserFinancialProfile[K][number]>
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].map((item: any) => (item.id === id ? { ...item, ...updates } : item)) as any
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const totalIncome = profile.monthlyIncome;
  const totalExpenses = profile.expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Progress Header */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center transition-colors duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Financial Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Step {step} of 4</p>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-2 w-12 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>
      </div>

      <div className="p-8 min-h-[500px]">
        {/* Step 1: Basics & Income */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Briefcase className="w-5 h-5 text-primary-600" /> Income & Basics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Age</label>
                <input
                  type="number"
                  value={profile.age || ''}
                  placeholder="e.g. 30"
                  onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Net Income</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="number"
                    value={profile.monthlyIncome || ''}
                    placeholder="e.g. 5000"
                    onChange={(e) => updateField('monthlyIncome', parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Financial Goal</label>
                <textarea
                  value={profile.financialGoal}
                  onChange={(e) => updateField('financialGoal', e.target.value)}
                  placeholder="e.g. Save for a house, Retire by 45, Pay off debt..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none h-24 resize-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Assets */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <DollarSign className="w-5 h-5 text-green-600" /> Assets
              </h3>
              <button
                onClick={() => addItem('assets', { name: '', value: 0, type: 'cash' })}
                className="text-sm px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Asset
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {profile.assets.map((asset) => (
                <div key={asset.id} className="flex gap-4 items-end p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Name</label>
                    <input
                      type="text"
                      value={asset.name}
                      placeholder="e.g. Savings"
                      onChange={(e) => updateItem('assets', asset.id, { name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Type</label>
                    <select
                      value={asset.type}
                      onChange={(e) => updateItem('assets', asset.id, { type: e.target.value as any })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="investment">Investment</option>
                      <option value="property">Property</option>
                      <option value="crypto">Crypto</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Value</label>
                    <input
                      type="number"
                      value={asset.value || ''}
                      placeholder="0.00"
                      onChange={(e) => updateItem('assets', asset.id, { value: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500 placeholder:text-slate-400"
                    />
                  </div>
                  <button onClick={() => removeItem('assets', asset.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {profile.assets.length === 0 && (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  No assets added yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Liabilities */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <CreditCard className="w-5 h-5 text-red-600" /> Liabilities (Debts)
              </h3>
              <button
                onClick={() => addItem('liabilities', { name: '', amount: 0, interestRate: 0 })}
                className="text-sm px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Debt
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {profile.liabilities.map((liability) => (
                <div key={liability.id} className="flex gap-4 items-end p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Name</label>
                    <input
                      type="text"
                      value={liability.name}
                      placeholder="e.g. Car Loan"
                      onChange={(e) => updateItem('liabilities', liability.id, { name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interest %</label>
                    <input
                      type="number"
                      value={liability.interestRate || ''}
                      placeholder="0.0"
                      onChange={(e) => updateItem('liabilities', liability.id, { interestRate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Amount</label>
                    <input
                      type="number"
                      value={liability.amount || ''}
                      placeholder="0.00"
                      onChange={(e) => updateItem('liabilities', liability.id, { amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500 placeholder:text-slate-400"
                    />
                  </div>
                  <button onClick={() => removeItem('liabilities', liability.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {profile.liabilities.length === 0 && (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  No liabilities. Great job!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Expenses */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <PieChart className="w-5 h-5 text-orange-600" /> Monthly Expenses
              </h3>
              <button
                onClick={() => addItem('expenses', { category: 'Housing', amount: 0 })}
                className="text-sm px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Expense
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
              {profile.expenses.map((expense) => (
                <div key={expense.id} className="flex gap-2 items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex-1">
                    <select
                      value={expense.category}
                      onChange={(e) => updateItem('expenses', expense.id, { category: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500"
                    >
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1.5 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={expense.amount || ''}
                      placeholder="0.00"
                      onChange={(e) => updateItem('expenses', expense.id, { amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded pl-4 pr-2 py-1.5 text-sm text-slate-900 dark:text-white border outline-none focus:border-primary-500 placeholder:text-slate-400"
                    />
                  </div>
                  <button onClick={() => removeItem('expenses', expense.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-xl border ${totalExpenses > totalIncome ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400'} flex justify-between items-center`}>
              <span className="font-medium">Net Monthly Cashflow</span>
              <span className="text-lg font-bold">
                {totalIncome - totalExpenses >= 0 ? '+' : '-'}${Math.abs(totalIncome - totalExpenses).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-slate-50 dark:bg-slate-800 p-6 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          Back
        </button>
        
        {step < 4 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onSubmit(profile)}
            className="px-8 py-2.5 bg-secondary-900 text-white rounded-lg font-medium hover:bg-secondary-800 transition-all shadow-lg shadow-secondary-900/30 flex items-center gap-2"
          >
            Analyze Finances <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FinancialForm;