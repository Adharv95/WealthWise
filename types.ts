// Financial Data Input Types
export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'cash' | 'investment' | 'property' | 'crypto' | 'other';
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number; // Monthly
}

export interface UserFinancialProfile {
  monthlyIncome: number;
  assets: Asset[];
  liabilities: Liability[];
  expenses: Expense[];
  financialGoal: string;
  age: number;
}

// AI Analysis Result Types
export interface ActionItem {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
}

export interface ProjectionPoint {
  year: number;
  conservative: number;
  aggressive: number;
}

export interface AnalysisResult {
  financialHealthScore: number; // 0-100
  netWorth: number;
  monthlyCashFlow: number;
  debtToIncomeRatio: number;
  savingsRate: number;
  summary: string;
  keyInsights: string[];
  actionPlan: ActionItem[];
  wealthProjection: ProjectionPoint[];
  expenseBreakdown: { category: string; percentage: number }[];
}

export enum AppState {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}