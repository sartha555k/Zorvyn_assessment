import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  titleIcon?: ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, children, title, titleIcon, width = 'md:max-w-xl' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 md:p-4 md:items-center"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative w-screen md:w-full overflow-hidden',
          'rounded-t-2xl rounded-b-none md:rounded-2xl',
          'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700',
          'shadow-xl dark:shadow-slate-900/50',
          'animate-modal-in',
          width
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-3">
              {titleIcon && <span className="text-xl">{titleIcon}</span>}
              <h2 className="text-lg font-headline font-bold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
