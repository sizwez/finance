
import React, { useState, useEffect, useRef } from 'react';
import { Transaction, Budget, SavingsGoal, AIInsight, GroundingSource } from '../types';
import { getFinancialAdvice, chatWithAdvisorStream } from '../services/geminiService';

interface AIAdvisorProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, budgets, goals }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, sources?: GroundingSource[]}[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInsights = async () => {
      setLoadingInsights(true);
      const data = await getFinancialAdvice(transactions, budgets, goals);
      setInsights(data);
      setLoadingInsights(false);
    };
    loadInsights();
  }, [transactions, budgets, goals]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);

    let assistantMessage = "";
    let assistantSources: GroundingSource[] = [];
    setMessages(prev => [...prev, { role: 'assistant', content: "", sources: [] }]);

    try {
        const stream = chatWithAdvisorStream(userMessage);
        for await (const chunk of stream) {
            assistantMessage += chunk.text;
            if (chunk.sources && chunk.sources.length > 0) {
              assistantSources = [...assistantSources, ...chunk.sources];
            }
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content = assistantMessage;
                updated[updated.length - 1].sources = Array.from(new Set(assistantSources.map(s => s.uri))).map(uri => assistantSources.find(s => s.uri === uri)!);
                return updated;
            });
        }
    } catch (err) {
        setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = "I encountered an error. Please try again.";
            return updated;
        });
    } finally {
        setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-180px)]">
      <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <h2 className="text-xl font-bold text-slate-800 sticky top-0 bg-slate-50 py-2 z-10">AI Insights</h2>
        {loadingInsights ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border"></div>)}
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-blue-500 hover:shadow-md transition-all">
              <h4 className="font-bold text-slate-900 mb-2">{insight.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{insight.advice}</p>
            </div>
          ))
        )}
      </div>

      <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20" ref={scrollRef}>
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-60">
                    <p className="text-sm font-medium">Ask about market trends, inflation, or your own spending.</p>
                </div>
            )}
            {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] px-5 py-3 rounded-2xl border ${
                        m.role === 'user' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                    {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.sources.slice(0, 3).map((source, idx) => (
                          <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded hover:underline">
                            {source.title.substring(0, 20)}...
                          </a>
                        ))}
                      </div>
                    )}
                </div>
            ))}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t flex space-x-2">
            <input 
                type="text"
                placeholder="Ask your AI Advisor..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={sending}
            />
            <button type="submit" disabled={sending || !input.trim()} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
        </form>
      </div>
    </div>
  );
};

export default AIAdvisor;
