import { ImageResponse } from 'next/og';
import { getVehicle } from '@/lib/queries';
import { fmtKES } from '@/lib/money';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await getVehicle(slug);
  
  if (!car) {
    return new ImageResponse(<div style={{ background: '#0E1A20', width: '100%', height: '100%' }} />, size);
  }

  const photo = car.images?.[0] 
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_auto,w_1200,h_630/${car.images[0].public_id}`
    : 'https://res.cloudinary.com/demo/image/upload/w_1200,h_630,c_fill/sample';

  return new ImageResponse(
    (
      <div style={{ display:'flex', width:'100%', height:'100%', position:'relative' }}>
        <img src={photo} width={1200} height={630} style={{ objectFit: 'cover' }} alt="" />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:48,
                      background:'linear-gradient(transparent,#0E1A20)', color:'#fff',
                      display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ fontSize:52, fontWeight:700, fontFamily: 'sans-serif' }}>{car.year} {car.make} {car.model}</div>
          <div style={{ fontSize:40, fontFamily: 'sans-serif' }}>{fmtKES(car.price_kes)}</div>
        </div>
      </div>
    ),
    size
  );
}
