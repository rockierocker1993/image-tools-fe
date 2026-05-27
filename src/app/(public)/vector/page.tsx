import type { Metadata } from 'next';
import { ZoomIn, Maximize2, Sparkles, ArrowRight } from 'lucide-react';
import { UpscalerPage } from '@/modules/upscaler';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BeforeAfterShowcase } from '@/components/shared/BeforeAfterShowcase';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { FaqPage } from '@/modules/public-faq';
import { VectorPage } from '@/modules/vector';

export const metadata: Metadata = {
  title: 'AI Image Upscaler - Enhance Resolution Free',
  description: 'Upscale images up to 4x with AI. Enhance resolution without losing quality. Free online tool.',
};

const FEATURES = [
  {
    icon: Maximize2,
    title: 'Up to 4× Upscale',
    description: 'Dramatically increase resolution from 2× to 4×, ideal for printing and large displays.',
  },
  {
    icon: Sparkles,
    title: 'AI Enhanced',
    description: 'Our model reconstructs fine details and sharpens edges that traditional resizing destroys.',
  },
  {
    icon: ZoomIn,
    title: 'Any Format',
    description: 'Upload PNG, JPG, or WebP. Download a full-quality PNG with no compression artifacts.',
  },
];

const SHOWCASE_ITEMS = [
  { before: '/showcase/before-upscale-1.jpg', after: '/showcase/after-upscale-1.png', label: 'Portrait' },
  { before: '/showcase/before-upscale-2.jpg', after: '/showcase/after-upscale-2.png', label: 'Landscape' },
];



export default function PublicVectorPage() {

  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-12">
      {/* Hero */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <ZoomIn className="h-4 w-4" />
          AI Powered Vectorization
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Trace Pixels To Vectors in Full Color
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert PNG, JPG, GIF, and WebP images to clean SVG, PDF, EPS, and DXF vectors. Fully automatically.<br className="hidden sm:block" /> Using AI.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">✓ AI-powered detail</span>
          <span className="text-sm text-muted-foreground">✓ No watermarks</span>
        </div>
      </section>

      {/* Upload Tool */}
      <section>
        <VectorPage />
      </section>

      {/* Before / After */}
      <BeforeAfterShowcase
        items={SHOWCASE_ITEMS}
        title="Before & After"
        description="Same image — see the difference AI upscaling makes"
      />

      {/* Features */}
      <section className="space-y-6">
        <h2 className="text-center text-2xl font-bold tracking-tight">Professional-grade upscaling</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-0 bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-3 font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <FaqPage category="VECTOR" />

      {/* CTA */}
      <section className="rounded-2xl bg-primary p-8 text-center text-primary-foreground">
        <h2 className="text-2xl font-bold">Need higher limits?</h2>
        <p className="mt-2 text-primary-foreground/80">
          Sign up free to unlock more daily upscales and keep your processing history.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href={ROUTES.REGISTER}>
            <Button variant="secondary" size="lg">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
