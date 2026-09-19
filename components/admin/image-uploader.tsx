'use client';

import {
  useState,
  useRef,
  useCallback,
  DragEvent,
  ChangeEvent,
} from 'react';
import { CldImage } from '@/components/cld-image'; // using the local wrapper to avoid Server Component leaks just in case
import {
  Camera,
  ImageIcon,
  GripVertical,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export type VehicleImage = {
  public_id: string;
  width: number;
  height: number;
  alt: string;
  position: number;
};

type Props = {
  vehicleId: string;
  images: VehicleImage[];
  onChange: (images: VehicleImage[]) => void;
};

type UploadState = 'idle' | 'uploading' | 'error';

// ─── helpers ─────────────────────────────────────────────────────────────────

function reindex(arr: VehicleImage[]): VehicleImage[] {
  return arr.map((img, i) => ({ ...img, position: i }));
}

async function uploadOne(
  file: File,
  vehicleId: string,
): Promise<VehicleImage> {
  // 1. get a signed request from our route
  const sigRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder: `coastlane/vehicles/${vehicleId}` }),
  });
  if (!sigRes.ok) throw new Error('Could not get upload signature.');
  const sig = await sigRes.json();

  // 2. upload directly to Cloudinary
  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', sig.api_key);
  fd.append('timestamp', String(sig.timestamp));
  fd.append('signature', sig.signature);
  fd.append('folder', sig.folder);
  fd.append('upload_preset', sig.upload_preset);

  const upRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
    { method: 'POST', body: fd },
  );
  if (!upRes.ok) throw new Error('Upload to Cloudinary failed.');
  const c = await upRes.json();

  return {
    public_id: c.public_id,
    width: c.width,
    height: c.height,
    alt: '',
    position: 0, // caller reindexes
  };
}

const MAX_FILES = 15;
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// ─── component ───────────────────────────────────────────────────────────────

