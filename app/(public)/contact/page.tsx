import { Metadata } from 'next';
import { ArrowRight, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Coastlane Motors. WhatsApp us or visit our showroom in Mombasa.',
};

export default function ContactPage() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full">
          <div className="space-y-6">
            <h1 className="text-xl font-medium text-azure">
              Connect with a Coastlane Expert
            </h1>
            <h2 className="w-full text-5xl font-bold tracking-tight text-ink md:text-7xl">
              Let’s find your <br className="hidden md:block" /> perfect vehicle
            </h2>
          </div>
          <div className="mt-12 grid w-full border border-line rounded-3xl overflow-hidden lg:grid-cols-2">
            <form className="space-y-8 p-6 md:p-10 lg:border-r border-line bg-sky/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Full Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="Your Name"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="0712 345 678"
                    className="mt-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label>What is your budget? (KES)</Label>
                <div className="mt-4 flex justify-between gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Checkbox id="b1" />
                      <Label htmlFor="b1" className="font-normal text-slate">Under 1M</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="b2" />
                      <Label htmlFor="b2" className="font-normal text-slate">1M - 2.5M</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="b3" />
                      <Label htmlFor="b3" className="font-normal text-slate">2.5M - 5M</Label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Checkbox id="b4" />
                      <Label htmlFor="b4" className="font-normal text-slate">5M - 10M</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="b5" />
                      <Label htmlFor="b5" className="font-normal text-slate">Over 10M</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="b6" />
                      <Label htmlFor="b6" className="font-normal text-slate">Not sure yet</Label>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div>
                  <Label>
                    Which vehicle types are you interested in?
                  </Label>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Checkbox id="t1" />
                      <Label htmlFor="t1" className="font-normal text-slate">SUV / 4x4</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="t2" />
                      <Label htmlFor="t2" className="font-normal text-slate">Sedan</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="t3" />
                      <Label htmlFor="t3" className="font-normal text-slate">Hatchback</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="t4" />
                      <Label htmlFor="t4" className="font-normal text-slate">Pickup / Commercial</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div>
                <Label htmlFor="details">Tell us about your preferences</Label>
                <Textarea
                  id="details"
                  placeholder="I am looking for a 7-seater for my family, preferably a Toyota Prado or similar..."
                  className="mt-4"
                />
              </div>
              
              <div className="flex space-x-3 items-start">
                <Checkbox id="consent" className="mt-1" />
                <Label htmlFor="consent" className="text-slate text-xs font-normal leading-relaxed">
                  By checking this box, you agree to allow Coastlane Motors to contact you regarding your vehicle inquiry. Your data is kept strictly confidential.
                </Label>
              </div>
              
              <Button className="w-full sm:w-auto h-12 px-8 rounded-full">
                Send Inquiry
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex h-full w-full flex-col border-t border-line p-6 md:p-10 lg:border-t-0 bg-white">
              <div className="flex-1 flex flex-col justify-center">
                <Quote className="h-12 w-12 text-azure mb-8 opacity-20" />
                <p className="text-xl md:text-2xl font-serif text-ink italic leading-relaxed">
                  “Buying my Prado from Coastlane Motors was the smoothest process. The team was completely transparent about the car's history, professional throughout, and handled all the complicated transfer paperwork for me. Highly recommend them to anyone in Mombasa!”
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate flex items-center justify-center text-white font-bold text-lg">
                    JO
                  </div>
                  <div>
                    <p className="font-bold text-ink">James Omondi</p>
                    <p className="text-sm text-slate">Business Owner, Mombasa</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-10" />
              
              <div>
                <p className="text-sm font-semibold text-slate uppercase tracking-wider mb-6">Brands we frequently stock</p>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {[
                    { name: 'Toyota',        logo: '/Toyota-Logo.png' },
                    { name: 'Nissan',        logo: '/Nissan-logo.png' },
                    { name: 'Mazda',         logo: '/Mazda-Logo.png' },
                    { name: 'Subaru',        logo: '/Subaru-Logo.png' },
                    { name: 'Mitsubishi',    logo: '/Mitsubishi-Logo.png' },
                    { name: 'Honda',         logo: '/Honda-Logo.png' },
                    { name: 'Isuzu',         logo: '/Isuzu-Logo.png' },
                    { name: 'Mercedes-Benz', logo: '/Mercedes-Logo.png' },
                    { name: 'BMW',           logo: '/BMW-Logo.png' },
                    { name: 'Audi',          logo: '/Audi-Logo.png' },
                    { name: 'Suzuki',        logo: '/Suzuki-Logo.png' },
                    { name: 'Lexus',         logo: '/Lexus-Logo.svg' },
                    { name: 'Volkswagen',    logo: '/Volkswagen-Logo.png' },
                    { name: 'Ford',          logo: '/Ford-Logo.png' }
                  ].map((brand, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center p-2 h-16 md:h-20 bg-sky/30 border border-line/50 rounded-xl hover:bg-sky/60 transition-colors"
                      title={brand.name}
                    >
                      <img 
                        src={brand.logo} 
                        alt={`${brand.name} logo`} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full border border-line border-t-0 rounded-b-3xl p-12 md:p-20 text-center bg-ink">
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Ready to view a car in person?
            </h3>
            <p className="text-white/70 mt-4 max-w-xl mx-auto">
              Our showroom at Haile Sellassie Avenue, Mombasa is open Monday to Saturday, 08:00 - 18:00. Walk-ins are always welcome.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}>
                <Button variant="outline" className="h-12 px-8 rounded-full border-white/20 text-white hover:bg-white/10">
                  Call Us
                </Button>
              </a>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
                <Button className="h-12 px-8 rounded-full bg-wa hover:bg-wa/90 text-white border-0">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  WhatsApp Sales
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
