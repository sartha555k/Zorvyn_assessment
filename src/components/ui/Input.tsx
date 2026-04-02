import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-label uppercase tracking-widest text-gray-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          'w-full bg-white dark:bg-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-slate-100',
          'border border-gray-200 dark:border-slate-600 outline-none',
          'focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400',
          'placeholder:text-gray-400 dark:placeholder:text-slate-400 transition-all',
          error && 'border-rose-500 focus:ring-rose-500 dark:border-rose-500 dark:focus:ring-rose-500',
          className
        )}
      />
      {error && (
        <p className="text-[11px] text-[#ff706f]">{error}</p>
      )}
    </div>
  );
}
