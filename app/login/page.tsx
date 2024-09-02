'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaGithub } from 'react-icons/fa'; // Yeni import
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Yeni state
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
    } else {
      toast({
        variant: 'success',
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/'); // veya istediğiniz yönlendirme sayfası
    }
    setLoading(false);
  };

  const handleGithubLogin = () => {
    signIn('github');
  };

  return (
    <div className='container mx-auto p-4'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'} // Şifreyi göster/gizle
                          placeholder='Enter your password'
                          {...field}
                        />
                        <div
                          className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                          onClick={() => setShowPassword(!showPassword)} // İkon tıklama olayı
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Checkbox
                    id='rememberMe'
                    className='mr-2'
                  />
                  <Label
                    htmlFor='rememberMe'
                    className='text-sm'>
                    Remember Me
                  </Label>
                </div>
                <Link
                  href='/forgot-password'
                  className='inline-block text-sm underline'>
                  Forgot your password?
                </Link>
              </div>
              <Button
                type='submit'
                className='w-full'
                disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
          <div className='mt-4'>
            <Button
              variant='outline'
              className='w-full'
              onClick={handleGithubLogin}>
              <FaGithub className='mr-2 h-4 w-4' />
              Continue with Github
            </Button>
          </div>
          <p className='text-center mt-4'>
            Don&apos;t have an account?
            <Link href='/register'>
              <Button
                variant='link'
                className='ml-2'>
                Register
              </Button>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
