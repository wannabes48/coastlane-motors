import { CarForm } from '@/components/admin/car-form';
import { supabaseServer } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: vehicle } = await supabase.from('vehicles').select('*').eq('id', id).maybeSingle();
  
  if (!vehicle) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-slate hover:text-ink font-semibold">← Back</Link>
        <h1 className="font-sans font-bold text-2xl text-ink">Edit Vehicle</h1>
      </div>
      <CarForm initialData={vehicle} />
    </div>
  );
}
