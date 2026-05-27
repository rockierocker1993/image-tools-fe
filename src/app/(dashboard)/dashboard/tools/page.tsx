import type { Metadata } from 'next';
import { ToolsPage } from '@/modules/dashboard/components/ToolsPage';

export const metadata: Metadata = {
  title: 'Image Tools',
};

export default function ToolsDashboardPage() {
  return <ToolsPage />;
}
