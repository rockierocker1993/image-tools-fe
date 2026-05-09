import type { Metadata } from 'next';
import { Eraser, Zap, Shield, Download, ArrowRight } from 'lucide-react';
import { RemoveBackgroundPage } from '@/modules/remove-background';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaqSection } from '@/components/shared/FaqSection';
import { BeforeAfterShowcase } from '@/components/shared/BeforeAfterShowcase';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Remove Background - Free Online AI Tool',
  description: 'Remove image backgrounds instantly with AI. Free, fast, and accurate. No signup required.',
};

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'AI processes your image in under 5 seconds. No waiting around.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your images are processed securely and never stored on our servers.',
  },
  {
    icon: Download,
    title: 'Free to Download',
    description: 'Download your result in full resolution. No watermarks, ever.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How does the background removal work?',
    answer:
      'Our AI model analyzes your image and automatically detects the subject versus the background. It then precisely removes the background, leaving you with a clean cutout. The process takes just a few seconds.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'We support PNG, JPG/JPEG, and WebP formats. For best results, use images with a clear subject. The maximum file size is 20MB.',
  },
  {
    question: 'Is this tool completely free?',
    answer:
      'Yes! You can remove backgrounds for free without creating an account. Create a free account to access your history and process more images per day.',
  },
  {
    question: 'What resolution will my output image be?',
    answer:
      'The output image maintains the same resolution as your original input. We output in PNG format to preserve transparency with full quality.',
  },
  {
    question: 'Can I use the results commercially?',
    answer:
      'Yes. The processed images are yours to use however you like, including for commercial purposes.',
  },
];

const SHOWCASE_ITEMS = [
  { before: '/showcase/before-1.jpg', after: '/showcase/after-1.png', label: 'Product Photo' },
  { before: '/showcase/before-2.jpg', after: '/showcase/after-2.png', label: 'Portrait' },
  { before: '/showcase/before-3.jpg', after: '/showcase/after-3.png', label: 'Object' },
];

export default function PublicRemoveBackgroundPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-12">
      {/* Hero */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Eraser className="h-4 w-4" />
          AI-Powered Background Removal
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Remove Background<br className="hidden sm:block" /> in Seconds
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your image and our AI will remove the background automatically.
          No design skills required — perfect results every time, completely free.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">✓ Free forever</span>
          <span className="text-sm text-muted-foreground">✓ No watermarks</span>
          <span className="text-sm text-muted-foreground">✓ No signup required</span>
        </div>
      </section>

      {/* Upload Tool */}
      <section>
        <RemoveBackgroundPage />
      </section>

      {/* Before / After */}
      <BeforeAfterShowcase
        items={SHOWCASE_ITEMS}
        title="Before & After"
        description="See what our AI can do with real images"
      />

      {/* Feature cards */}
      <section className="space-y-6">
        <h2 className="text-center text-2xl font-bold tracking-tight">Why use ImageTools?</h2>
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
      <FaqSection items={FAQ_ITEMS} />

      {/* CTA */}
      <section className="rounded-2xl bg-primary p-8 text-center text-primary-foreground">
        <h2 className="text-2xl font-bold">Ready to process more images?</h2>
        <p className="mt-2 text-primary-foreground/80">
          Create a free account to save your history and unlock higher limits.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href={ROUTES.REGISTER}>
            <Button variant="secondary" size="lg">
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
