import { useMemo } from 'react';
import { useThemeStore } from '../store/useThemeStore';

const LIGHT_TOOLTIP_SHADOW =
  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
const DARK_TOOLTIP_SHADOW = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';

export function useChartTheme() {
  const { theme } = useThemeStore();

  const tooltipContentStyle = useMemo(
    () =>
      theme === 'dark'
        ? {
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            color: '#f1f5f9',
            fontSize: '12px',
            fontFamily: 'DM Mono, monospace',
            boxShadow: DARK_TOOLTIP_SHADOW,
          }
        : {
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            color: '#111827',
            fontSize: '12px',
            fontFamily: 'DM Mono, monospace',
            boxShadow: LIGHT_TOOLTIP_SHADOW,
          },
    [theme]
  );

  const tooltipContentStyleCompact = useMemo(
    () =>
      theme === 'dark'
        ? {
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '11px',
            fontFamily: 'DM Mono, monospace',
            color: '#f1f5f9',
            boxShadow: DARK_TOOLTIP_SHADOW,
          }
        : {
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '11px',
            fontFamily: 'DM Mono, monospace',
            color: '#111827',
            boxShadow: LIGHT_TOOLTIP_SHADOW,
          },
    [theme]
  );

  return {
    textColor: theme === 'dark' ? '#94a3b8' : '#4b5563',
    gridColor: theme === 'dark' ? '#1e293b' : '#f3f4f6',
    tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e5e7eb',
    tooltipText: theme === 'dark' ? '#f1f5f9' : '#111827',
    tooltipShadow: theme === 'dark' ? DARK_TOOLTIP_SHADOW : LIGHT_TOOLTIP_SHADOW,
    axisColor: theme === 'dark' ? '#475569' : '#e5e7eb',
    legendColor: theme === 'dark' ? '#cbd5e1' : '#374151',
    tooltipContentStyle,
    tooltipContentStyleCompact,
  };
}
