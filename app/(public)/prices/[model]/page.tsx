import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const make = model.split('-')[0];
  const modelName = model.split('-').slice(1).join(' ');
  const title = `${make.charAt(0).toUpperCase() + make.slice(1)} ${modelName.charAt(0).toUpperCase() + modelName.slice(1)} Price in Kenya`;
  
  return {
    title,
    description: `Check the current market prices for ${make} ${modelName} in Kenya. See our current stock of ${make} ${modelName}s for sale.`,
  };
}

export default async function PricingPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  
  const make = model.split('-')[0];
  const modelName = model.split('-').slice(1).join(' ');
  
  if (!make || !modelName) notFound();
  
  const formattedMake = make.charAt(0).toUpperCase() + make.slice(1);
  const formattedModel = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return (
    <div className="bg-sky min-h-[calc(100vh-72px)] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-sans font-bold text-step-2 text-ink uppercase tracking-tight mb-4">
          {formattedMake} {formattedModel} Price in Kenya
        </h1>
        <div className="bg-white p-8 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] text-step-0 text-slate space-y-6">
          <p>
            The <strong>{formattedMake} {formattedModel}</strong> is one of the most sought-after vehicles in the Kenyan market due to its reliability and strong resale value. Market prices typically range depending on the year of manufacture, mileage, and specific trim levels.
          </p>
          <div className="bg-sky p-6 rounded border border-line">
            <h2 className="font-sans font-semibold text-ink text-lg mb-2">Estimated Market Prices</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>2017 - 2018 Models: KES 2.5M - 3.2M</li>
              <li>2019 - 2020 Models: KES 3.5M - 4.5M</li>
              <li>2021+ Models: KES 5.0M+</li>
            </ul>
            <p className="text-sm mt-4 italic">Note: Prices vary based on condition and duty payment status.</p>
          </div>
          <p>
            When buying a {formattedMake} {formattedModel} in Kenya, ensure the logbook is ready and the mileage is verified. At Coastlane Motors, all our vehicles are duty paid and carefully inspected.
          </p>
          <div className="mt-8 pt-8 border-t border-line text-center">
            <Link href={`/used/${make.toLowerCase()}`} className="bg-azure text-white px-6 py-3 rounded-full font-semibold hover:bg-azure-ink transition-colors inline-block">
              View Our {formattedMake} Stock
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
