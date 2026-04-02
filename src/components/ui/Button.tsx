import clsx from 'clsx';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap',
        // Variants
        variant === 'primary' &&
          'bg-gradient-to-r from-[#a4ffb9] to-[#00fd87] text-[#006532] hover:scale-95 shadow-[0_0_20px_rgba(0,253,135,0.2)]',
        variant === 'secondary' &&
          'bg-transparent border border-[#a4ffb9]/20 text-[#a4ffb9] hover:bg-[#a4ffb9]/10',
        variant === 'ghost' &&
          'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white',
        variant === 'danger' &&
          'bg-[#ff706f]/10 border border-[#ff706f]/40 text-[#ff706f] hover:bg-[#ff706f]/20',
        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-8 py-3 text-base',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
    >
      {children}
    </button>
  );
}
