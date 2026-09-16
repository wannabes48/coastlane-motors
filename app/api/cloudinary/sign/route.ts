import { v2 as cloudinary } from 'cloudinary';
import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorised' }, { status: 401 });

  const { data: admin } = await supabase.from('admin_users')
    .select('user_id').eq('user_id', user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: 'coastlane/vehicles', upload_preset: 'coastlane_vehicles' };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

  return NextResponse.json({
    ...params,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}
