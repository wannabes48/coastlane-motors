// components/home/hero-section.tsx
// Server component — fetches real listing thumbnails for the slider.
// Passes pre-fetched data to the client HeroSlider.

import { getHeroSlides }  from '@/lib/queries-hero';
import { HeroSlider }     from '@/components/home/hero-slider';
import { HeroSearch }     from '@/components/hero-search';

export async function HeroSection() {
  // fetch up to 4 published vehicles with photos
  const slides = await getHeroSlides(4);

  return (
    <>
      <HeroSlider slides={slides} />
      <HeroSearch />
    </>
  );
}
