import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Plus, Trash2, Edit2, RotateCcw, Download, Upload, Shield, X, Check, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useTransactionStore } from '../store/useTransactionStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../utils/formatCurrency';
import { exportCSV, exportJSON } from '../utils/exportData';
import { CATEGORY_COLORS, CATEGORIES, Category, Transaction, PaymentMethod } from '../types';
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, bulkDelete, importTransactions, resetToDemo } = useTransactionStore();
  const { role, addToast } = useAuthStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState('');

  // Redirect viewers
  useEffect(() => {
    if (role === 'viewer') {
      addToast('warning', 'You need Admin access to view this page');
      navigate('/');
    }
  }, [role, navigate, addToast]);

  if (role === 'viewer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-[#ff706f]/10 border border-[#ff706f]/20">
          <Lock size={32} className="text-[#ff706f]" />
        </div>
        <h2 className="text-2xl font-headline font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">You need Admin access to view this page</p>
        <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
      </div>
    );
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  const uniqueCategories = new Set(transactions.map(t => t.category)).size;

  // Monthly chart data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(2025, 5, 1), 5 - i);
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    const monthTxs = transactions.filter(t => {
      const dt = parseISO(t.date);
      return dt >= start && dt <= end;
    });
    return {
      month: format(d, 'MMM'),
      income: monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0),
    };
  });

  // Category data for pie chart
  const categorySpend: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categorySpend[t.category] = (categorySpend[t.category] || 0) + Math.abs(t.amount);
  });
  const pieData = Object.entries(categorySpend)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }));

  // Form
  const [formData, setFormData] = useState({
    description: '', date: '', amount: '', type: 'expense' as 'income' | 'expense',
    category: 'Other' as Category, merchant: '', paymentMethod: 'upi' as PaymentMethod,
    note: '', tags: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openAdd = () => {
    setEditingTx(null);
    setFormData({ description: '', date: format(new Date(), 'yyyy-MM-dd'), amount: '', type: 'expense', category: 'Other', merchant: '', paymentMethod: 'upi', note: '', tags: '' });
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setFormData({
      description: tx.description, date: format(parseISO(tx.date), 'yyyy-MM-dd'),
      amount: Math.abs(tx.amount).toString(), type: tx.type, category: tx.category,
      merchant: tx.merchant, paymentMethod: tx.paymentMethod,
      note: tx.note || '', tags: tx.tags.join(', '),
    });
    setFormErrors({});
    setDrawerOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.description) errors.description = 'Required';
    if (!formData.date) errors.date = 'Required';
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) errors.amount = 'Must be positive';
    if (!formData.merchant) errors.merchant = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const amount = formData.type === 'expense' ? -Number(formData.amount) : Number(formData.amount);
    const txData = {
      description: formData.description, date: new Date(formData.date).toISOString(),
      amount, type: formData.type, category: formData.category, merchant: formData.merchant,
      paymentMethod: formData.paymentMethod, note: formData.note || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
    };
    if (editingTx) {
      updateTransaction(editingTx.id, txData);
      addToast('success', 'Transaction updated');
    } else {
      addTransaction({ ...txData, id: uuidv4() });
      addToast('success', 'Transaction added');
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
    addToast('success', 'Transaction deleted');
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importJson);
      if (!Array.isArray(data)) throw new Error('Must be an array');
      const validTxs = data.map((item: any) => ({
        id: item.id || uuidv4(),
        date: item.date || new Date().toISOString(),
        description: item.description || '',
        amount: Number(item.amount) || 0,
        category: item.category || 'Other',
        type: item.type || (Number(item.amount) >= 0 ? 'income' : 'expense'),
        merchant: item.merchant || '',
        paymentMethod: item.paymentMethod || 'upi',
        tags: item.tags || [],
        note: item.note,
      }));
      importTransactions(validTxs);
      addToast('success', `${validTxs.length} transactions imported`);
      setImportModalOpen(false);
      setImportJson('');
    } catch {
      addToast('error', 'Invalid JSON format');
    }
  };

  const handleReset = () => {
    resetToDemo();
    addToast('success', 'Data reset to demo state');
  };

  const sortedTxs = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="p-2 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-headline font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Manage transactions and system data</p>
          </div>
          <Badge color="#5bb1ff">
            <Shield size={10} className="inline mr-1" />ADMIN
          </Badge>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => setImportModalOpen(true)}>
            <Upload size={14} /> Import
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { exportJSON(transactions, 'all-transactions'); addToast('success', 'JSON exported'); }}>
            <Download size={14} /> JSON
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { exportCSV(transactions, 'all-transactions'); addToast('success', 'CSV exported'); }}>
            <Download size={14} /> CSV
          </Button>
          <Button variant="danger" size="sm" onClick={handleReset}>
            <RotateCcw size={14} /> Reset Demo
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus size={14} /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: transactions.length.toString(), color: '#5bb1ff' },
          { label: 'Total Income', value: formatCurrency(totalIncome), color: '#00fd87' },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), color: '#ff706f' },
          { label: 'Active Categories', value: uniqueCategories.toString(), color: '#a855f7' },
        ].map(stat => (
          <Card key={stat.label} glowing className="p-5">
            <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
            <p className="text-2xl font-mono font-medium" style={{ color: stat.color }}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-headline font-bold text-white mb-4">Monthly Summary</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  stroke="#75757c"
                  fontSize={11}
                  fontFamily="DM Mono"
                  interval="preserveStartEnd"
                  minTickGap={18}
                />
                <YAxis stroke="#75757c" fontSize={10} fontFamily="DM Mono" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#1a1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} formatter={(value: any) => formatCurrency(Number(value || 0))} />
                <Bar dataKey="income" fill="#00fd87" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ff706f" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-headline font-bold text-white mb-4">Category Distribution</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value">
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as Category] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} formatter={(value: any) => formatCurrency(Number(value || 0))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-[#ff706f]/10 border border-[#ff706f]/30 rounded-xl">
          <span className="text-sm font-bold text-white">{selectedIds.length} selected</span>
          <Button variant="danger" size="sm" onClick={() => { bulkDelete(selectedIds); setSelectedIds([]); addToast('success', `${selectedIds.length} deleted`); }}>
            <Trash2 size={14} /> Delete Selected
          </Button>
        </div>
      )}

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-headline font-bold text-white">All Transactions</h2>
          <span className="text-xs font-mono text-slate-400">{transactions.length} total</span>
        </div>
        <div className="w-full overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#181920] z-10">
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={() => {
                      if (selectedIds.length === sortedTxs.length) setSelectedIds([]);
                      else setSelectedIds(sortedTxs.map(t => t.id));
                    }}
                    checked={selectedIds.length === sortedTxs.length && sortedTxs.length > 0}
                    className="rounded bg-[#24252d] border-white/20 text-[#00fd87] focus:ring-[#00fd87]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-slate-500">Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-slate-500">Description</th>
                <th className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-4 py-3 text-right text-[10px] font-label uppercase tracking-widest text-slate-500">Amount</th>
                <th className="px-4 py-3 text-right text-[10px] font-label uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTxs.map(tx => (
                <tr key={tx.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(tx.id)}
                      onChange={() => setSelectedIds(prev => prev.includes(tx.id) ? prev.filter(i => i !== tx.id) : [...prev, tx.id])}
                      className="rounded bg-[#24252d] border-white/20 text-[#00fd87] focus:ring-[#00fd87]"
                    />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">{format(parseISO(tx.date), 'dd MMM yy')}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-white">{tx.merchant}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{tx.description}</p>
                  </td>
                  <td className="px-4 py-3"><Badge color={CATEGORY_COLORS[tx.category]}>{tx.category}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <span className={clsx('font-mono font-medium', tx.type === 'income' ? 'text-[#00fd87]' : 'text-[#ff706f]')}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {deleteConfirmId === tx.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(tx.id)} className="p-1.5 rounded-lg bg-[#ff706f]/10 text-[#ff706f]"><Check size={14} /></button>
                        <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 rounded-lg bg-white/5 text-slate-400"><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(tx)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><Edit2 size={14} /></button>
                        <button onClick={() => setDeleteConfirmId(tx.id)} className="p-1.5 rounded-lg hover:bg-[#ff706f]/10 text-slate-400 hover:text-[#ff706f]"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Import Modal */}
      <Modal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} title="Import Transactions" titleIcon={<Download size={18} />}>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400">Paste a JSON array of transactions below. Each object should have: description, date, amount, category, type, merchant, paymentMethod.</p>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='[{"description": "Test", "amount": -500, ...}]'
            className="w-full h-48 bg-[#24252d] rounded-xl p-4 text-sm text-white border border-white/5 focus:ring-1 focus:ring-[#00fd87] font-mono resize-none"
          />
          <Button onClick={handleImport} className="w-full">Import Transactions</Button>
        </div>
      </Modal>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end md:items-start">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-screen max-w-none bg-[#121319] border-t border-white/10 rounded-t-2xl md:rounded-none md:w-full md:max-w-md md:border-l md:border-t-0 h-[90vh] md:h-full overflow-y-auto animate-modal-in md:animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-headline font-bold text-white">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} error={formErrors.description} />
              <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} error={formErrors.date} />
              <Input label="Amount (₹)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} error={formErrors.amount} min="0" />
              <div className="space-y-1.5">
                <label className="text-xs font-label uppercase tracking-widest text-slate-400">Type</label>
                <div className="flex bg-[#24252d] rounded-xl overflow-hidden">
                  {(['income', 'expense'] as const).map(type => (
                    <button key={type} onClick={() => setFormData({ ...formData, type })}
                      className={clsx('flex-1 py-2.5 text-sm font-bold capitalize transition-all',
                        formData.type === type ? type === 'income' ? 'bg-[#00fd87]/15 text-[#00fd87]' : 'bg-[#ff706f]/15 text-[#ff706f]' : 'text-slate-400'
                      )}>{type}</button>
                  ))}
                </div>
              </div>
              <Select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} options={CATEGORIES.map(c => ({ value: c, label: c }))} />
              <Input label="Merchant" value={formData.merchant} onChange={(e) => setFormData({ ...formData, merchant: e.target.value })} error={formErrors.merchant} />
              <Select label="Payment Method" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })} options={[{ value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'cash', label: 'Cash' }]} />
              <Input label="Note" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
              <Input label="Tags (comma-separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
              <div className="pt-4">
                <Button className="w-full" onClick={handleSubmit}>{editingTx ? 'Update Transaction' : 'Add Transaction'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