export function ImageUploader({ vehicleId, images, onChange }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0); // 0-100

  // drag-to-reorder state
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  // ── file validation ───────────────────────────────────────────────────────

  function validateFiles(files: File[]): string | null {
    if (images.length + files.length > MAX_FILES)
      return `Max ${MAX_FILES} photos per listing (you have ${images.length}, adding ${files.length}).`;
    for (const f of files) {
      if (!ACCEPT.includes(f.type))
        return `${f.name} is not a supported image type (JPEG, PNG, WebP, AVIF).`;
      if (f.size > MAX_BYTES)
        return `${f.name} is larger than 10 MB.`;
    }
    return null;
  }

  // ── upload handler ────────────────────────────────────────────────────────

  const handleFiles = useCallback(
    async (files: File[]) => {
      const err = validateFiles(files);
      if (err) {
        setErrorMsg(err);
        setUploadState('error');
        return;
      }

      setUploadState('uploading');
      setErrorMsg('');
      setProgress(0);

      const results: VehicleImage[] = [];
      let done = 0;

      // 3 at a time — manageable on 4G
      for (let i = 0; i < files.length; i += 3) {
        const batch = files.slice(i, i + 3);
        const uploaded = await Promise.allSettled(
          batch.map((f) => uploadOne(f, vehicleId)),
        );

        for (const r of uploaded) {
          if (r.status === 'fulfilled') {
            results.push(r.value);
          } else {
            setErrorMsg(`One upload failed: ${r.reason?.message ?? 'unknown error'}`);
          }
        }

        done += batch.length;
        setProgress(Math.round((done / files.length) * 100));
      }

      // merge and reindex
      const next = reindex([...images, ...results]);
      onChange(next);
      setUploadState(results.length ? 'idle' : 'error');
    },
    [images, vehicleId, onChange],
  );

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ''; // allow re-selecting the same file
    if (files.length) handleFiles(files);
  }

  // ── drop zone ─────────────────────────────────────────────────────────────

  const [dropActive, setDropActive] = useState(false);

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDropActive(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ACCEPT.includes(f.type),
    );
    if (files.length) handleFiles(files);
  }

  // ── drag-to-reorder ───────────────────────────────────────────────────────

  function onDragStart(e: DragEvent<HTMLLIElement>, index: number) {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragEnter(index: number) {
    dragOverIndex.current = index;
  }

  function onDragEnd() {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    dragIndex.current = null;
    dragOverIndex.current = null;

    if (from === null || to === null || from === to) return;

    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(reindex(next));
  }

  // ── delete ────────────────────────────────────────────────────────────────

  function deleteImage(index: number) {
    const next = reindex(images.filter((_, i) => i !== index));
    onChange(next);
  }

  // ── alt text ──────────────────────────────────────────────────────────────

  function setAlt(index: number, alt: string) {
    const next = images.map((img, i) => (i === index ? { ...img, alt } : img));
    onChange(next);
  }

  // ── refs for the two hidden inputs ────────────────────────────────────────

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_FILES - images.length;

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">

      {/* ── upload triggers ── */}
      {remaining > 0 && (
        <>
          {/* hidden inputs */}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"   // camera only
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            onChange={onInputChange}
          />
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            // no capture attr → gallery + files sheet
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            onChange={onInputChange}
          />

          {/* drop zone — desktop */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Drop photos here or click to browse"
            onDragOver={(e) => { e.preventDefault(); setDropActive(true); }}
            onDragLeave={() => setDropActive(false)}
            onDrop={onDrop}
            onClick={() => galleryRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && galleryRef.current?.click()}
            className={`hidden sm:flex flex-col items-center justify-center gap-2
                        border-2 border-dashed rounded-lg h-36 cursor-pointer
                        transition-colors duration-150 select-none
                        ${dropActive
                          ? 'border-[#1479E0] bg-[#E8F4FD]'
                          : 'border-[#DCE9F2] hover:border-[#B5D4F4] hover:bg-[#FBFBF9]'
                        }`}
          >
            <ImageIcon size={24} aria-hidden="true" className="text-[#1479E0]" />
            <p className="font-[Poppins] text-[13px] font-medium text-[#6B7D8F]">
              Drop photos here or{' '}
              <span className="text-[#1479E0] underline">browse</span>
            </p>
            <p className="font-[Poppins] text-[11px] text-[#6B7D8F]">
              JPEG · PNG · WebP · max 10 MB · up to {MAX_FILES} photos
            </p>
          </div>

          {/* mobile: two explicit buttons */}
          <div className="flex gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2
                         h-14 border-2 border-dashed border-[#DCE9F2]
                         rounded-lg font-[Poppins] text-[13px] font-semibold
                         text-[#6B7D8F] active:bg-[#E8F4FD]"
            >
              <Camera size={20} aria-hidden="true" className="text-[#1479E0]" />
              Take photo
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="flex flex-1 items-center justify-center gap-2
                         h-14 border-2 border-dashed border-[#DCE9F2]
                         rounded-lg font-[Poppins] text-[13px] font-semibold
                         text-[#6B7D8F] active:bg-[#E8F4FD]"
            >
              <ImageIcon size={20} aria-hidden="true" className="text-[#1479E0]" />
              Choose from gallery
            </button>
          </div>
        </>
      )}

      {/* ── progress bar ── */}
      {uploadState === 'uploading' && (
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <Loader2 size={16} aria-hidden="true"
                   className="text-[#1479E0] animate-spin shrink-0" />
          <div className="flex-1 bg-[#DCE9F2] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#1479E0] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-[Poppins] text-[12px] text-[#6B7D8F] shrink-0">
            {progress}%
          </span>
        </div>
      )}

      {/* ── error message ── */}
      {uploadState === 'error' && errorMsg && (
        <div className="flex items-start gap-2 bg-[#FFF0F0] border border-[#FFCDD2]
                        rounded-lg px-4 py-3" role="alert">
          <AlertCircle size={16} aria-hidden="true"
                       className="text-[#D32F2F] mt-0.5 shrink-0" />
          <p className="font-[Poppins] text-[12px] text-[#D32F2F]">{errorMsg}</p>
        </div>
      )}

      {/* ── image grid (draggable) ── */}
      {images.length > 0 && (
        <div>
          <p className="font-[Poppins] text-[11px] text-[#6B7D8F] mb-2">
            {images.length} photo{images.length !== 1 ? 's' : ''} ·{' '}
            <span className="text-[#1479E0]">first image is the cover</span>
            {' '}· drag to reorder
          </p>

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <li
                key={img.public_id}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragEnter={() => onDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={onDragEnd}
                className="group relative flex flex-col gap-1.5 cursor-grab active:cursor-grabbing"
                aria-label={`Photo ${index + 1}${index === 0 ? ' (cover)' : ''}`}
              >
                {/* thumbnail */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden
                                bg-[#E8F4FD] border border-[#DCE9F2]
                                group-hover:border-[#B5D4F4] transition-colors">
                  <CldImage
                    src={img.public_id}
                    alt={img.alt || `Vehicle photo ${index + 1}`}
                    fill
                    crop="fill"
                    gravity="auto"
                    format="auto"
                    quality="auto"
                    className="object-cover"
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                  />

                  {/* cover badge */}
                  {index === 0 && (
                    <div className="absolute top-1.5 left-1.5 bg-[#1479E0] text-white
                                    font-[Poppins] text-[9px] font-semibold
                                    px-1.5 py-0.5 rounded">
                      Cover
                    </div>
                  )}

                  {/* overlay controls — always visible on mobile, hover on desktop */}
                  <div className="absolute inset-0 flex items-start justify-between p-1.5
                                  sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {/* drag handle */}
                    <div className="flex items-center justify-center w-7 h-7
                                    bg-black/50 rounded text-white cursor-grab">
                      <GripVertical size={14} aria-hidden="true" />
                    </div>

                    {/* delete button */}
                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      aria-label={`Delete photo ${index + 1}`}
                      className="flex items-center justify-center w-7 h-7
                                 bg-black/50 hover:bg-red-600 rounded
                                 text-white transition-colors"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* alt text input */}
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => setAlt(index, e.target.value)}
                  placeholder="Alt text (optional)"
                  maxLength={160}
                  className="w-full h-8 px-2 text-[11px] font-[Poppins]
                             border border-[#DCE9F2] rounded
                             text-[#16293D] placeholder-[#B5C4CC]
                             focus:outline-none focus:border-[#1479E0]"
                  aria-label={`Alt text for photo ${index + 1}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── empty state ── */}
      {images.length === 0 && uploadState !== 'uploading' && (
        <p className="font-[Poppins] text-[12px] text-[#6B7D8F] text-center py-2">
          No photos yet. Add at least one before publishing.
        </p>
      )}

      {/* ── cap notice ── */}
      {remaining === 0 && (
        <p className="font-[Poppins] text-[12px] text-[#6B7D8F]">
          Maximum {MAX_FILES} photos reached.
        </p>
      )}
    </div>
  );
}
