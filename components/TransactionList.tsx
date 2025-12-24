
import React, { useState } from 'react';
import { Transaction, Category } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onAddTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  const [newTx, setNewTx] = useState({
    amount: 0,
    category: 'Other' as Category,
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense'
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction(newTx);
    setIsModalOpen(false);
    setNewTx({ amount: 0, category: 'Other', description: '', date: new Date().toISOString().split('T')[0], type: 'expense' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Ledger</h2>
          <p className="text-slate-500">Search and manage your financial history.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          Add Transaction
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text"
            placeholder="Search descriptions..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="w-full md:w-48 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{t.description}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.category}</p>
                  </td>
                  <td className={`px-6 py-4 font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400">No transactions found matching your search.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-6">New Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                <button type="button" onClick={() => setNewTx({...newTx, type: 'expense'})} className={`flex-1 py-2 rounded-lg text-sm font-bold ${newTx.type === 'expense' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}>Expense</button>
                <button type="button" onClick={() => setNewTx({...newTx, type: 'income'})} className={`flex-1 py-2 rounded-lg text-sm font-bold ${newTx.type === 'income' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}>Income</button>
              </div>
              <input type="number" placeholder="Amount" required className="w-full px-4 py-3 rounded-xl border" value={newTx.amount || ''} onChange={e => setNewTx({...newTx, amount: parseFloat(e.target.value)})} />
              <input type="text" placeholder="Description" required className="w-full px-4 py-3 rounded-xl border" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
              <select className="w-full px-4 py-3 rounded-xl border bg-white" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value as Category})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="date" className="w-full px-4 py-3 rounded-xl border" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
