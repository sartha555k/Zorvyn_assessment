import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap',
        className
      )}
      style={{
        backgroundColor: color ? `${color}20` : 'rgba(255,255,255,0.1)',
        color: color || '#abaab2',
        border: `1px solid ${color ? `${color}40` : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      {children}
    </span>
  );
}
