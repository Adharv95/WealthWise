import { UserFinancialProfile, Asset, Liability, Expense } from './types';
import { LayoutDashboard, Wallet, TrendingUp, AlertCircle } from 'lucide-react';

export const INITIAL_ASSET: Asset = { id: '', name: '', value: 0, type: 'cash' };
export const INITIAL_LIABILITY: Liability = { id: '', name: '', amount: 0, interestRate: 0 };
export const INITIAL_EXPENSE: Expense = { id: '', category: 'Housing', amount: 0 };

export const INITIAL_PROFILE: UserFinancialProfile = {
  monthlyIncome: 0,
  age: 0,
  financialGoal: "",
  assets: [],
  liabilities: [],
  expenses: []
};

export const EXPENSE_CATEGORIES = [
  'Housing', 'Food', 'Transport', 'Utilities', 'Insurance', 'Healthcare', 
  'Savings', 'Debt Repayment', 'Entertainment', 'Personal Care', 'Other'
];

export const ANALYSIS_STEPS = [
  { message: "Securely processing financial data...", icon: Wallet },
  { message: "Calculating net worth and cash flow...", icon: LayoutDashboard },
  { message: "Analyzing debt structures and interest rates...", icon: AlertCircle },
  { message: "Projecting future wealth scenarios...", icon: TrendingUp },
  { message: "Finalizing personalized strategy...", icon: Wallet },
];
