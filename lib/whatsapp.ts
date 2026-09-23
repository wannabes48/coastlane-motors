// lib/whatsapp.ts
// WhatsApp number resolution order:
//   1. vehicle.contact_whatsapp  (set to poster's number when they publish)
//   2. NEXT_PUBLIC_WHATSAPP      (global fallback — dealership main line)

type CarForWA = {
  year: number;
  make: string;
  model: string;
  slug: string;
  price_kes: number | null;
  contact_whatsapp?: string | null;
};

function resolveNumber(car?: CarForWA | null): string {
  return (
    car?.contact_whatsapp?.replace(/\D/g, '') ||
    process.env.NEXT_PUBLIC_WHATSAPP ||
    ''
  );
}

export function waLink(car?: CarForWA | null): string {
  const number = resolveNumber(car);
  const base = `https://wa.me/${number}`;

  if (!car) {
    return `${base}?text=${encodeURIComponent(
      "Hi Coastlane Motors, I'd like help finding a car.",
    )}`;
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/cars/${car.slug}`;
  const price = car.price_kes
    ? `KSh ${car.price_kes.toLocaleString()}`
    : 'the price on request';

  const text = `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} listed at ${price}.\n${url}`;
  return `${base}?text=${encodeURIComponent(text)}`;
}

// used by the server action to stamp contact_whatsapp on create/publish
export function resolveAdminWhatsapp(adminWhatsapp: string | null | undefined): string | null {
  return adminWhatsapp?.replace(/\D/g, '') || null;
}