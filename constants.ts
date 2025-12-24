
import { Category, Transaction, Budget, SavingsGoal } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 3500, category: 'Other', description: 'Monthly Salary', date: '2023-11-01', type: 'income' },
  { id: '2', amount: 1200, category: 'Housing', description: 'Rent Payment', date: '2023-11-02', type: 'expense' },
  { id: '3', amount: 50, category: 'Food', description: 'Grocery Store', date: '2023-11-03', type: 'expense' },
  { id: '4', amount: 15, category: 'Transport', description: 'Subway Ride', date: '2023-11-04', type: 'expense' },
  { id: '5', amount: 80, category: 'Shopping', description: 'New Shoes', date: '2023-11-05', type: 'expense' },
  { id: '6', amount: 45, category: 'Entertainment', description: 'Cinema', date: '2023-11-06', type: 'expense' },
];

export const INITIAL_BUDGETS: Budget[] = [
  { category: 'Housing', limit: 1300, spent: 1200 },
  { category: 'Food', limit: 400, spent: 50 },
  { category: 'Transport', limit: 200, spent: 15 },
  { category: 'Shopping', limit: 300, spent: 80 },
  { category: 'Entertainment', limit: 150, spent: 45 },
];

export const INITIAL_GOALS: SavingsGoal[] = [
  { id: 'g1', name: 'Emergency Fund', target: 5000, current: 2500, deadline: '2024-12-31' },
  { id: 'g2', name: 'New Laptop', target: 2000, current: 400, deadline: '2024-06-30' },
];

export const CATEGORIES: Category[] = ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other'];
