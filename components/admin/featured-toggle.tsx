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
      className={`flex items-center gap-1.5 h-8 px-3 rounded text-[12px] font-[Poppins]
                  font-semibold border transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-wait
                  ${
                    featured
                      ? 'bg-[#1479E0] border-[#1479E0] text-white'
                      : 'bg-white border-[#DCE9F2] text-[#6B7D8F] hover:border-[#1479E0] hover:text-[#1479E0]'
                  }`}
    >
      <Star
        size={14}
        aria-hidden="true"
        className={featured ? 'fill-white' : ''}
      />
      {featured ? 'Staff pick' : 'Set as pick'}
    </button>
  );
}
