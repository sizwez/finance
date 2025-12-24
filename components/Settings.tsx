
import React from 'react';

interface SettingsProps {
  user: { name: string; currency: string };
  onUpdate: (data: { name: string; currency: string }) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Settings</h2>
      
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={user.name}
              onChange={e => onUpdate({ ...user, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred Currency</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={user.currency}
              onChange={e => onUpdate({ ...user, currency: e.target.value })}
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="¥">JPY (¥)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2">Data Management</h4>
            <p className="text-sm text-slate-500 mb-4">Export all your transactions to a CSV file for external use.</p>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="bg-blue-600 p-8 text-white">
          <h4 className="font-bold text-lg mb-2">FinVise Premium</h4>
          <p className="text-sm opacity-80 mb-6">Unlock real-time bank syncing and advanced portfolio analysis.</p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
