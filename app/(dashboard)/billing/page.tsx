'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Download } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6 lg:mb-8">Billing</h1>
      
      <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Subscription Plan</CardTitle>
            <CardDescription>You are currently on the Pro plan</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Plan:</dt>
                <dd className="font-medium">Pro</dd>
              </div>
              <div className="flex justify-between">
                <dt>Price:</dt>
                <dd className="font-medium">$19.99/month</dd>
              </div>
              <div className="flex justify-between">
                <dt>Billing Period:</dt>
                <dd className="font-medium">Monthly</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Upgrade Plan</Button>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Payment Method</CardTitle>
            <CardDescription>Manage your payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">Visa ending in 1234</p>
                <p className="text-sm text-gray-500">Expires 12/2024</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Update Payment Method</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6 sm:mt-8 lg:mt-10">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Billing History</CardTitle>
          <CardDescription>View your past invoices</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] sm:w-[100px]">Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">2023-05-01</TableCell>
                <TableCell>$19.99</TableCell>
                <TableCell className="hidden sm:table-cell">Paid</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Download</span>
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}