import type { Metadata } from 'next';
import { RemoveBackgroundPage } from '@/modules/remove-background/components/RemoveBackgroundPage';

export const metadata: Metadata = {
  title: 'Remove Background',
};

export default function RemoveBackgroundDashboardPage() {
  return <RemoveBackgroundPage />;
}
