import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Star, AlertCircle, Search, Car } from 'lucide-react';
import { FeaturedToggle } from '@/components/admin/featured-toggle';
import { fmtKES } from '@/lib/money';

export const dynamic = 'force-dynamic';

export default async function FeaturedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // 1. Fetch current featured car
  const { data: featuredCar } = await supabaseAdmin
    .from('vehicles_with_admins')
    .select('id, slug, make, model, year, price_kes, images, views, created_by_name')
    .eq('featured', true)
    .maybeSingle();

  // 2. Fetch published cars to select from
  let query = supabaseAdmin
    .from('vehicles_with_admins')
    .select('id, slug, make, model, year, price_kes, featured')
    .eq('status', 'published');
  
  if (q) {
    query = query.ilike('search_text', `%${q.toLowerCase()}%`);
  }
  
  query = query.order('created_at', { ascending: false }).limit(20);

  const { data: candidates } = await query;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-[Poppins] text-[20px] font-bold text-[#0F1923]">
          Staff Pick
        </h1>
        <p className="font-[Poppins] text-[13px] text-[#64748B] mt-1">
          The staff pick appears prominently on the homepage. You can only have one featured car at a time.
        </p>
      </div>

      {/* Current Pick */}
      <section className="mb-10">
        <h2 className="font-[Poppins] text-[14px] font-bold text-[#0F1923] mb-3 flex items-center gap-2">
          <Star size={16} className="text-[#D4A843] fill-[#D4A843]" />
          Current Staff Pick
        </h2>
        
        {featuredCar ? (
          <div className="bg-white border border-[#D4A843] rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {featuredCar.images && featuredCar.images[0] ? (
              <img 
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_200/${featuredCar.images[0].public_id}`} 
                alt={`${featuredCar.make} ${featuredCar.model}`}
                className="w-full sm:w-48 h-32 object-cover rounded-lg shrink-0"
              />
            ) : (
              <div className="w-full sm:w-48 h-32 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center">
                <Car size={32} className="text-slate-300" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <Link href={`/admin/cars/${featuredCar.id}/edit`} className="inline-block hover:underline">
                <h3 className="font-[Poppins] text-[18px] font-bold text-[#0F1923]">
                  {featuredCar.year} {featuredCar.make} {featuredCar.model}
                </h3>
              </Link>
              <p className="font-[Poppins] text-[14px] font-semibold text-[#1565C0] mt-1">
                {fmtKES(featuredCar.price_kes)}
              </p>
              <p className="font-[Poppins] text-[12px] text-[#64748B] mt-2">
                Posted by {featuredCar.created_by_name || 'Admin'}
              </p>
            </div>
            
            <div className="shrink-0 mt-4 sm:mt-0">
              <FeaturedToggle 
                vehicleId={featuredCar.id} 
                featured={true} 
                label={`${featuredCar.year} ${featuredCar.make} ${featuredCar.model}`} 
              />
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle size={32} className="text-[#94A3B8] mb-3" />
            <p className="font-[Poppins] text-[14px] font-semibold text-[#0F1923]">No car is currently featured</p>
            <p className="font-[Poppins] text-[12px] text-[#64748B] mt-1">Select a car below to feature it on the homepage.</p>
          </div>
        )}
      </section>

      {/* Select New Pick */}
      <section>
        <h2 className="font-[Poppins] text-[14px] font-bold text-[#0F1923] mb-3">
          Select a new Staff Pick
        </h2>
        
        <form method="GET" className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input 
              type="search" 
              name="q" 
              defaultValue={q}
              placeholder="Search published cars..."
              className="w-full h-10 pl-9 pr-3 text-[13px] font-[Poppins] border border-[#E2E8F0] rounded-lg bg-white text-[#0F1923] focus:outline-none focus:border-[#1565C0]" 
            />
          </div>
          <button type="submit" className="h-10 px-4 bg-[#1565C0] text-white font-[Poppins] text-[12px] font-semibold rounded-lg hover:bg-[#0D47A1]">
            Search
          </button>
          {q && (
            <Link href="/admin/featured" className="h-10 px-4 border border-[#E2E8F0] text-[#64748B] font-[Poppins] text-[12px] rounded-lg flex items-center hover:border-[#1565C0]">
              Clear
            </Link>
          )}
        </form>

        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <ul className="divide-y divide-[#E2E8F0]">
            {candidates?.map((car) => {
              const label = `${car.year} ${car.make} ${car.model}`;
              if (car.featured) return null; // Already showing in the top section
              
              return (
                <li key={car.id} className="flex items-center justify-between p-3 hover:bg-[#FAFAFA]">
                  <div className="min-w-0">
                    <p className="font-[Poppins] text-[13px] font-semibold text-[#0F1923] truncate">
                      {label}
                    </p>
                    <p className="font-[Poppins] text-[11px] text-[#64748B]">
                      {fmtKES(car.price_kes)}
                    </p>
                  </div>
                  <FeaturedToggle vehicleId={car.id} featured={false} label={label} />
                </li>
              );
            })}
            
            {candidates?.length === 0 && (
              <li className="p-6 text-center font-[Poppins] text-[13px] text-[#64748B]">
                No published cars found.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
