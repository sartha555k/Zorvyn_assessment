import { Transaction } from '../types';
import { format } from 'date-fns';

export function exportCSV(transactions: Transaction[], filename: string): void {
  const headers = ['Date', 'Description', 'Merchant', 'Category', 'Type', 'Amount', 'Payment Method', 'Note'];
  const rows = transactions.map(t => [
    format(new Date(t.date), 'yyyy-MM-dd'),
    `"${t.description}"`,
    `"${t.merchant}"`,
    t.category,
    t.type,
    Math.abs(t.amount).toString(),
    t.paymentMethod,
    `"${t.note || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export function exportJSON(transactions: Transaction[], filename: string): void {
  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
