import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import ImageGenerator from '@/components/ImageGenerator';
import { PricingComponent } from '@/components/pricing-component';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <ImageGenerator />
      <PricingComponent />
    </div>
  );
}
