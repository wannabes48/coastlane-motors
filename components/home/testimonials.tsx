import { Star } from 'lucide-react';

type Testimonial = {
  initials: string;
  name: string;
  location: string;
  car: string;
  quote: string;
  accentDark?: boolean;
};

// Seed with real buyer WhatsApp messages once the client provides them.
// Replace TESTIMONIALS entries — keep the shape identical.
const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'JM',
    name: 'James M.',
    location: 'Nairobi',
    car: '2019 Toyota Harrier',
    quote:
      "WhatsApp'd in the morning, viewed at 2 pm, drove home by 5. Easiest car purchase I've made.",
    accentDark: false,
  },
  {
    initials: 'AW',
    name: 'Amina W.',
    location: 'Mombasa',
    car: '2020 Mazda CX-5',
    quote:
      'Price was exactly what was listed online. No extra charges at the yard. Very refreshing.',
    accentDark: true,
  },
  {
    initials: 'DK',
    name: 'David K.',
    location: 'Kisumu',
    car: '2018 Subaru Forester',
    quote:
      "Drove from Kisumu to view it. Worth every kilometer. The car was exactly as described.",
    accentDark: false,
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} aria-hidden="true" className="text-[#1479E0] fill-[#1479E0]" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-white py-14 px-4" aria-labelledby="testimonials-heading">
      <div className="max-w-4xl mx-auto">
        <p className="font-[Poppins] text-[11px] font-semibold tracking-[3px] uppercase text-[#1479E0] mb-2">
          What buyers say
        </p>
        <h2
          id="testimonials-heading"
          className="font-[Poppins] text-[22px] font-bold text-[#16293D] mb-8 leading-tight"
        >
          Real people, real deals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ initials, name, location, car, quote, accentDark }) => (
            <figure
              key={name}
              className="bg-[#E8F4FD] rounded-r-lg rounded-br-lg
                         border-l-[3px] border-[#1479E0] px-5 py-5 flex flex-col gap-4"
            >
              <blockquote>
                <p className="font-[Poppins] text-[13px] text-[#16293D] leading-relaxed">
                  "{quote}"
                </p>
              </blockquote>

              <figcaption className="flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-2">
                  {/* avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center
                               font-[Poppins] text-[11px] font-semibold text-white shrink-0"
                    style={{ background: accentDark ? '#16293D' : '#1479E0' }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-[Poppins] text-[12px] font-semibold text-[#16293D] leading-none">
                      {name}
                    </p>
                    <p className="font-[Poppins] text-[11px] text-[#6B7D8F] mt-0.5">
                      {location} · {car}
                    </p>
                  </div>
                </div>
                <Stars />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
