import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, className, icon, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-label uppercase tracking-widest text-gray-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={clsx(
            'w-full bg-white dark:bg-slate-700 rounded-xl py-2.5 text-sm text-gray-900 dark:text-slate-100',
            'border border-gray-200 dark:border-slate-600 outline-none transition-all',
            'focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400',
            'placeholder:text-gray-400 dark:placeholder:text-slate-400',
            icon ? 'pl-10 pr-4' : 'px-4',
            error && 'border-rose-500 focus:ring-rose-500 dark:border-rose-500 dark:focus:ring-rose-500',
            className
          )}
        />
      </div>
      {error && (
        <p className="text-[11px] text-[#ff706f]">{error}</p>
      )}
    </div>
  );
}
