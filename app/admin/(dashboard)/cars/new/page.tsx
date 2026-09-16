import { CarForm } from '@/components/admin/car-form';
import Link from 'next/link';

export default function NewCarPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-slate hover:text-ink font-semibold">← Back</Link>
        <h1 className="font-sans font-bold text-2xl text-ink">Add New Vehicle</h1>
      </div>
      <CarForm />
    </div>
  );
}
