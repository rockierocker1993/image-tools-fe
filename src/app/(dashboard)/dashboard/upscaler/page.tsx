import type { Metadata } from 'next';
import { UpscalerPage } from '@/modules/upscaler/components/UpscalerPage';

export const metadata: Metadata = {
  title: 'Image Upscaler',
};

export default function UpscalerDashboardPage() {
  return <UpscalerPage />;
}
