import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  variant?: 'light' | 'dark';
  className?: string;
  priority?: boolean;
};

export function Logo({ variant = 'dark', className, priority = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 select-none group transition-opacity hover:opacity-90 active:scale-[0.98] ${
        variant === 'light' ? 'bg-[#0F1923] p-1.5 rounded-lg shadow-sm' : ''
      } ${className ?? ''}`}
      aria-label="Coastlane Motors home"
    >
      <div className="relative h-10 md:h-11 w-auto aspect-[458/206] flex items-center">
        <Image
          src="/logo-brand.png"
          alt="Coastlane Motors"
          width={458}
          height={206}
          priority={priority}
          className="h-10 md:h-11 w-auto object-contain shrink-0"
        />
      </div>
    </Link>
  );
}
