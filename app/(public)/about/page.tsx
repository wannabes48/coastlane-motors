import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Coastlane Motors, your trusted car dealership in Mombasa, Kenya.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-sans font-bold text-step-2 text-ink mb-8">About Coastlane Motors</h1>
      <div className="prose prose-slate text-step-0 max-w-none">
        <p className="text-xl text-ink font-medium mb-6">
          Coastlane Motors is a premium car dealership located in Mombasa, serving the entirety of Kenya and East Africa.
        </p>
        <p className="mb-4 text-slate leading-relaxed">
          We pride ourselves on transparency, quality, and straightforward pricing. Every car we sell has been thoroughly inspected and priced clearly in Kenya Shillings, with all duty fully paid.
        </p>
        <p className="text-slate leading-relaxed">
          Whether you are looking for a reliable daily driver or a luxury import, our dedicated team is here to assist you through every step of the process.
        </p>
      </div>
    </div>
  );
}
