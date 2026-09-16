export function waLink(car?: { year: number; make: string; model: string; slug: string; price_kes: number | null }) {
  const base = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`;
  if (!car) return `${base}?text=${encodeURIComponent("Hi Coastlane Motors, I'd like help finding a car.")}`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/cars/${car.slug}`;
  const text = `Hi Coastlane Motors, I'm interested in the ${car.year} ${car.make} ${car.model} listed at ${car.price_kes ? `KSh ${car.price_kes.toLocaleString()}` : 'the price on request'}.\n${url}`;
  return `${base}?text=${encodeURIComponent(text)}`;
}
