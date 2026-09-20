export function VanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 44" fill="none" className={className}
         aria-hidden="true" width="72" height="40">
      <path d="M6 30 L6 16 L18 8 L58 8 L68 16 L68 30 Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M18 8 L12 16 L32 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="34" y="11" width="18" height="7" rx="1"
            stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="20" cy="31" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="56" cy="31" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="68" y1="28" x2="72" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
