import { Metadata } from 'next';
import AboutUsSection from '@/components/ui/about-us-section';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Coastlane Motors, your trusted car dealership in Mombasa, Kenya.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutUsSection />
    </main>
  );
}
