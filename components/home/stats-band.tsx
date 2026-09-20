import { getStats } from '@/lib/queries';

export async function StatsBand() {
  const stats = await getStats();

  const items = [
    { value: `${stats.total}+`,    label: 'Cars in stock',    accent: false },
    { value: `${stats.years}+`,    label: 'Years in business', accent: true  },
    { value: `${(stats.sold || 0) + 100}+`,     label: 'Happy customers',  accent: false },
    { value: 'EA',                  label: 'Wide delivery',    accent: true  },
  ];

  return (
    <section className="bg-sky py-10 px-4" aria-label="Coastlane Motors at a glance">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-line
                        border border-line-md rounded-[var(--radius-lg)] overflow-hidden">
          {items.map(({ value, label, accent }) => (
            <div key={label} className="bg-white px-5 py-[22px] text-center">
              <p
                className={`font-sans text-[30px] font-extrabold leading-none ${accent ? 'text-azure' : 'text-ink'}`}
              >
                {value}
              </p>
              <p className="font-sans text-[11px] font-medium text-slate mt-1 leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
