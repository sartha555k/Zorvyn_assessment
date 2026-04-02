import { useState } from 'react';
import { Plus, Download, Search, Filter, ArrowUpDown, Edit2, Trash2, X, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { useTransactionStore } from '../store/useTransactionStore';
import { useAuthStore } from '../store/useAuthStore';
import { useFilterStore } from '../store/useFilterStore';
import { usePreferenceStore } from '../store/usePreferenceStore';
import { useFilters } from '../hooks/useFilters';
import { formatCurrency } from '../utils/formatCurrency';
import { exportCSV, exportJSON } from '../utils/exportData';
import { CATEGORY_COLORS, CATEGORIES, Category, Transaction, PaymentMethod } from '../types';
import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

export function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, bulkDelete } = useTransactionStore();
  const { role, addToast } = useAuthStore();
  const {
    searchQuery, setSearch, selectedCategories, setCategories,
    selectedType, setType, dateRange, setDateRange,
    sortField, setSort, resetFilters,
  } = useFilterStore();
  const { filteredTransactions, totalIncome, totalExpenses, netAmount } = useFilters(transactions);
  const { compactMode } = usePreferenceStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showCatFilter, setShowCatFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 15;
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTxs = filteredTransactions.slice((currentPage - 1) * perPage, currentPage * perPage);
  const isAdmin = role === 'admin';
  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedType !== 'all' || dateRange.from || dateRange.to;

  // Form state
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
      description: tx.description,
      date: format(parseISO(tx.date), 'yyyy-MM-dd'),
      amount: Math.abs(tx.amount).toString(),
      type: tx.type,
      category: tx.category,
      merchant: tx.merchant,
      paymentMethod: tx.paymentMethod,
      note: tx.note || '',
      tags: tx.tags.join(', '),
    });
    setFormErrors({});
    setDrawerOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.description) errors.description = 'Required';
    if (!formData.date) errors.date = 'Required';
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) errors.amount = 'Must be positive number';
    if (!formData.merchant) errors.merchant = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const amount = formData.type === 'expense' ? -Number(formData.amount) : Number(formData.amount);
    const txData = {
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      amount,
      type: formData.type,
      category: formData.category,
      merchant: formData.merchant,
      paymentMethod: formData.paymentMethod,
      note: formData.note || undefined,
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

  const handleBulkDelete = () => {
    bulkDelete(selectedIds);
    setSelectedIds([]);
    addToast('success', `${selectedIds.length} transactions deleted`);
  };

  const toggleCategory = (cat: Category) => {
    const newCats = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    setCategories(newCats);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedTxs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedTxs.map(t => t.id));
    }
  };

  return (
    <section className="p-2 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg md:text-xl font-headline font-bold text-gray-900 dark:text-white">Transactions</h1>
          <span className="px-3 py-0.5 bg-gray-100 dark:bg-[#24252d] text-emerald-600 dark:text-[#00fd87] font-mono text-xs rounded-full border border-gray-200 dark:border-[#00fd87]/20">
            {filteredTransactions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Export */}
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setShowExportMenu(!showExportMenu)}>
              <Download size={14} /> Export
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-md dark:shadow-2xl z-50 min-w-[160px]">
                <button className="w-full px-4 py-2.5 text-xs text-left hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white" onClick={() => { exportCSV(filteredTransactions, 'transactions'); addToast('success', 'CSV exported'); setShowExportMenu(false); }}>
                  Export CSV
                </button>
                <button className="w-full px-4 py-2.5 text-xs text-left hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white" onClick={() => { exportJSON(filteredTransactions, 'transactions'); addToast('success', 'JSON exported'); setShowExportMenu(false); }}>
                  Export JSON
                </button>
              </div>
            )}
          </div>
          {isAdmin && (
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
        {/* Search */}
        <div className="relative w-full lg:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#121319]/40 border border-gray-200 dark:border-white/5 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-emerald-400 placeholder:text-gray-500 dark:placeholder:text-slate-600 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCatFilter(!showCatFilter)}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-white/5 rounded-xl text-xs font-bold text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Filter size={12} /> Categories
              {selectedCategories.length > 0 && (
                <span className="bg-indigo-100 dark:bg-[#00fd87]/20 text-indigo-700 dark:text-[#00fd87] text-[10px] px-1.5 rounded-full">{selectedCategories.length}</span>
              )}
            </button>
            {showCatFilter && (
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-md dark:shadow-2xl z-50 max-h-64 overflow-y-auto w-52">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-xs text-gray-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => { toggleCategory(cat); setCurrentPage(1); }}
                      className="rounded bg-white dark:bg-[#24252d] border-gray-300 dark:border-white/20 text-indigo-600 dark:text-[#00fd87] focus:ring-indigo-500 dark:focus:ring-[#00fd87]"
                    />
                    <span className="w-2 h-2 rounded" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                    {cat}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex bg-white dark:bg-[#1e1f26] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden">
            {(['all', 'income', 'expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => { setType(type); setCurrentPage(1); }}
                className={clsx(
                  'px-3 py-2 text-xs font-bold capitalize transition-all',
                  selectedType === type
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-[#00fd87]/15 dark:text-[#00fd87]'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => { setDateRange({ ...dateRange, from: e.target.value }); setCurrentPage(1); }}
            className="px-3 py-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-white/5 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#00fd87]"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => { setDateRange({ ...dateRange, to: e.target.value }); setCurrentPage(1); }}
            className="px-3 py-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-white/5 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#00fd87]"
          />

          {hasActiveFilters && (
            <button onClick={() => { resetFilters(); setCurrentPage(1); }} className="text-xs text-rose-500 dark:text-[#ff706f] hover:underline">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 dark:text-slate-400 px-1">
        <span>{filteredTransactions.length} of {transactions.length} transactions</span>
        <span className="h-3 w-px bg-gray-200 dark:bg-white/10" />
        <span>Income: <span className="text-emerald-600 dark:text-[#00fd87]">{formatCurrency(totalIncome)}</span></span>
        <span>Expenses: <span className="text-rose-600 dark:text-[#ff706f]">{formatCurrency(totalExpenses)}</span></span>
        <span>Net: <span className={netAmount >= 0 ? 'text-emerald-600 dark:text-[#00fd87]' : 'text-rose-600 dark:text-[#ff706f]'}>{formatCurrency(netAmount)}</span></span>
      </div>

      {/* Bulk Actions */}
      {isAdmin && selectedIds.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-3 bg-rose-50 dark:bg-[#ff706f]/10 border border-rose-200 dark:border-[#ff706f]/30 rounded-xl">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedIds.length} selected</span>
          <Button variant="danger" size="sm" onClick={handleBulkDelete}>
            <Trash2 size={14} /> Delete Selected
          </Button>
        </div>
      )}

      {/* Table */}
      {paginatedTxs.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  {isAdmin && (
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedTxs.length && paginatedTxs.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded bg-white dark:bg-[#24252d] border-gray-300 dark:border-white/20 text-indigo-600 dark:text-[#00fd87] focus:ring-indigo-500 dark:focus:ring-[#00fd87]"
                      />
                    </th>
                  )}
                  <th onClick={() => setSort('date')} className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-gray-500 dark:text-slate-500 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                    <span className="flex items-center gap-1">Date <ArrowUpDown size={10} /></span>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-gray-500 dark:text-slate-500">Description</th>
                  <th className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-gray-500 dark:text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-gray-500 dark:text-slate-500 hidden md:table-cell">Payment</th>
                  <th onClick={() => setSort('amount')} className="px-4 py-3 text-right text-[10px] font-label uppercase tracking-widest text-gray-500 dark:text-slate-500 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                    <span className="flex items-center justify-end gap-1">Amount <ArrowUpDown size={10} /></span>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-label uppercase tracking-widest text-gray-500 dark:text-slate-500">Type</th>
                  {isAdmin && <th className="px-4 py-3 text-right text-[10px] font-label uppercase tracking-widest text-gray-500 dark:text-slate-500">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedTxs.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 dark:border-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    {isAdmin && (
                      <td className={clsx("px-4", compactMode ? "py-1.5" : "py-3")}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(tx.id)}
                          onChange={() => toggleSelect(tx.id)}
                          className="rounded bg-white dark:bg-[#24252d] border-gray-300 dark:border-white/20 text-indigo-600 dark:text-[#00fd87] focus:ring-indigo-500 dark:focus:ring-[#00fd87]"
                        />
                      </td>
                    )}
                    <td className={clsx("px-4 text-xs font-mono text-gray-500 dark:text-slate-400 whitespace-nowrap", compactMode ? "py-1.5" : "py-3")}>
                      {format(parseISO(tx.date), 'dd MMM yy')}
                    </td>
                    <td className={clsx("px-4", compactMode ? "py-1.5" : "py-3")}>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{tx.merchant}</p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-500 truncate max-w-[200px]">{tx.description}</p>
                    </td>
                    <td className={clsx("px-4", compactMode ? "py-1.5" : "py-3")}>
                      <Badge color={CATEGORY_COLORS[tx.category]}>{tx.category}</Badge>
                    </td>
                    <td className={clsx("px-4 hidden md:table-cell", compactMode ? "py-1.5" : "py-3")}>
                      <span className="text-xs text-gray-500 dark:text-slate-400 capitalize">{tx.paymentMethod.replace('_', ' ')}</span>
                    </td>
                    <td className={clsx("px-4 text-right", compactMode ? "py-1.5" : "py-3")}>
                      <span className={clsx('font-mono font-medium', tx.type === 'income' ? 'text-emerald-600 dark:text-[#00fd87]' : 'text-rose-600 dark:text-[#ff706f]')}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className={clsx("px-4", compactMode ? "py-1.5" : "py-3")}>
                      <span className={clsx(
                        'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border',
                        tx.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-[#00fd87]/10 dark:text-[#00fd87] dark:border-transparent' : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-[#ff706f]/10 dark:text-[#ff706f] dark:border-transparent'
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className={clsx("px-4 text-right", compactMode ? "py-1.5" : "py-3")}>
                        {deleteConfirmId === tx.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleDelete(tx.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-[#ff706f]/10 dark:text-[#ff706f] dark:hover:bg-[#ff706f]/20">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(tx)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 dark:hover:bg-white/5 dark:text-slate-400 dark:hover:text-white transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(tx.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-600 hover:text-rose-500 dark:hover:bg-[#ff706f]/10 dark:text-slate-400 dark:hover:text-[#ff706f] transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/5">
              <span className="text-xs text-gray-500 dark:text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-bold text-gray-500 dark:text-slate-400 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-bold text-gray-500 dark:text-slate-400 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <EmptyState onAction={resetFilters} />
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end md:items-start">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-screen max-w-none bg-white dark:bg-[#121319] border-t border-gray-200 dark:border-white/10 rounded-t-2xl md:rounded-none md:w-full md:max-w-md md:border-l md:border-t-0 h-[90vh] md:h-full overflow-y-auto animate-modal-in md:animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-lg font-headline font-bold text-gray-900 dark:text-white">
                {editingTx ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 dark:hover:bg-white/5 dark:text-slate-400 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} error={formErrors.description} />
              <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} error={formErrors.date} />
              <Input label="Amount (₹)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} error={formErrors.amount} min="0" />

              <div className="space-y-1.5">
                <label className="text-xs font-label uppercase tracking-widest text-gray-500 dark:text-slate-400">Type</label>
                <div className="flex bg-gray-100 dark:bg-[#24252d] rounded-xl overflow-hidden">
                  {(['income', 'expense'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      className={clsx(
                        'flex-1 py-2.5 text-sm font-bold capitalize transition-all',
                        formData.type === type
                          ? type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-[#00fd87]/15 dark:text-[#00fd87]' : 'bg-rose-100 text-rose-700 dark:bg-[#ff706f]/15 dark:text-[#ff706f]'
                          : 'text-gray-500 dark:text-slate-400'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
              />
              <Input label="Merchant" value={formData.merchant} onChange={(e) => setFormData({ ...formData, merchant: e.target.value })} error={formErrors.merchant} />
              <Select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                options={[
                  { value: 'upi', label: 'UPI' },
                  { value: 'card', label: 'Card' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'cash', label: 'Cash' },
                ]}
              />
              <Input label="Note" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
              <Input label="Tags (comma-separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />

              <div className="pt-4">
                <Button className="w-full" onClick={handleSubmit}>
                  {editingTx ? 'Update Transaction' : 'Add Transaction'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
