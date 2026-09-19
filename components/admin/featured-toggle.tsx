'use client';

import { useTransition } from 'react';
import { Star } from 'lucide-react';
import { setFeatured } from '@/app/admin/(dashboard)/actions';

type Props = {
  vehicleId: string;
  featured: boolean;
  label?: string;   // e.g. "2019 Toyota Harrier" for screen reader context
};

export function FeaturedToggle({ vehicleId, featured, label }: Props) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => {
      setFeatured(vehicleId, !featured);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={featured}
      aria-label={
        featured
          ? `Remove ${label ?? 'this car'} from staff pick`
          : `Set ${label ?? 'this car'} as staff pick`
      }
      title={featured ? 'Remove staff pick' : 'Set as staff pick'}
      className={`flex items-center gap-1 h-[26px] px-2.5 rounded-full text-[10px] font-sans
                  font-semibold transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-wait
                  ${
                    featured
                      ? 'bg-azure text-white'
                      : 'bg-white border border-line text-slate hover:border-azure hover:text-azure'
                  }`}
    >
      <Star
        size={11}
        aria-hidden="true"
        className={featured ? 'fill-white' : ''}
      />
      {featured ? 'Staff pick' : 'Set as pick'}
    </button>
  );
}
