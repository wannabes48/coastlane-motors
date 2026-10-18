// app/(public)/terms/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Coastlane Motors services and website.',
};

export default function TermsOfService() {
  const lastUpdated = "October 18, 2026";

  return (
    <main className="min-h-screen bg-sky py-12 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="mb-10 md:mb-14">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate hover:text-azure transition-colors text-[13px] font-semibold mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-slate font-medium">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-[var(--radius-card)] shadow-sm border border-line p-6 md:p-12">
          <div className="prose-custom">
            
            <p>
              Welcome to Coastlane Motors. These Terms of Service govern your use of our website and services, including vehicle browsing, reservation deposits, and import requests.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Coastlane Motors website (the "Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </p>

            <h2>2. Vehicle Pricing and Availability</h2>
            <p>
              All prices are listed in Kenyan Shillings (KES) and include standard import duties where applicable. However, prices and availability are subject to change without notice. 
            </p>
            <ul>
              <li>Vehicles marked as "In Transit" are subject to estimated arrival dates.</li>
              <li>A reserved vehicle is only guaranteed once the KES 10,000 holding deposit is fully cleared via M-Pesa.</li>
              <li>Deposits for locally stocked vehicles are fully refundable if the vehicle fails physical inspection by the buyer.</li>
            </ul>

            <h2>3. Import on Order</h2>
            <p>
              For vehicles sourced directly from Japanese auctions, a separate binding import agreement will be signed. The initial website inquiry does not constitute a finalized purchase contract.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>
              Coastlane Motors shall not be held liable for indirect, incidental, or consequential damages resulting from the use of our digital platforms or reliance on estimated vehicle arrival times.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <strong>Email:</strong> sales@coastlanemotors.co.ke
              <br />
              <strong>Phone:</strong> +254 702 751 085
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
