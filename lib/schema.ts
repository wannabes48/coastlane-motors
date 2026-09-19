import { z } from 'zod';

export const imageSchema = z.object({
  public_id: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().max(160).default(''),
  position: z.number().int().min(0),
});

export const vehicleSchema = z.object({
  condition: z.enum(['used', 'new']),
  status: z.enum(['draft', 'published', 'sold']),
  make: z.string().min(1), model: z.string().min(1),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 2),
  price_kes: z.coerce.number().int().positive().nullable(),
  negotiable: z.boolean().default(true),
  mileage_km: z.coerce.number().int().min(0).nullable(),
  transmission: z.enum(['Automatic', 'Manual', 'CVT']).nullable(),
  fuel: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']).nullable(),
  engine_cc: z.coerce.number().int().positive().nullable(),
  drive: z.enum(['2WD', '4WD', 'AWD']).nullable(),
  body_type: z.enum(['SUV','Sedan','Hatchback','Pickup','Van','Bus','Coupe','Wagon']).nullable(),
  exterior: z.string().optional(), interior: z.string().optional(),
  seats: z.coerce.number().int().min(1).max(60).nullable(),
  city: z.string().default('Mombasa'),
  country: z.string().default('Kenya'),
  duty_paid: z.boolean().default(true),
  description: z.string().min(40, 'Write at least a couple of sentences — this is what ranks.'),
  features: z.array(z.string()).default([]),
  images: z.array(imageSchema).min(1, 'Add at least one photo.'),
  featured: z.boolean().default(false),
}).refine(v => v.condition === 'new' || v.mileage_km !== null,
  { path: ['mileage_km'], message: 'Used cars need a mileage.' })
  .refine(v => v.status !== 'published' || v.price_kes !== null || true, {});
