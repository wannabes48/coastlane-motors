'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema } from '@/lib/schema';
import { saveVehicle } from '@/app/admin/(dashboard)/actions';
import { ImageUploader } from './image-uploader';
import { useState } from 'react';

export function CarForm({ initialData = null }: { initialData?: any }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const methods = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      condition: 'used', status: 'draft',
      make: '', model: '', year: new Date().getFullYear(), trim: '',
      price_kes: null, negotiable: true, mileage_km: null,
      transmission: 'Automatic', fuel: 'Petrol', engine_cc: null, drive: '2WD',
      body_type: 'SUV', exterior: '', interior: '', seats: 5,
      city: 'Mombasa', country: 'Kenya', duty_paid: true,
      description: '', features: [], images: [], featured: false
    }
  });

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit = async (data: any) => {
    setSaving(true);
    setError('');
    const res = await saveVehicle(initialData?.id || null, data);
    if (!res?.ok) {
      setError(res?.message || 'Failed to save vehicle');
      setSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
        {error && <div className="bg-red-50 text-red-600 p-4 rounded text-sm">{error}</div>}
        
        <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
          <h2 className="font-sans font-semibold text-lg mb-4">Photos</h2>
          <ImageUploader />
          {errors.images?.message && <p className="text-red-500 text-sm mt-1">{errors.images.message as string}</p>}
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="font-sans font-semibold text-lg md:col-span-2 border-b border-line pb-2">Basic Info</h2>
          
          <div><label className="block text-sm font-semibold mb-1">Make</label><input {...register('make')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          <div><label className="block text-sm font-semibold mb-1">Model</label><input {...register('model')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          <div><label className="block text-sm font-semibold mb-1">Year</label><input type="number" {...register('year')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          <div><label className="block text-sm font-semibold mb-1">Trim</label><input {...register('trim')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          
          <div>
             <label className="block text-sm font-semibold mb-1">Condition</label>
             <select {...register('condition')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none">
               <option value="used">Used</option>
               <option value="new">New</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select {...register('status')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          
          <div><label className="block text-sm font-semibold mb-1">Price (KES)</label><input type="number" {...register('price_kes')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          <div><label className="block text-sm font-semibold mb-1">Mileage (km)</label><input type="number" {...register('mileage_km')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="font-sans font-semibold text-lg md:col-span-2 border-b border-line pb-2">Specifications</h2>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Transmission</label>
            <select {...register('transmission')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none">
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Fuel</label>
            <select {...register('fuel')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Body Type</label>
            <select {...register('body_type')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none">
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Pickup">Pickup</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              <option value="Coupe">Coupe</option>
              <option value="Wagon">Station Wagon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Drive</label>
            <select {...register('drive')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none">
              <option value="2WD">2WD</option>
              <option value="4WD">4WD</option>
              <option value="AWD">AWD</option>
            </select>
          </div>
          
          <div><label className="block text-sm font-semibold mb-1">Engine (CC)</label><input type="number" {...register('engine_cc')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          <div><label className="block text-sm font-semibold mb-1">Exterior</label><input {...register('exterior')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          <div><label className="block text-sm font-semibold mb-1">Interior</label><input {...register('interior')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
          <div><label className="block text-sm font-semibold mb-1">City</label><input {...register('city')} className="w-full border border-line rounded-[var(--radius-card)] px-4 h-12 text-base focus:border-azure focus:outline-none" /></div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
          <h2 className="font-sans font-semibold text-lg mb-4 border-b border-line pb-2">Description</h2>
          <textarea {...register('description')} rows={5} className="w-full border border-line rounded-[var(--radius-card)] p-4 text-base focus:border-azure focus:outline-none" placeholder="Vehicle description..."></textarea>
          {errors.description?.message && <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>}
        </div>

        <div className="flex gap-4 sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-bar)] border border-line justify-end">
          <button type="submit" disabled={saving} className="bg-azure text-white h-12 font-semibold rounded-[var(--radius-card)] px-8 hover:bg-azure-ink disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
