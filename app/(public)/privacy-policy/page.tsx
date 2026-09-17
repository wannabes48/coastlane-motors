import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Coastlane Motors. How we handle your data, cookies, and communications.',
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-[calc(100vh-72px)] py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 prose prose-slate">
        <h1 className="font-sans font-bold text-step-2 text-ink mb-8">Privacy Policy</h1>
        
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>When you use the Coastlane Motors website, we may collect the following types of information:</p>
        <ul>
          <li><strong>Contact Information:</strong> Name, email address, and phone number when you submit an enquiry.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited (e.g., vehicle views) and device information.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for various purposes:</p>
        <ul>
          <li>To provide and maintain our Service.</li>
          <li>To respond to your inquiries regarding vehicle availability and pricing.</li>
          <li>To monitor the usage of our Service and improve user experience.</li>
        </ul>

        <h2>3. WhatsApp Communications</h2>
        <p>By clicking our WhatsApp links, you agree to communicate with us via WhatsApp. Standard messaging rates may apply. We do not share your phone number with third parties for marketing purposes.</p>

        <h2>4. Cookies and Local Storage</h2>
        <p>We use Cookies and Local Storage (e.g., to remember which vehicles you have viewed or to store your cookie consent preferences) to track the activity on our Service and hold certain information.</p>

        <h2>5. Analytics and Advertising</h2>
        <p>We may use third-party Service Providers to monitor and analyze the use of our Service, such as Google Analytics, and to serve advertisements (such as Google Ads or Meta Ads). These third parties have access to your Personal Data only to perform these tasks on our behalf.</p>

        <h2>6. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us via phone or email as provided on our contact page.</p>
      </div>
    </div>
  );
}
