export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);
}

export function formatCurrencyWithSign(amount: number): string {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}${formatCurrency(amount)}`;
}
