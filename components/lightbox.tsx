'use client';

import {
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { CldImage } from '@/components/cld-image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export type LightboxImage = {
  public_id: string;
  width: number;
  height: number;
  alt?: string;
};

type Props = {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
};

export function Lightbox({ images, initialIndex, onClose }: Props) {
  const [index, setIndex]   = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // ── keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  // ── lock body scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = original; };
  }, []);

  // ── swipe ─────────────────────────────────────────────────────────────────
  const touchStart = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 50) return;  // ignore short taps
    delta < 0 ? next() : prev();
  }

  const current = images[index];

  // render into a portal so it always sits above everything
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── top bar ── */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        {/* counter */}
        <span className="font-[Poppins] text-[13px] text-white/60 select-none">
          {index + 1} / {images.length}
        </span>

        <div className="flex items-center gap-2">
          {/* zoom toggle */}
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            className="flex items-center justify-center w-10 h-10
                       rounded-lg bg-white/10 hover:bg-white/20
                       text-white transition-colors"
          >
            {zoomed
              ? <ZoomOut size={18} aria-hidden="true" />
              : <ZoomIn  size={18} aria-hidden="true" />}
          </button>

          {/* close */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="flex items-center justify-center w-10 h-10
                       rounded-lg bg-white/10 hover:bg-white/20
                       text-white transition-colors"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── image area ── */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-14">

        {/* prev arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 z-10
                       flex items-center justify-center w-10 h-10
                       rounded-full bg-white/10 hover:bg-white/25
                       text-white transition-colors"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
        )}

        {/* image */}
        <div
          className={`relative max-h-full max-w-full transition-transform duration-200
                      ${zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
          style={{ width: '100%', height: '100%' }}
          onClick={() => setZoomed((z) => !z)}
        >
          <CldImage
            key={current.public_id}   // remount on slide change → no crossfade ghost
            src={current.public_id}
            alt={current.alt || `Vehicle photo ${index + 1}`}
            fill
            format="auto"
            quality="auto"
            sizes="100vw"
            className="object-contain select-none"
            priority
          />
        </div>

        {/* next arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 z-10
                       flex items-center justify-center w-10 h-10
                       rounded-full bg-white/10 hover:bg-white/25
                       text-white transition-colors"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── thumbnail strip ── */}
      {images.length > 1 && (
        <div className="shrink-0 flex gap-2 overflow-x-auto px-4 py-3
                        scrollbar-none" /* hide scrollbar — use -webkit-scrollbar in globals */>
          {images.map((img, i) => (
            <button
              key={img.public_id}
              type="button"
              onClick={() => { setZoomed(false); setIndex(i); }}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`relative shrink-0 w-14 h-14 rounded overflow-hidden
                          border-2 transition-colors
                          ${i === index
                            ? 'border-[#1479E0]'
                            : 'border-transparent opacity-50 hover:opacity-80'
                          }`}
            >
              <CldImage
                src={img.public_id}
                alt=""
                fill
                crop="fill"
                gravity="auto"
                format="auto"
                quality="auto"
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── alt text caption ── */}
      {current.alt && (
        <p className="shrink-0 text-center font-[Poppins] text-[12px]
                      text-white/50 px-4 pb-3 truncate">
          {current.alt}
        </p>
      )}
    </div>,
    document.body,
  );
}
