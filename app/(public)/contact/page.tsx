import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Coastlane Motors. WhatsApp us or visit our showroom in Mombasa.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-sans font-bold text-step-2 text-ink mb-8">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-sans font-semibold text-step-1 text-ink mb-4">Get in Touch</h2>
          <p className="text-slate mb-8">
            The fastest way to reach us is on WhatsApp. We typically reply within a few minutes during business hours.
          </p>
          
          <div className="space-y-6">
             <div>
               <h3 className="text-sm font-semibold text-slate uppercase tracking-wider mb-2">WhatsApp</h3>
               <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} className="text-azure hover:text-azure-ink font-medium text-lg transition-colors" target="_blank" rel="noopener noreferrer">
                 Chat with Sales
               </a>
             </div>
             <div>
               <h3 className="text-sm font-semibold text-slate uppercase tracking-wider mb-2">Phone</h3>
               <a href={`tel:${process.env.NEXT_PUBLIC_PHONE}`} className="text-ink hover:text-azure transition-colors text-lg">
                 {process.env.NEXT_PUBLIC_PHONE}
               </a>
             </div>
             <div>
               <h3 className="text-sm font-semibold text-slate uppercase tracking-wider mb-2">Email</h3>
               <a href={`mailto:${process.env.SALES_INBOX}`} className="text-ink hover:text-azure transition-colors text-lg">
                 {process.env.SALES_INBOX}
               </a>
             </div>
          </div>
        </div>

        <div>
          <h2 className="font-sans font-semibold text-step-1 text-ink mb-4">Visit Our Showroom</h2>
          <div className="bg-sky p-6 rounded-[var(--radius-card)]">
            <h3 className="font-sans font-bold text-ink mb-2">Coastlane Motors</h3>
            <p className="text-slate mb-1">Haile Sellassie Avenue</p>
            <p className="text-slate mb-6">Mombasa, Kenya</p>
            
            <h3 className="font-sans font-bold text-ink mb-2">Opening Hours</h3>
            <p className="text-slate mb-1">Monday - Saturday</p>
            <p className="text-slate">08:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
