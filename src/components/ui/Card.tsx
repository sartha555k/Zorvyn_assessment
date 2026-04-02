import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  glowing?: boolean;
}

export function Card({ children, className, onClick, glowing, style, ...props }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-white dark:bg-slate-800',
        'border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50',
        glowing && 'hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(0,253,135,0.15)]',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
