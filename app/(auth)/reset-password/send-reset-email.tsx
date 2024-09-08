'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/submit-button';

import { ExclamationTriangleIcon } from '@/components/icons';
import { Paths } from '@/lib/constants';
import { sendPasswordResetLink } from './actions';

export function SendResetEmail() {
  const [state, formAction] = useFormState(sendPasswordResetLink, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast('A password reset link has been sent to your email.');
      router.push(Paths.Login);
      
    }
    if (state?.error) {
      toast(state.error, {
        icon: <ExclamationTriangleIcon className='h-5 w-5 text-destructive' />,
      });
    }
  }, [state?.error, state?.success]);

  return (
    <form
      className='space-y-4'
      action={formAction}>
      <div className='space-y-2'>
        <Label htmlFor='email'>Your Email</Label>
        <Input
          required
          id='email'
          placeholder='email@example.com'
          autoComplete='email'
          name='email'
          type='email'
        />
      </div>

      <div className='flex flex-wrap justify-between'>
        <Button
          asChild
          variant={'link'}
          size={'sm'}
          className='p-0'>
          <Link href={Paths.Register}> Not signed up? Sign up now </Link>
        </Button>
      </div>

      <SubmitButton
        type='submit'
        className='w-full'>
        Reset Password
      </SubmitButton>
      <Button
        variant='outline'
        className='w-full'
        asChild>
        <Link href={Paths.Home}>Cancel</Link>
      </Button>
    </form>
  );
}
