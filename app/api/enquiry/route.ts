import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const body = z.object({
  name: z.string().min(2), phone: z.string().min(9),
  email: z.string().email().optional(),
  message: z.string().max(1000).optional(),
  vehicle_id: z.string().uuid().optional(),
  honeypot: z.string().max(0),          // bots fill this
});

export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const { honeypot, ...data } = parsed.data;

  if (honeypot) return NextResponse.json({ ok: true });

  await supabaseAdmin.from('enquiries').insert(data);

  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: 'Coastlane Motors <website@coastlanemotors.co.ke>',
      to: process.env.SALES_INBOX!,
      replyTo: data.email,
      subject: `New enquiry — ${data.name}`,
      text: `${data.name} · ${data.phone}\n${data.message ?? ''}\nVehicle: ${data.vehicle_id ?? 'general'}`,
    });
  }

  return NextResponse.json({ ok: true });
}
