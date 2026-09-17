'use client';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export function Gallery({ images, carMeta }: { images: any[], carMeta?: { year: number, make: string, model: string } }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-[4/3] bg-sky flex items-center justify-center text-slate">No photos</div>;
  }

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden bg-sky">
        <CldImage
          src={images[currentIndex].public_id}
          alt={carMeta ? `${carMeta.year} ${carMeta.make} ${carMeta.model} interior dashboard view - Coastlane Motors` : (images[currentIndex].alt || `Vehicle image ${currentIndex + 1}`)}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority={currentIndex === 0}
          fetchPriority={currentIndex === 0 ? "high" : "auto"}
        />
        
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 bg-white/80 hover:bg-white rounded-full text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure" aria-label="Previous image">
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 bg-white/80 hover:bg-white rounded-full text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure" aria-label="Next image">
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((img, i) => (
            <button 
              key={img.public_id} 
              onClick={() => setCurrentIndex(i)}
              className={clsx(
                "relative h-20 w-28 shrink-0 rounded-[var(--radius-card)] overflow-hidden snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-azure",
                currentIndex === i ? "ring-2 ring-azure opacity-100" : "opacity-60 hover:opacity-100"
              )}
            >
              <CldImage
                src={img.public_id}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
