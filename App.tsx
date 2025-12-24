
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AIAdvisor from './components/AIAdvisor';
import Settings from './components/Settings';
import { Transaction, Budget, SavingsGoal, Category } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_GOALS, CATEGORIES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);
  const [userProfile, setUserProfile] = useState({ name: 'John Doe', currency: '$' });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('finvise_data_v3');
    if (saved) {
      const { txs, bgts, gls, profile } = JSON.parse(saved);
      setTransactions(txs);
      setBudgets(bgts);
      setGoals(gls);
      if (profile) setUserProfile(profile);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('finvise_data_v3', JSON.stringify({
      txs: transactions,
      bgts: budgets,
      gls: goals,
      profile: userProfile
    }));
  }, [transactions, budgets, goals, userProfile]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = { ...newTx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [tx, ...prev]);
    if (tx.type === 'expense') {
      setBudgets(prev => prev.map(b => b.category === tx.category ? { ...b, spent: b.spent + tx.amount } : b));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} budgets={budgets} goals={goals} currency={userProfile.currency} onAddTransactionClick={() => setActiveTab('transactions')} />;
      case 'transactions':
        return <TransactionList transactions={transactions} onAddTransaction={addTransaction} />;
      case 'budgets':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Budgeting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map(b => (
                <div key={b.category} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">{b.category}</span>
                    <span className="text-sm font-bold text-slate-400">{userProfile.currency}{b.spent} / {userProfile.currency}{b.limit}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (b.spent / b.limit) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ai':
        return <AIAdvisor transactions={transactions} budgets={budgets} goals={goals} />;
      case 'settings':
        return <Settings user={userProfile} onUpdate={setUserProfile} />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
