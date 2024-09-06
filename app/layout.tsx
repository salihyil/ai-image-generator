import { auth } from '@/auth';
import { AuthProvider } from '@/components/auth-provider';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LoadingProvider } from '@/contexts/LoadingContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html
      lang='en'
      suppressHydrationWarning>
      <body className={inter.className}>
        <LoadingProvider>
          <AuthProvider session={session}>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange>
              <LoadingScreen />
              {children}
            </ThemeProvider>
          </AuthProvider>
          <Toaster />
        </LoadingProvider>
      </body>
    </html>
  );
}
