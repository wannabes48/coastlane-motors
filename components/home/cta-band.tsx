import { MessageCircle, Phone } from 'lucide-react';
import { waLink } from '@/lib/whatsapp';

export function CTABand() {
  const wa = waLink();
  const phone = process.env.NEXT_PUBLIC_PHONE!;

  return (
    <section
      className="bg-[#16293D] py-14 px-4 text-center"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-lg mx-auto">
        <h2
          id="cta-heading"
          className="font-[Poppins] text-[20px] sm:text-[24px] font-bold text-white mb-3 leading-snug"
        >
          Not sure what fits your budget?
        </h2>
        <p className="font-[Poppins] text-[13px] text-[#7BA8CC] mb-8 leading-relaxed">
          Send us a WhatsApp — tell us your budget and what you need,
          and we'll find options for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2
                       h-12 px-6 bg-[#25D366] hover:bg-[#1ebe59]
                       rounded font-[Poppins] text-[14px] font-semibold
                       text-[#16293D] transition-colors duration-150"
          >
            <img src="/whatsapp-icon.png" alt="" className="w-4 h-4 object-contain" />
            WhatsApp us
          </a>
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center gap-2
                       h-12 px-6 border border-[#375a7a] hover:border-[#5a7a99]
                       rounded font-[Poppins] text-[14px] font-medium
                       text-white transition-colors duration-150"
          >
            <Phone size={18} aria-hidden="true" />
            Call us
          </a>
        </div>
      </div>
    </section>
  );
}
