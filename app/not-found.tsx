import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>404 - Not Found</CardTitle>
          <CardDescription>Oops! The page you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We couldn't find the requested resource. It might have been moved, deleted, or never existed.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
