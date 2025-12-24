
export type Category = 'Housing' | 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Health' | 'Education' | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export interface UserProfile {
  name: string;
  currency: string;
  isPremium: boolean;
}

export interface AIInsight {
  title: string;
  advice: string;
  impact: 'low' | 'medium' | 'high';
}

export interface GroundingSource {
  title: string;
  uri: string;
}
