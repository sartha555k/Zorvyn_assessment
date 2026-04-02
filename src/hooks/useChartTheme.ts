import { useThemeStore } from '../store/useThemeStore';

export function useChartTheme() {
  const { theme } = useThemeStore();

  return {
    textColor: theme === 'dark' ? '#94a3b8' : '#6b7280',       // slate-400 : gray-500
    gridColor: theme === 'dark' ? '#1e293b' : '#f3f4f6',       // slate-800 : gray-100
    tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e5e7eb',
    tooltipText: theme === 'dark' ? '#f1f5f9' : '#111827',
    axisColor: theme === 'dark' ? '#475569' : '#d1d5db',
    legendColor: theme === 'dark' ? '#cbd5e1' : '#374151',
  };
}
