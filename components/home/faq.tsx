import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Are all cars duty paid?',
    a: 'Yes — every vehicle in our stock has cleared Kenya Customs. The price you see is the price you pay, with no import levies added after purchase.',
  },
  {
    q: 'Can I view a car before buying?',
    a: 'Absolutely. WhatsApp or call us and we will arrange a viewing at our Mombasa yard at a time that suits you. No appointment deposit required.',
  },
  {
    q: 'Do you deliver outside Mombasa?',
    a: 'Yes, we deliver across Kenya and to Uganda, Tanzania and Rwanda. Contact us for a delivery quote to your location.',
  },
  {
    q: 'Are your prices negotiable?',
    a: 'Most of our vehicles are listed as negotiable. Send us a WhatsApp message with your offer and we will get back to you promptly.',
  },
  {
    q: 'What documents do I receive when I buy a car?',
    a: 'You receive the logbook, a fully signed transfer form, and a sale agreement. We assist with the KRA logbook transfer process at no extra charge.',
  },
  {
    q: 'Can I trade in my current car?',
    a: 'Yes — bring your car in for a free valuation and we can offset its value against your purchase. Contact us to arrange a trade-in assessment.',
  },
];

export function FAQ() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <section className="bg-white py-14 px-4" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl mx-auto">
        <p className="font-sans text-[11px] font-semibold tracking-[3px] uppercase text-azure mb-2">
          Common questions
        </p>
        <h2
          id="faq-heading"
          className="font-sans text-[22px] font-bold text-ink mb-8 leading-tight"
        >
          Frequently asked questions
        </h2>

        <div className="flex flex-col divide-y divide-line">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="py-4 group">
              <summary className="font-sans text-[14px] font-semibold text-ink cursor-pointer list-none flex items-center justify-between gap-4 select-none">
                {q}
                <ChevronDown
                  size={16}
                  className="text-azure shrink-0 group-open:rotate-180 transition-transform duration-200"
                  aria-hidden="true"
                />
              </summary>
              <p className="font-sans text-[13px] text-slate leading-relaxed mt-3 pr-6">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
