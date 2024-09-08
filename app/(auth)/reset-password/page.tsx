import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Paths } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { SendResetEmail } from './send-reset-email';

export const metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password Page',
};

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session?.user) redirect(Paths.Home);

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>Password reset link will be sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <SendResetEmail />
      </CardContent>
    </Card>
  );
}
