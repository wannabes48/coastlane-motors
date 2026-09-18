import { CheckCircle, Camera, MapPin, MessageCircle } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: CheckCircle, label: 'Duty paid' },
  { icon: Camera,      label: 'Every car photographed' },
  { icon: MapPin,      label: 'View in Mombasa' },
  { icon: MessageCircle, label: 'WhatsApp reply within 1 hr', highlight: true },
];

export function TrustBar() {
  return (
    <div className="w-full bg-white border-b border-[#DCE9F2]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* desktop: single row */}
        <ul className="hidden sm:flex items-center justify-center gap-6 flex-wrap">
          {TRUST_ITEMS.map(({ icon: Icon, label, highlight }, i) => (
            <li key={i} className="flex items-center gap-2">
              <Icon
                size={17}
                aria-hidden="true"
                className={highlight ? 'text-[#25D366]' : 'text-[#1479E0]'}
              />
              <span className="font-[Poppins] text-[13px] font-medium text-[#16293D]">
                {label}
              </span>
            </li>
          ))}
        </ul>

        {/* mobile: 2×2 grid */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:hidden">
          {TRUST_ITEMS.map(({ icon: Icon, label, highlight }, i) => (
            <li key={i} className="flex items-center gap-2">
              <Icon
                size={16}
                aria-hidden="true"
                className={highlight ? 'text-[#25D366]' : 'text-[#1479E0]'}
              />
              <span className="font-[Poppins] text-[12px] font-medium text-[#16293D] leading-tight">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
