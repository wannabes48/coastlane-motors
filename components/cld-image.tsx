'use client';

import { CldImage as BaseCldImage } from 'next-cloudinary';

export function CldImage(props: any) {
  return <BaseCldImage {...props} />;
}
