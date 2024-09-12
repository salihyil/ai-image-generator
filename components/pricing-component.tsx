'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';
import { useState } from 'react';

export function PricingComponent() {
  const [isAnnual, setIsAnnual] = useState(false);

  const tiers = [
    {
      name: 'Başlangıç',
      monthlyPrice: 99,
      annualPrice: 990,
      description: 'Bireyler ve küçük projeler için mükemmel',
      features: ['1 kullanıcı', '10 proje', '5GB depolama', 'Temel destek'],
    },
    {
      name: 'Pro',
      monthlyPrice: 299,
      annualPrice: 2990,
      description: 'Ekipler ve büyüyen işletmeler için harika',
      features: [
        '5 kullanıcı',
        '50 proje',
        '100GB depolama',
        'Öncelikli destek',
        'Gelişmiş analitik',
      ],
    },
    {
      name: 'Kurumsal',
      monthlyPrice: null,
      annualPrice: null,
      description: 'Büyük ölçekli operasyonlar ve organizasyonlar için',
      features: [
        'Sınırsız kullanıcı',
        'Sınırsız proje',
        '1TB depolama',
        '7/24 özel destek',
        'Özel entegrasyonlar',
      ],
    },
  ];

  const formatPrice = (price: number | null): string => {
    return price === null ? 'Özel' : `₺${price.toLocaleString('tr-TR')}`;
  };

  const getAnnualSavings = (
    monthlyPrice: number | null,
    annualPrice: number | null
  ): number | null => {
    if (monthlyPrice === null || annualPrice === null) return null;
    const savings = ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100;
    return Math.round(savings);
  };

  return (
    <div className='py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-foreground sm:text-4xl'>
            Fiyatlandırma Planları
          </h2>
          <p className='mt-4 text-xl text-muted-foreground'>İhtiyaçlarınıza uygun planı seçin</p>
        </div>
        <div className='mt-6 flex justify-center items-center space-x-3'>
          <span
            className={`text-sm font-medium ${
              !isAnnual ? 'text-primary' : 'text-muted-foreground'
            }`}>
            Aylık
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            aria-label='Yıllık faturalama'
          />
          <span
            className={`text-sm font-medium ${
              isAnnual ? 'text-primary' : 'text-muted-foreground'
            }`}>
            Yıllık
          </span>
          {isAnnual && (
            <Badge
              variant='secondary'
              className='ml-2'>
              Tasarruf edin!
            </Badge>
          )}
        </div>
        <div className='mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3'>
          {tiers.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            const formattedPrice = formatPrice(price);
            const savings = isAnnual ? getAnnualSavings(tier.monthlyPrice, tier.annualPrice) : null;
            return (
              <Card
                key={tier.name}
                className='flex flex-col justify-between'>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-4xl font-bold mb-4'>
                    {formattedPrice}
                    {price !== null && (
                      <span className='text-lg font-normal text-muted-foreground'>
                        {isAnnual ? '/yıl' : '/ay'}
                      </span>
                    )}
                  </div>
                  {isAnnual && savings && (
                    <Badge
                      variant='outline'
                      className='mb-4'>
                      %{savings} tasarruf
                    </Badge>
                  )}
                  <ul
                    className='space-y-2'
                    aria-label={`${tier.name} planı özellikleri`}>
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className='flex items-center'>
                        <Check
                          className='h-5 w-5 text-primary mr-2'
                          aria-hidden='true'
                        />
                        <span className='text-muted-foreground'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className='w-full'
                    variant={tier.name === 'Kurumsal' ? 'outline' : 'default'}>
                    {tier.name === 'Kurumsal' ? 'İletişime Geçin' : 'Başlayın'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
