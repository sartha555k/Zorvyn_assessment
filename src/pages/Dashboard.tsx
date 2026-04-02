import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowDownRight, ArrowUpRight, PiggyBank, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useTransactionStore } from '../store/useTransactionStore';
import { useFilterStore } from '../store/useFilterStore';
import { useInsights } from '../hooks/useInsights';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORY_COLORS, Category } from '../types';
import { format, subMonths, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import clsx from 'clsx';

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

const months = Array.from({ length: 6 }, (_, i) => {
  const d = subMonths(new Date(2025, 5, 1), 5 - i);
  return { value: format(d, 'yyyy-MM'), label: format(d, 'MMM yyyy') };
});

export function Dashboard() {
  const navigate = useNavigate();
  const { transactions } = useTransactionStore();
  const { activeMonth, setActiveMonth } = useFilterStore();
  const { biggestExpense, momChange, topCategory } = useInsights(transactions, activeMonth);

  const [year, month] = activeMonth.split('-').map(Number);
  const currentDate = new Date(year, month - 1, 1);
  const prevDate = subMonths(currentDate, 1);

  const currentMonthTxs = transactions.filter((t) => {
    const d = parseISO(t.date);
    return d >= startOfMonth(currentDate) && d <= endOfMonth(currentDate);
  });

  const prevMonthTxs = transactions.filter((t) => {
    const d = parseISO(t.date);
    return d >= startOfMonth(prevDate) && d <= endOfMonth(prevDate);
  });

  const currentIncome = currentMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const currentExpense = currentMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  const prevIncome = prevMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const prevExpense = prevMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);

  const totalBalance = transactions.reduce((s, t) => s + t.amount, 0);
  const savingsRate = currentIncome > 0 ? Math.round(((currentIncome - currentExpense) / currentIncome) * 100) : 0;
  const incomeChange = prevIncome > 0 ? Math.round(((currentIncome - prevIncome) / prevIncome) * 100) : 0;
  const expenseChange = prevExpense > 0 ? Math.round(((currentExpense - prevExpense) / prevExpense) * 100) : 0;

  const animatedBalance = useCountUp(totalBalance);
  const animatedIncome = useCountUp(currentIncome);
  const animatedExpense = useCountUp(currentExpense);
  const animatedSavings = useCountUp(Math.abs(savingsRate));

  // Cash Flow chart data
  const cashFlowData = months.map((m) => {
    const [y, mo] = m.value.split('-').map(Number);
    const start = new Date(y, mo - 1, 1);
    const end = endOfMonth(start);
    const monthTxs = transactions.filter((t) => {
      const d = parseISO(t.date);
      return d >= start && d <= end;
    });
    return {
      month: m.label.split(' ')[0],
      income: monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0),
    };
  });

  // Spending breakdown data
  const categorySpend: Record<string, number> = {};
  currentMonthTxs.filter(t => t.type === 'expense').forEach(t => {
    categorySpend[t.category] = (categorySpend[t.category] || 0) + Math.abs(t.amount);
  });
  const pieData = Object.entries(categorySpend)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));
  const totalPieValue = pieData.reduce((s, d) => s + d.value, 0);

  // Recent transactions
  const recentTxs = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const summaryCards = [
    { label: 'Total Balance', value: animatedBalance, change: incomeChange, icon: Wallet, color: '#5bb1ff', positive: totalBalance >= 0 },
    { label: 'Monthly Income', value: animatedIncome, change: incomeChange, icon: ArrowUpRight, color: '#00fd87', positive: true },
    { label: 'Monthly Expenses', value: animatedExpense, change: expenseChange, icon: ArrowDownRight, color: '#ff706f', positive: false },
    { label: 'Savings Rate', value: animatedSavings, change: null, icon: PiggyBank, color: '#f59e0b', positive: savingsRate >= 0, isSavings: true },
  ];

  return (
    <section className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-headline font-black tracking-tight text-white mb-1">
            Pulse AI <span className="text-[#a4ffb9]">Insights</span>
          </h1>
          <p className="text-slate-500 text-sm">Deep-frequency analysis for your finances</p>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {months.map((m) => (
          <button
            key={m.value}
            onClick={() => setActiveMonth(m.value)}
            className={clsx(
              'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all',
              activeMonth === m.value
                ? 'bg-[#00fd87]/15 text-[#00fd87] border border-[#00fd87]/40'
                : 'bg-[#1e1f26] text-slate-400 hover:text-white border border-transparent'
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} glowing className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                {card.change !== null && (
                  <span
                    className={clsx(
                      'text-[10px] font-mono px-2 py-0.5 rounded-full',
                      card.change >= 0
                        ? 'bg-[#00fd87]/10 text-[#00fd87]'
                        : 'bg-[#ff706f]/10 text-[#ff706f]'
                    )}
                  >
                    {card.change >= 0 ? '+' : ''}{card.change}%
                  </span>
                )}
              </div>
              <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-mono font-medium text-white">
                {(card as any).isSavings ? `${card.value}%` : formatCurrency(card.value)}
              </p>
              <div
                className="h-1 mt-3 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${card.color}, transparent)`,
                  opacity: 0.3,
                }}
              />
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cash Flow */}
        <Card className="lg:col-span-3 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline font-bold text-white">Cash Flow Trend</h2>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00fd87]" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff706f]" /> Expense
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00fd87" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00fd87" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff706f" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ff706f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#75757c" fontSize={11} fontFamily="DM Mono" />
              <YAxis stroke="#75757c" fontSize={10} fontFamily="DM Mono" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  background: '#1a1c24',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontFamily: 'DM Mono',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area type="monotone" dataKey="income" stroke="#00fd87" strokeWidth={2} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expense" stroke="#ff706f" strokeWidth={2} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Spending Breakdown */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-headline font-bold text-white mb-6">Spending Breakdown</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLORS[entry.name as Category] || '#6b7280'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1c24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded"
                        style={{ backgroundColor: CATEGORY_COLORS[entry.name as Category] || '#6b7280' }}
                      />
                      <span className="text-slate-300">{entry.name}</span>
                    </div>
                    <span className="font-mono text-white">
                      {formatCurrency(entry.value)} <span className="text-slate-500">{Math.round((entry.value / totalPieValue) * 100)}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm text-center py-10">No data for this period</p>
          )}
        </Card>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          glowing
          onClick={() => navigate('/insights?modal=biggest')}
          className="p-6 border-l-4 border-[#ff706f] hover:border-l-4"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-[#ff706f]/10">
              <TrendingUp size={20} className="text-[#ff706f]" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">🔥 Hot</span>
          </div>
          <h3 className="text-slate-400 text-[13px] font-medium mb-1">Biggest Expense</h3>
          <p className="text-2xl font-mono text-white mb-1">{biggestExpense.category}</p>
          <p className="text-sm text-slate-500">{formatCurrency(biggestExpense.totalAmount)} this month</p>
          <p className="text-xs text-[#ff706f] mt-4 flex items-center gap-1">
            View Details <ExternalLink size={12} />
          </p>
        </Card>

        <Card
          glowing
          onClick={() => navigate('/insights?modal=mom')}
          className="p-6 border-l-4 border-[#00fd87]"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-[#00fd87]/10">
              {momChange.trend === 'up' ? (
                <TrendingUp size={20} className="text-[#00fd87]" />
              ) : (
                <TrendingDown size={20} className="text-[#00fd87]" />
              )}
            </div>
            <span className={clsx(
              'text-[10px] font-mono px-2 py-1 rounded',
              momChange.trend === 'up'
                ? 'text-[#ff706f] bg-[#ff706f]/10'
                : 'text-[#00fd87] bg-[#00fd87]/10'
            )}>
              📈 {momChange.trend === 'up' ? 'Watch' : 'Good'}
            </span>
          </div>
          <h3 className="text-slate-400 text-[13px] font-medium mb-1">MoM Change</h3>
          <p className="text-2xl font-mono text-white mb-1">
            {momChange.changePercent >= 0 ? '+' : ''}{momChange.changePercent}%
          </p>
          <p className="text-sm text-slate-500">vs last month</p>
          <p className="text-xs text-[#00fd87] mt-4 flex items-center gap-1">
            View Details <ExternalLink size={12} />
          </p>
        </Card>

        <Card
          glowing
          onClick={() => navigate('/insights?modal=top')}
          className="p-6 border-l-4 border-[#5bb1ff]"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-[#5bb1ff]/10">
              <TrendingUp size={20} className="text-[#5bb1ff]" />
            </div>
            <span className="text-[10px] font-mono text-[#5bb1ff] bg-[#5bb1ff]/10 px-2 py-1 rounded">🏆 #1</span>
          </div>
          <h3 className="text-slate-400 text-[13px] font-medium mb-1">Top Category</h3>
          <p className="text-2xl font-mono text-white mb-1">{topCategory.name}</p>
          <p className="text-sm text-slate-500">{topCategory.count} transactions</p>
          <p className="text-xs text-[#5bb1ff] mt-4 flex items-center gap-1">
            View Details <ExternalLink size={12} />
          </p>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
          <h2 className="font-headline font-bold text-white">Recent Transactions</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-xs font-bold text-[#00fd87] hover:underline flex items-center gap-1"
          >
            View All <ExternalLink size={12} />
          </button>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {recentTxs.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[tx.category]}10`,
                    borderColor: `${CATEGORY_COLORS[tx.category]}30`,
                    color: CATEGORY_COLORS[tx.category],
                  }}
                >
                  <span className="text-sm font-bold">{tx.category[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{tx.merchant}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {format(parseISO(tx.date), 'dd MMM yyyy')}
                    </span>
                    <Badge color={CATEGORY_COLORS[tx.category]}>{tx.category}</Badge>
                  </div>
                </div>
              </div>
              <span
                className={clsx(
                  'font-mono font-medium text-sm',
                  tx.type === 'income' ? 'text-[#00fd87]' : 'text-[#ff706f]'
                )}
              >
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
