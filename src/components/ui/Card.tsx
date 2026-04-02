import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowing?: boolean;
}

export function Card({ children, className, onClick, glowing }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-[#181920]/70 backdrop-blur-xl',
        glowing && 'hover:shadow-[0_0_25px_rgba(0,253,135,0.15)]',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      style={{
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {children}
    </div>
  );
}
