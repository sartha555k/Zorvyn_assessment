import { useMemo } from 'react';
import { Transaction, InsightBiggestExpense, InsightMoMChange, InsightTopCategory, DeepDiveInsight, Category, CATEGORIES } from '../types';
import { format, parseISO, subMonths, getDaysInMonth, startOfMonth, endOfMonth } from 'date-fns';

export function useInsights(transactions: Transaction[], selectedMonth: string) {
  return useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const currentDate = new Date(year, month - 1, 1);
    const prevDate = subMonths(currentDate, 1);
    const prevMonth = format(prevDate, 'yyyy-MM');

    const currentMonthTxs = transactions.filter((t) => {
      const d = parseISO(t.date);
      return d >= startOfMonth(currentDate) && d <= endOfMonth(currentDate);
    });

    const prevMonthTxs = transactions.filter((t) => {
      const d = parseISO(t.date);
      return d >= startOfMonth(prevDate) && d <= endOfMonth(prevDate);
    });

    const currentExpenses = currentMonthTxs.filter((t) => t.type === 'expense');
    const prevExpenses = prevMonthTxs.filter((t) => t.type === 'expense');

    const totalCurrentExpense = currentExpenses.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );
    const totalPrevExpense = prevExpenses.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );

    // Biggest Expense
    const categorySpendMap: Record<string, number> = {};
    const categoryTxMap: Record<string, Transaction[]> = {};
    currentExpenses.forEach((t) => {
      categorySpendMap[t.category] =
        (categorySpendMap[t.category] || 0) + Math.abs(t.amount);
      if (!categoryTxMap[t.category]) categoryTxMap[t.category] = [];
      categoryTxMap[t.category].push(t);
    });

    const biggestCategory = Object.entries(categorySpendMap).sort(
      ([, a], [, b]) => b - a
    )[0];

    const biggestExpense: InsightBiggestExpense = biggestCategory
      ? {
          category: biggestCategory[0],
          totalAmount: biggestCategory[1],
          percentage:
            totalCurrentExpense > 0
              ? Math.round((biggestCategory[1] / totalCurrentExpense) * 100)
              : 0,
          transactions: (categoryTxMap[biggestCategory[0]] || [])
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
            .slice(0, 5),
        }
      : {
          category: 'None',
          totalAmount: 0,
          percentage: 0,
          transactions: [],
        };

    // MoM Change
    const changePercent =
      totalPrevExpense > 0
        ? ((totalCurrentExpense - totalPrevExpense) / totalPrevExpense) * 100
        : 0;

    const allCats = [
      ...new Set([
        ...currentExpenses.map((t) => t.category),
        ...prevExpenses.map((t) => t.category),
      ]),
    ];

    const categoryBreakdown = allCats.map((cat) => ({
      category: cat,
      current: currentExpenses
        .filter((t) => t.category === cat)
        .reduce((s, t) => s + Math.abs(t.amount), 0),
      previous: prevExpenses
        .filter((t) => t.category === cat)
        .reduce((s, t) => s + Math.abs(t.amount), 0),
    })).sort((a, b) => b.current - a.current).slice(0, 5);

    const momChange: InsightMoMChange = {
      current: totalCurrentExpense,
      previous: totalPrevExpense,
      changePercent: Math.round(changePercent * 10) / 10,
      trend: changePercent >= 0 ? 'up' : 'down',
      categoryBreakdown,
    };

    // Top Category
    const topCat = Object.entries(categorySpendMap).sort(
      ([, a], [, b]) => b - a
    )[0];

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(currentDate, 5 - i);
      return format(d, 'yyyy-MM');
    });

    const monthlyTrend = last6Months.map((m) => {
      const [y, mo] = m.split('-').map(Number);
      const monthStart = new Date(y, mo - 1, 1);
      const monthEnd = endOfMonth(monthStart);
      const amount = transactions
        .filter((t) => {
          const d = parseISO(t.date);
          return (
            t.type === 'expense' &&
            t.category === (topCat ? topCat[0] : '') &&
            d >= monthStart &&
            d <= monthEnd
          );
        })
        .reduce((s, t) => s + Math.abs(t.amount), 0);
      return { month: format(monthStart, 'MMM'), amount };
    });

    const topCatTxs = topCat ? categoryTxMap[topCat[0]] || [] : [];
    const topCategory: InsightTopCategory = topCat
      ? {
          name: topCat[0],
          totalSpend: topCat[1],
          count: topCatTxs.length,
          avgAmount:
            topCatTxs.length > 0 ? Math.round(topCat[1] / topCatTxs.length) : 0,
          monthlyTrend,
        }
      : {
          name: 'None',
          totalSpend: 0,
          count: 0,
          avgAmount: 0,
          monthlyTrend: [],
        };

    // Deep Dive
    const daysInMonth = getDaysInMonth(currentDate);
    let cumulative = 0;
    const dailyFlow = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dayTxs = currentMonthTxs.filter(
        (t) => parseISO(t.date).getDate() === day
      );
      const income = dayTxs
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
      const expense = dayTxs
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + Math.abs(t.amount), 0);
      cumulative += income - expense;
      return { day, income, expense, cumulative };
    });

    const storedBudgets = JSON.parse(
      localStorage.getItem('finance-budgets') || '{}'
    );

    const categoryBudgetMap = CATEGORIES.filter(
      (c) => categorySpendMap[c]
    ).map((cat) => {
      const actual = categorySpendMap[cat] || 0;
      const budget = storedBudgets[cat] || actual * 1.2;
      const variance = budget - actual;
      return {
        category: cat,
        budget: Math.round(budget),
        actual: Math.round(actual),
        variance: Math.round(variance),
        status:
          variance < 0 ? 'over' : variance < budget * 0.1 ? 'on_track' : 'under',
      } as const;
    });

    const totalIncome = currentMonthTxs
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = totalCurrentExpense;
    const netSavings = totalIncome - totalExpense;
    const burnRate = daysInMonth > 0 ? Math.round(totalExpense / daysInMonth) : 0;
    const daysPassed = Math.min(new Date().getDate(), daysInMonth);
    const projectedBalance = totalIncome - (burnRate * daysInMonth);

    const keyObservations = [
      `Your weekend spending is ${((currentExpenses.filter(t => { const d = parseISO(t.date).getDay(); return d === 0 || d === 6; }).reduce((s, t) => s + Math.abs(t.amount), 0)) / Math.max(1, (currentExpenses.filter(t => { const d = parseISO(t.date).getDay(); return d > 0 && d < 6; }).reduce((s, t) => s + Math.abs(t.amount), 0))) * 2.5).toFixed(1)}x your weekday average. Consider reviewing Saturday outings.`,
      `${biggestExpense.category} accounts for ${biggestExpense.percentage}% of your total expenses. ${biggestExpense.percentage > 30 ? 'Consider setting a monthly cap.' : 'This is within healthy limits.'}`,
      `Your savings rate this month is ${totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0}%. ${netSavings > 0 ? 'You\'re on track!' : 'You\'re overspending this month.'}`,
      `You have ${currentExpenses.length} expense transactions this month with an average of ₹${Math.round(totalExpense / Math.max(1, currentExpenses.length)).toLocaleString('en-IN')} per transaction.`,
    ];

    const deepDive: DeepDiveInsight = {
      dailyFlow,
      categoryBudgetMap,
      keyObservations,
      projectedBalance,
      totalFlow: totalIncome + totalExpense,
      netSavings,
      burnRate,
    };

    return { biggestExpense, momChange, topCategory, deepDive };
  }, [transactions, selectedMonth]);
}
