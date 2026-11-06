// app/(public)/privacy-policy/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Vorback Motors collects, uses, and protects your personal data.',
};

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-slate font-medium">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-[var(--radius-card)] shadow-sm border border-line p-6 md:p-12">
          <div className="prose-custom">
            
            <p>
              At Vorback Motors, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website, reserve a vehicle, or communicate with our sales team. We comply with the Data Protection Act of Kenya.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us, as well as automatic data collected when you navigate our digital platforms:
            </p>
            <ul>
              <li><strong>WhatsApp & Contact Information:</strong> When you use our "WhatsApp Us" or "View or Reserve" buttons, you voluntarily share your phone number and profile name with our business account.</li>
              <li><strong>M-Pesa Transaction Data:</strong> When you place a refundable vehicle reservation deposit, we receive transaction confirmation details (such as your phone number, transaction ID, and name) via the Safaricom Daraja API. <strong>We do not access or store your M-Pesa PIN.</strong></li>
              <li><strong>Import Inquiries:</strong> If you request a custom Japan import, we collect your name, email, phone number, and budget requirements to facilitate the bidding process.</li>
            </ul>

            <h2>2. Website Cookies & Analytics</h2>
            <p>
              We use cookies and similar tracking technologies to ensure our website functions quickly and reliably on your device:
            </p>
            <ul>
              <li><strong>Functional Cookies:</strong> Used to remember your vehicle search filters (like Make, Model, and Budget) as you navigate between pages.</li>
              <li><strong>Performance Analytics:</strong> We use aggregated, anonymized data to understand website traffic, measure the speed of our image loading, and track which vehicle models are currently trending in Kenya.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the data we collect exclusively to provide and improve our dealership services. Specifically, we use it to:
            </p>
            <ul>
              <li>Respond directly to your vehicle inquiries via WhatsApp or phone call.</li>
              <li>Verify reservation deposits and assign the correct vehicle to your profile.</li>
              <li>Facilitate asset financing applications (only when you explicitly request us to share your details with our banking partners).</li>
            </ul>
            <p>
              <strong>We do not sell, rent, or trade your personal information or phone numbers to third-party marketing agencies.</strong>
            </p>

            <h2>4. Data Retention and Security</h2>
            <p>
              Your data is stored securely using modern encryption standards. We retain transaction and communication records only for as long as necessary to fulfill legal, accounting, and customer service obligations.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              Under Kenyan law, you have the right to request access to the personal data we hold about you, request corrections to inaccurate data, or ask us to delete your information (subject to legal obligations like retaining sales receipts).
            </p>

            <h2>6. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or how we handle your data, please contact our administrative team:
              <br /><br />
              <strong>Email:</strong> sales@vorbackmotors.co.ke
              <br />
              <strong>Phone:</strong> +254 702 751 085
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
