import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/auth';
import ImageGenerator from '@/components/ImageGenerator';
import { PricingComponent } from '@/components/pricing-component';
import Loading from './loading';

export default async function Home() {
  const session = await auth();

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
