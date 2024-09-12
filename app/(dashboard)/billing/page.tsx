'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Download } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <CreditCard className="h-6 w-6" aria-hidden="true" />
              <div>
                <p className="font-medium">Visa ending in 1234</p>
                <p className="text-sm text-gray-500">Expires 12/2024</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Update Payment Method</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-05-01</TableCell>
                <TableCell>$19.99</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    Download
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