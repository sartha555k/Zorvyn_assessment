import clsx from 'clsx';
import { useThemeStore } from '../../store/useThemeStore';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  const theme = useThemeStore((s) => s.theme);

  const style =
    theme === 'dark'
      ? {
          backgroundColor: color ? `${color}20` : 'rgba(255,255,255,0.1)',
          color: color || '#abaab2',
          border: `1px solid ${color ? `${color}40` : 'rgba(255,255,255,0.1)'}`,
        }
      : {
          backgroundColor: color ? `${color}22` : '#f3f4f6',
          color: color || '#4b5563',
          border: `1px solid ${color ? `${color}55` : '#e5e7eb'}`,
        };

  return (
    <span
      className={clsx(
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap',
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
