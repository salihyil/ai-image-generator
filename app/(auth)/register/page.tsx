'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLoading } from '@/contexts/LoadingContext';
import { passwordConditions, registerSchema } from '@/schema/registerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import * as z from 'zod';
import { registerUser } from './actions';
import { Paths } from '@/lib/constants';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, setIsLoading } = useLoading();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = useWatch({
    control: form.control,
    name: 'password',
  });

  const PasswordConditionItem = ({
    regex,
    text,
    password,
  }: {
    regex: RegExp;
    text: string;
    password: string;
  }) => {
    const condition = regex.test(password);
    return (
      <li
        className={`flex items-center space-x-2 ${condition ? 'text-green-500' : 'text-red-500'}`}>
        {condition ? <FaCheck /> : <FaTimes />}
        <span>{text}</span>
      </li>
    );
  };

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const newUser = await registerUser(data);

      toast({
        title: 'Registration successful',
        description: `Welcome, ${newUser.name}! You can now log in with your new account.`,
        variant: 'success',
      });

      // Redirect to login page
      router.push(Paths.Login);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Registration failed',
          description: 'An unexpected error occurred during registration. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Enter your password'
                          {...field}
                        />
                        <div
                          className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                          onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                      </div>
                    </FormControl>
                    {password && (
                      <ul className='mt-2 text-sm'>
                        {passwordConditions.map(({ key, text, regex }) => (
                          <PasswordConditionItem
                            key={key}
                            regex={regex}
                            text={text}
                            password={password}
                          />
                        ))}
                      </ul>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Confirm your password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full'
                disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </form>
          </Form>
          <p className='text-center mt-4'>
            Already have an account?
            <Link href='/login'>
              <Button
                variant='link'
                className='ml-2'>
                Login
              </Button>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
