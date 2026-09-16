type LogoProps = { variant?: 'light' | 'dark'; className?: string };

export function Logo({ variant = 'light', className }: LogoProps) {
  const wordmark = variant === 'light' ? '#16293D' : '#FFFFFF';
  const sub = variant === 'light' ? '#1479E0' : '#7BA8CC';
  const wave = variant === 'light' ? '#16293D' : '#FFFFFF';

  return (
    <a href="/" className={`flex items-center gap-3 ${className ?? ''}`} aria-label="Coastlane Motors home">
      <svg width="44" height="30" viewBox="0 0 44 30" fill="none" aria-hidden="true">
        {/* road bar */}
        <rect x="2" y="20" width="40" height="5" rx="2.5" fill="#1479E0"/>
        {/* coast wave */}
        <path d="M4 18 Q12 7 22 15 Q32 23 40 13"
              stroke={wave} strokeWidth="3" strokeLinecap="round"/>
        {/* speed chevron */}
        <path d="M28 21.5 L34 24 L28 26.5"
              stroke="#1479E0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="flex flex-col leading-none">
        <span style={{ color: wordmark }}
              className="font-sans font-bold text-lg tracking-tight">COASTLANE</span>
        <span style={{ color: sub }}
              className="font-sans text-[9px] font-normal tracking-[3.5px]">MOTORS</span>
      </span>
    </a>
  );
}
