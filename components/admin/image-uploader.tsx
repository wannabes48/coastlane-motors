'use client';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useState, useRef } from 'react';
import { CldImage } from 'next-cloudinary';
import { Camera, Image as ImageIcon } from 'lucide-react';

export function ImageUploader() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images'
  });
  
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    
    try {
      const sigRes = await fetch('/api/cloudinary/sign', { method: 'POST' });
      if (!sigRes.ok) throw new Error('Failed to get signature');
      const sigData = await sigRes.json();
      
      const files = Array.from(e.target.files);
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', sigData.api_key);
        formData.append('timestamp', sigData.timestamp);
        formData.append('signature', sigData.signature);
        formData.append('folder', sigData.folder);
        formData.append('upload_preset', sigData.upload_preset);
        
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await uploadRes.json();
        if (data.public_id) {
          append({
            public_id: data.public_id,
            width: data.width,
            height: data.height,
            alt: '',
            position: fields.length,
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex gap-4 flex-wrap mb-4">
        {fields.map((field: any, index) => (
          <div key={field.id} className="relative w-32 h-24 rounded border border-line overflow-hidden group">
            <CldImage src={field.public_id} alt="" fill sizes="128px" className="object-cover" />
            <button type="button" onClick={() => remove(index)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm">
              &times;
            </button>
            {index === 0 && <span className="absolute bottom-0 left-0 right-0 bg-ink/80 text-white text-[10px] text-center py-0.5">Thumbnail</span>}
          </div>
        ))}
        {fields.length === 0 && !uploading && (
          <div className="w-full h-24 border-2 border-dashed border-line rounded flex items-center justify-center text-slate text-sm">
            No photos yet
          </div>
        )}
      </div>
      
      <div className={`flex flex-col sm:flex-row gap-3 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleUpload}
          disabled={uploading}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleUpload}
          disabled={uploading}
        />
        
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2
                     h-16 border-2 border-dashed border-line
                     rounded-[var(--radius-card)] text-sm font-semibold text-slate
                     active:bg-sky transition-colors"
        >
          <Camera size={24} className="text-azure" aria-hidden="true" />
          {uploading ? 'Uploading...' : 'Take photo'}
        </button>

        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2
                     h-16 border-2 border-dashed border-line
                     rounded-[var(--radius-card)] text-sm font-semibold text-slate
                     active:bg-sky transition-colors"
        >
          <ImageIcon size={24} className="text-azure" aria-hidden="true" />
          {uploading ? 'Uploading...' : 'Gallery'}
        </button>
      </div>
    </div>
  );
}
