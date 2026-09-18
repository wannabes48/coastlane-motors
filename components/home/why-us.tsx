import { Tag, Camera, MessageCircle, ShieldCheck, FileText, ThumbsUp } from 'lucide-react';

const PILLARS = [
  {
    icon: Tag,
    title: 'Clear pricing',
    body: 'Every car priced openly in KES. What you see is what you pay — no clearance surprises.',
  },
  {
    icon: Camera,
    title: 'Real photos',
    body: 'Every photo is taken at our Mombasa yard, not recycled stock imagery from the manufacturer.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp first',
    body: 'Message us about any listing. We confirm availability and book a viewing within the hour.',
  },
  {
    icon: ShieldCheck,
    title: 'Duty paid stock',
    body: 'All vehicles have cleared customs. No hidden import levies after you buy.',
  },
  {
    icon: FileText,
    title: 'Clean paperwork',
    body: 'Logbook, inspection report, and transfer documents handled on the day.',
  },
  {
    icon: ThumbsUp,
    title: 'No pressure',
    body: "View the car, ask questions, take your time. We don't do pushy sales.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-[#E8F4FD] py-14 px-4" aria-labelledby="why-us-heading">
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <p className="font-[Poppins] text-[11px] font-semibold tracking-[3px] uppercase text-[#1479E0] mb-2">
          Why Coastlane Motors
        </p>
        <h2
          id="why-us-heading"
          className="font-[Poppins] text-[22px] sm:text-[26px] font-bold text-[#16293D] leading-tight mb-2"
        >
          The straightforward way<br className="hidden sm:block" /> to buy a car in Kenya
        </h2>
        <p className="font-[Poppins] text-[13px] text-[#6B7D8F] mb-10 max-w-lg">
          No runaround. Prices in shillings, photos taken at the yard, WhatsApp us to view today.
        </p>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white border border-[#DCE9F2] rounded-lg p-5
                         hover:border-[#B5D4F4] transition-colors duration-150"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E8F4FD] flex items-center justify-center mb-4">
                <Icon size={20} aria-hidden="true" className="text-[#1479E0]" />
              </div>
              <p className="font-[Poppins] text-[13px] font-semibold text-[#16293D] mb-1">
                {title}
              </p>
              <p className="font-[Poppins] text-[12px] text-[#6B7D8F] leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
