'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon, Download, ImageIcon, Loader2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  aspectRatio: z.string().optional(),
  negativePrompt: z.string().optional(),
  seed: z.string().optional(),
  stylePreset: z.string().optional(),
  outputFormat: z.enum(['webp', 'png', 'jpg']),
});

export default function Component() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme, setTheme } = useTheme();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      aspectRatio: '',
      negativePrompt: '',
      seed: '',
      stylePreset: '',
      outputFormat: 'webp',
    },
  });

  const generateImage = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          seed: values.seed ? parseInt(values.seed) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while generating the image.');
      }

      setImageUrl(data.imageUrl);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'An error occurred while generating the image.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(generateImage)(event);
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'generated-image.' + form.getValues('outputFormat');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col md:flex-row gap-8'>
        <Card className='w-full md:w-1/2'>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle>AI Image Generator</CardTitle>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? (
                  <Sun className='h-[1.2rem] w-[1.2rem]' />
                ) : (
                  <Moon className='h-[1.2rem] w-[1.2rem]' />
                )}
                <span className='sr-only'>Toggle theme</span>
              </Button>
            </div>
            <CardDescription>
              Enter a prompt and optional parameters to generate an AI image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className='space-y-4'>
                <FormField
                  control={form.control}
                  name='prompt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Prompt</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your image prompt here...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Collapsible
                  open={showMoreOptions}
                  onOpenChange={setShowMoreOptions}
                  className='mt-4'>
                  <CollapsibleTrigger asChild>
                    <div className='flex items-center justify-between cursor-pointer'>
                      <span className='text-sm text-gray-400'>Additional Settings</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='p-0'
                        type='button' // Prevent form submission
                      >
                        <span className='sr-only'>Toggle</span>
                        <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className='mt-2 space-y-4'>
                    <FormField
                      control={form.control}
                      name='aspectRatio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aspect Ratio</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='e.g., 1:1, 16:9, 4:3'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='negativePrompt'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Negative Prompt</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter negative prompt here...'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='seed'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seed</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Enter seed (optional)'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='stylePreset'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Style Preset</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter style preset (optional)'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <FormField
                  control={form.control}
                  name='outputFormat'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select output format' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='webp'>WebP</SelectItem>
                          <SelectItem value='png'>PNG</SelectItem>
                          <SelectItem value='jpg'>JPG</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  disabled={loading}
                  className='w-full'>
                  {loading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className='mr-2 h-4 w-4' />
                      Generate Image
                    </>
                  )}
                </Button>
              </form>
            </Form>
            {error && <p className='text-sm text-red-500 mt-2'>{error}</p>}
          </CardContent>
        </Card>

        <Card className='w-full md:w-1/2'>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle>Generated Image</CardTitle>
              {imageUrl && (
                <Button
                  onClick={handleDownload}
                  className='flex items-center'>
                  <Download className='mr-2 h-4 w-4' />
                  Download
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt='Generated AI Image'
                width={500}
                height={300}
                className='w-full h-auto rounded-lg shadow-lg'
              />
            ) : (
              <div className='flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                <p className='text-gray-500 dark:text-gray-400'>Image will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
