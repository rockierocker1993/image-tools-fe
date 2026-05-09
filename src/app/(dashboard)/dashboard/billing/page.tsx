import type { Metadata } from 'next';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Billing',
};

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge>Free</Badge>
          </div>
          <CardDescription>You are on the free plan. Upgrade to unlock more features.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
