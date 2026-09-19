import { CheckCircle, Camera, MapPin } from 'lucide-react';

type TrustItem = {
  icon?: React.ElementType;
  useWhatsApp?: boolean;
  label: string;
  highlight?: boolean;
};

const TRUST_ITEMS: TrustItem[] = [
  { icon: CheckCircle, label: 'Duty paid' },
  { icon: Camera,      label: 'Every car photographed' },
  { icon: MapPin,      label: 'View in Mombasa' },
  { useWhatsApp: true, label: 'WhatsApp reply within 1 hr', highlight: true },
];

export function TrustBar() {
  return (
    <div className="w-full bg-ink-80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        {/* desktop: single row */}
        <ul className="hidden sm:flex items-center justify-center gap-6 flex-wrap">
          {TRUST_ITEMS.map(({ icon: Icon, useWhatsApp, label }, i) => (
            <li key={i} className="flex items-center gap-2">
              {useWhatsApp ? (
                <img src="/whatsapp-icon.png" alt="" className="w-[15px] h-[15px] object-contain" />
              ) : Icon ? (
                <Icon size={15} aria-hidden="true" className="text-azure" />
              ) : null}
              <span className="font-sans text-[13px] font-medium text-white/70 whitespace-nowrap">
                {label}
              </span>
              {i < TRUST_ITEMS.length - 1 && (
                <div className="w-[0.5px] h-4 bg-white/10 ml-4" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>

        {/* mobile: 2×2 grid */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:hidden">
          {TRUST_ITEMS.map(({ icon: Icon, useWhatsApp, label }, i) => (
            <li key={i} className="flex items-center gap-2">
              {useWhatsApp ? (
                <img src="/whatsapp-icon.png" alt="" className="w-[15px] h-[15px] object-contain" />
              ) : Icon ? (
                <Icon size={15} aria-hidden="true" className="text-azure" />
              ) : null}
              <span className="font-sans text-[12px] font-medium text-white/70 leading-tight">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
