import { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, Send, Loader2, Key, Beaker, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useAIStore } from '../store/useAIStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { generateInsights, chatWithAI } from '../services/aiService';
import clsx from 'clsx';

interface InsightsData {
  healthScore: number;
  anomalies: string[];
  recommendations: string[];
}

export function AIInsightsPage() {
  const { provider, apiKey, setCredentials, clearCredentials } = useAIStore();
  const { transactions } = useTransactionStore();
  const { addToast } = useAuthStore();
  
  const [selectedProvider, setSelectedProvider] = useState<'gpt' | 'gemini' | 'test' | null>(null);
  const [tempKey, setTempKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (provider) {
      loadInsights();
    }
  }, [provider]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadInsights = async () => {
    if (!provider) return;
    setLoading(true);
    try {
      const data = await generateInsights(transactions, provider, apiKey);
      setInsights(data);
    } catch (err: any) {
      if (err.message === 'AUTH_ERROR') {
        addToast('error', 'Invalid API Key. Please check your credentials');
        clearCredentials();
      } else {
        addToast('error', 'Failed to generate insights');
      }
    } finally {
      setTimeout(() => setLoading(false), 800); // Small delay for effect
    }
  };

  const handleConnect = () => {
    if (selectedProvider === 'test') {
      setCredentials('test');
      addToast('success', 'Connected to Demo Mode');
    } else if (selectedProvider && tempKey) {
      setCredentials(selectedProvider, tempKey);
      addToast('success', `Connected to ${selectedProvider === 'gpt' ? 'OpenAI' : 'Gemini'}`);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !provider) return;
    const userMsg = inputMessage.trim();
    setInputMessage('');
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setSending(true);

    try {
      const aiResponse = await chatWithAI(userMsg, transactions, messages, provider, apiKey);
      setMessages([...newMessages, { role: 'assistant' as const, content: aiResponse }]);
    } catch (err: any) {
      if (err.message === 'AUTH_ERROR') {
        addToast('error', 'Invalid API Key');
        clearCredentials();
      } else {
        addToast('error', 'Failed to get AI response');
      }
    } finally {
      setSending(false);
    }
  };

  if (transactions.length === 0) {
    return <EmptyState title="No Data for AI" message="Add some transactions first so the AI has data to analyze." />;
  }

  if (!provider) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-2 md:p-4">
        <Card className="w-full max-w-xl p-8 bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4 ring-1 ring-indigo-500/20">
              <Sparkles size={32} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-xl md:text-2xl font-headline font-bold text-gray-900 dark:text-white">Connect AI Assistant</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Choose your preferred AI model to analyze your financial data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { id: 'gpt' as const, name: 'OpenAI (GPT-4)', icon: Bot },
              { id: 'gemini' as const, name: 'Google Gemini', icon: CheckCircle2 },
              { id: 'test' as const, name: 'Demo Mode', icon: Beaker },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p.id)}
                className={clsx(
                  'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group',
                  selectedProvider === p.id 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' 
                    : 'border-gray-100 dark:border-slate-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:border-slate-600 dark:hover:bg-transparent'
                )}
              >
                <p.icon size={24} className={clsx('mb-2', selectedProvider === p.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-slate-400')} />
                <span className={clsx('text-xs font-bold', selectedProvider === p.id ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-500 dark:text-slate-400')}>{p.name}</span>
              </button>
            ))}
          </div>

          <div className={clsx('space-y-4 overflow-hidden transition-all duration-300', selectedProvider ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0')}>
            {selectedProvider !== 'test' ? (
              <Input
                label="API Key"
                type="password"
                placeholder="Paste your API key here..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                icon={<Key size={14} />}
              />
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg flex gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">No key required. Uses simulated responses for testing.</p>
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={handleConnect}
              disabled={selectedProvider !== 'test' && !tempKey}
            >
              {selectedProvider === 'test' ? 'Start Demo' : 'Save & Connect'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">AI Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-headline font-bold text-gray-900 dark:text-white">AI Financial Assistant</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 capitalize">Active: {provider}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCredentials} className="text-rose-500 hover:text-rose-600">
            Disconnect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Automated Analysis */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="space-y-8 animate-pulse">
              <Card className="h-64 bg-gray-100 dark:bg-slate-800/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-48 bg-gray-100 dark:bg-slate-800/50" />
                <Card className="h-48 bg-gray-100 dark:bg-slate-800/50" />
              </div>
            </div>
          ) : (
            <>
              {/* Financial Health */}
              <Card className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Bot size={120} />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-slate-700" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * (insights?.healthScore ?? 0)) / 100} className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{insights?.healthScore ?? 0}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Health</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-headline font-bold text-gray-900 dark:text-white mb-2">Financial Well-being Analysis</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Your current financial health is rated as {(insights?.healthScore ?? 0) >= 80 ? 'excellent' : (insights?.healthScore ?? 0) >= 60 ? 'good' : 'needs attention'}. 
                      The AI has analyzed your spending patterns, savings rate, and transaction frequency.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Anomaly Detection */}
                <Card className="p-6">
                  <h3 className="text-lg font-headline font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle size={18} className="text-amber-500" /> Anomaly Detection
                  </h3>
                  <div className="space-y-4">
                    {insights?.anomalies.map((anomaly: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-slate-400">{anomaly}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Smart Recommendations */}
                <Card className="p-6">
                  <h3 className="text-lg font-headline font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-green-500" /> Smart Recommendations
                  </h3>
                  <div className="space-y-4">
                    {insights?.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-green-100/70">{rec}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Chat Interface */}
        <Card className="h-[600px] flex flex-col overflow-hidden bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-xl">
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Ask AI Assistant</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot size={32} className="mx-auto text-gray-500 dark:text-slate-600 mb-2" />
                <p className="text-xs text-gray-600 dark:text-slate-500">Ask me anything about your finances.<br/>Try "How much did I spend on food?"</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={clsx(
                  'max-w-[85%] p-3 rounded-2xl text-sm shadow-sm',
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-tl-none'
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none">
                  <Loader2 size={14} className="animate-spin text-gray-600 dark:text-slate-400" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask your assistant..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-500 dark:placeholder:text-slate-500"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sending}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
