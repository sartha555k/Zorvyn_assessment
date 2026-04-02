import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-label uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}
      <select
        {...props}
        className={clsx(
          'w-full bg-[#24252d] rounded-xl px-4 py-2.5 text-sm text-white',
          'border border-white/5 outline-none',
          'focus:ring-1 focus:ring-[#00fd87] focus:border-[#00fd87]',
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
