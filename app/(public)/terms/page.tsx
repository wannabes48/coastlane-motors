import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Coastlane Motors. Disclaimers regarding vehicle pricing, reservations, and policies.',
};

export default function TermsOfService() {
  return (
    <div className="bg-white min-h-[calc(100vh-72px)] py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 prose prose-slate">
        <h1 className="font-sans font-bold text-step-2 text-ink mb-8">Terms of Service</h1>
        
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Vehicle Pricing and Availability</h2>
        <p>All prices listed on the Coastlane Motors website are in Kenyan Shillings (KES) unless otherwise stated. While we strive for accuracy, prices and vehicle availability are subject to change without notice. All vehicles are sold subject to prior sale.</p>

        <h2>2. Duties and Taxes</h2>
        <p>Unless explicitly marked as "Duty Paid," vehicle prices may not include import duties, registration fees, or other governmental taxes. Please confirm the final on-the-road price with our sales team.</p>

        <h2>3. Reservation Deposits</h2>
        <p>A vehicle can be reserved with a non-refundable deposit. The deposit amount and the duration for which the vehicle will be held will be agreed upon in writing between the buyer and Coastlane Motors.</p>

        <h2>4. Condition of Used Vehicles</h2>
        <p>All used vehicles are sold "as-is," without any express or implied warranties, unless a specific warranty is provided in writing at the time of sale. We encourage all buyers to inspect the vehicle or hire an independent mechanic prior to purchase.</p>

        <h2>5. Return Policy</h2>
        <p>Due to the nature of motor vehicle sales and Kenyan registration laws, all sales are final. Coastlane Motors does not offer returns or exchanges once the vehicle logbook transfer has been initiated or the vehicle has left our premises.</p>

        <h2>6. Limitation of Liability</h2>
        <p>Coastlane Motors shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our website or from the purchase of any vehicle.</p>
        
        <h2>7. Contact Information</h2>
        <p>For any questions regarding these Terms, please contact our sales office directly.</p>
      </div>
    </div>
  );
}
