import { SearchX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  title = 'No results found',
  message = "We couldn't find any entries matching your current filters.",
  onAction,
  actionLabel = 'Clear Filters',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#1e1f26] border border-gray-200 dark:border-white/5">
        <SearchX size={32} className="text-gray-400 dark:text-slate-500" />
      </div>
      <h2 className="text-xl font-headline font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-slate-500 mb-8 max-w-xs">
        {message}
      </p>
      {onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
