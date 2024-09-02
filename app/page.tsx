import { AppSidebar } from '@/components/app-sidebar';
import { SidebarLayout, SidebarTrigger } from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import ImageGenerator from '@/components/ImageGenerator';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const { cookies } = await import('next/headers');

  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarLayout defaultOpen={cookies().get('sidebar:state')?.value === 'true'}>
      <AppSidebar />
      <main className='flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out'>
        <div className='h-full rounded-md border-2 border-dashed p-2'>
          <SidebarTrigger />
          <ImageGenerator />
        </div>
      </main>
    </SidebarLayout>
  );
}
