import { Search, MessageCircle, Car } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Browse and pick a car',
    body: 'Filter by budget, make, or body type. Every car has real photos and a clear KES price.',
    active: true,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp us about it',
    body: "Tap the WhatsApp button on any listing. We'll confirm availability and arrange a viewing.",
    active: false,
  },
  {
    icon: Car,
    title: 'View and drive away',
    body: 'Come to our Mombasa yard. No pressure, no hidden costs. Pay and drive the same day.',
    active: false,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-14 px-4" aria-labelledby="how-heading">
      <div className="max-w-2xl mx-auto">
        <p className="font-[Poppins] text-[11px] font-semibold tracking-[3px] uppercase text-[#1479E0] mb-2">
          Simple process
        </p>
        <h2
          id="how-heading"
          className="font-[Poppins] text-[22px] font-bold text-[#16293D] mb-8 leading-tight"
        >
          How to buy from us
        </h2>

        <ol className="relative flex flex-col gap-0">
          {/* connecting line — desktop only */}
          <div
            className="absolute left-5 top-5 bottom-5 w-px bg-[#DCE9F2]"
            aria-hidden="true"
          />

          {STEPS.map(({ icon: Icon, title, body, active }, i) => (
            <li key={i} className="relative flex items-start gap-4 pb-8 last:pb-0">
              {/* step icon */}
              <div
                className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full
                            flex items-center justify-center`}
                style={{
                  background: active ? '#1479E0' : '#E8F4FD',
                  border: active ? 'none' : '0.5px solid #B5D4F4',
                }}
              >
                <Icon
                  size={18}
                  aria-hidden="true"
                  className={active ? 'text-white' : 'text-[#1479E0]'}
                />
              </div>

              {/* text */}
              <div className="pt-1.5">
                <p className="font-[Poppins] text-[14px] font-semibold text-[#16293D] mb-1">
                  {title}
                </p>
                <p className="font-[Poppins] text-[13px] text-[#6B7D8F] leading-relaxed">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
