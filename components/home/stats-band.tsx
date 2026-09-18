import { getStats } from '@/lib/queries';

export async function StatsBand() {
  const stats = await getStats();

  const items = [
    { value: `${stats.total}+`,    label: 'Cars in stock',    accent: false },
    { value: `${stats.years}+`,    label: 'Years in business', accent: true  },
    { value: `${stats.sold}+`,     label: 'Happy customers',  accent: false },
    { value: 'EA',                  label: 'Wide delivery',    accent: true  },
  ];

  return (
    <section className="bg-[#16293D] py-10 px-4" aria-label="Coastlane Motors at a glance">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#1E3A50]
                        border border-[#1E3A50] rounded-lg overflow-hidden">
          {items.map(({ value, label, accent }) => (
            <div key={label} className="bg-[#16293D] px-6 py-6 text-center">
              <p
                className="font-[Poppins] text-[32px] font-bold leading-none"
                style={{ color: accent ? '#1479E0' : '#FFFFFF' }}
              >
                {value}
              </p>
              <p className="font-[Poppins] text-[11px] text-[#7BA8CC] mt-2 leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
