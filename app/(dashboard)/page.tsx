import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { authOptions } from '@/auth';
import ImageGenerator from '@/components/ImageGenerator';
import { PricingComponent } from '@/components/pricing-component';
import Loading from './loading';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-12'>
      <Suspense fallback={<Loading />}>
        <ImageGenerator />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <PricingComponent />
      </Suspense>
    </div>
  );
}
