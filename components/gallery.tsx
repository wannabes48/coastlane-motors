'use client';

import { useState } from 'react';
import { CldImage } from '@/components/cld-image';
import { Expand } from 'lucide-react';
import { Lightbox, type LightboxImage } from '@/components/lightbox';

type Props = {
  images: LightboxImage[];
  make: string;
  model: string;
  year: number;
};

export function Gallery({ images, make, model, year }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) return null;

  const [primary, ...thumbs] = images;

  function open(index: number) { setLightboxIndex(index); }
  function close()             { setLightboxIndex(null);  }

  return (
    <>
      {/* ── grid ── */}
      <div className="flex flex-col gap-2">

        {/* main / cover image */}
        <button
          type="button"
          onClick={() => open(0)}
          aria-label={`View ${year} ${make} ${model} — photo 1 in full screen`}
          className="group relative w-full aspect-[4/3] sm:aspect-[16/9]
                     rounded-xl overflow-hidden bg-[#E8F4FD] cursor-zoom-in"
        >
          <CldImage
            src={primary.public_id}
            alt={primary.alt || `${year} ${make} ${model} — ${make} for sale in Kenya`}
            fill
            crop="fill"
            gravity="auto"
            format="auto"
            quality="auto"
            priority
            sizes="(max-width:768px) 100vw, 60vw"
            className="object-cover transition-transform duration-300
                       group-hover:scale-[1.02]"
          />

          {/* expand hint */}
          <div className="absolute bottom-3 right-3
                          flex items-center gap-1.5
                          bg-black/50 rounded-lg px-2.5 py-1.5
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-200 pointer-events-none">
            <Expand size={14} aria-hidden="true" className="text-white" />
            <span className="font-[Poppins] text-[11px] text-white font-medium">
              View full screen
            </span>
          </div>

          {/* photo count badge — always visible */}
          <div className="absolute bottom-3 left-3
                          bg-black/50 rounded-lg px-2.5 py-1.5
                          font-[Poppins] text-[11px] text-white">
            1 / {images.length}
          </div>
        </button>

        {/* thumbnail row — up to 4 shown, last shows "+N more" */}
        {thumbs.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {thumbs.slice(0, 4).map((img, i) => {
              const actualIndex = i + 1;
              const isLast      = i === 3 && images.length > 5;
              const remaining   = images.length - 5;

              return (
                <button
                  key={img.public_id}
                  type="button"
                  onClick={() => open(actualIndex)}
                  aria-label={
                    isLast
                      ? `View all ${images.length} photos`
                      : `View photo ${actualIndex + 1} in full screen`
                  }
                  className="group relative aspect-[4/3] rounded-lg
                             overflow-hidden bg-[#E8F4FD] cursor-zoom-in"
                >
                  <CldImage
                    src={img.public_id}
                    alt={img.alt || `${year} ${make} ${model} photo ${actualIndex + 1}`}
                    fill
                    crop="fill"
                    gravity="auto"
                    format="auto"
                    quality="auto"
                    sizes="25vw"
                    className="object-cover transition-transform duration-300
                               group-hover:scale-[1.04]"
                  />

                  {/* "+N more" overlay on the last thumbnail */}
                  {isLast && (
                    <div className="absolute inset-0 bg-black/55 flex items-center
                                    justify-center">
                      <span className="font-[Poppins] text-[15px] font-bold text-white">
                        +{remaining + 1}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={close}
        />
      )}
    </>
  );
}
