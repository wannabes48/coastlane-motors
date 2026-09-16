import { Eye } from 'lucide-react';

type Props = { count: number | null; className?: string };

export function ViewCount({ count, className }: Props) {
  const safeCount = count ?? 0;
  return (
    <span className={`flex items-center gap-1.5 text-slate text-sm ${className ?? ''}`}>
      <Eye size={15} aria-hidden="true" />
      <span>{safeCount.toLocaleString()} {safeCount === 1 ? 'view' : 'views'}</span>
    </span>
  );
}
