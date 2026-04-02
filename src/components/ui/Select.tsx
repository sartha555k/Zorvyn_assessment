import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-label uppercase tracking-widest text-gray-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <select
        {...props}
        className={clsx(
          'w-full bg-white dark:bg-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-slate-100',
          'border border-gray-200 dark:border-slate-600 outline-none',
          'focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400',
          'appearance-none cursor-pointer transition-all',
          className
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
