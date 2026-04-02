import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-label uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          'w-full bg-[#24252d] rounded-xl px-4 py-2.5 text-sm text-white',
          'border border-white/5 outline-none',
          'focus:ring-1 focus:ring-[#00fd87] focus:border-[#00fd87]',
          'placeholder:text-slate-600 transition-all',
          error && 'border-[#ff706f] focus:ring-[#ff706f]',
          className
        )}
      />
      {error && (
        <p className="text-[11px] text-[#ff706f]">{error}</p>
      )}
    </div>
  );
}
