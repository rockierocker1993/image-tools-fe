import type { Metadata } from 'next';
import { DashboardHome } from '@/modules/dashboard/components/DashboardHome';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return <DashboardHome />;
}
