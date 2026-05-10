import type { Metadata } from 'next';
import { ZoomIn, Maximize2, Sparkles, ArrowRight } from 'lucide-react';
import { UpscalerPage } from '@/modules/upscaler';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaqSection } from '@/components/shared/FaqSection';
import { BeforeAfterShowcase } from '@/components/shared/BeforeAfterShowcase';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

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

const FAQ_ITEMS = [
  {
    question: 'How does AI upscaling differ from regular resizing?',
    answer:
      'Regular resizing just stretches pixels, causing blurring and artifacts. AI upscaling analyzes image content and intelligently reconstructs fine details, textures, and edges — producing sharp, natural-looking results.',
  },
  {
    question: 'What scale factors are available?',
    answer:
      'We support 2× (doubles width and height) and 4× (quadruples width and height). A 1000×1000px image becomes 4000×4000px at 4× — ideal for printing and large-format displays.',
  },
  {
    question: 'What file formats and sizes are supported?',
    answer:
      'We accept PNG, JPG/JPEG, and WebP images up to 20MB. Output is delivered as a high-quality PNG.',
  },
  {
    question: 'Is there a limit on how many images I can upscale?',
    answer:
      'Free users can upscale images without an account. Creating a free account increases your daily limit and gives you access to your processing history.',
  },
  {
    question: 'Will upscaling improve a very blurry or low-quality photo?',
    answer:
      'AI upscaling works best with images that have reasonable original quality. Severely blurry or heavily compressed images will improve, but starting with better source material always yields better results.',
  },
];

const SHOWCASE_ITEMS = [
  { before: '/showcase/before-upscale-1.jpg', after: '/showcase/after-upscale-1.png', label: 'Portrait' },
  { before: '/showcase/before-upscale-2.jpg', after: '/showcase/after-upscale-2.png', label: 'Landscape' },
];



export default function PublicUpscalerPage() {

  return (
    <div className="mx-auto max-w-5xl space-y-20 px-4 py-12">
      {/* Hero */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <ZoomIn className="h-4 w-4" />
          AI Image Upscaler
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Enhance Your Images<br className="hidden sm:block" /> With AI
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upscale any image up to 4× its original size without losing quality.
          Our AI fills in details that regular resizing destroys — completely free.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">✓ 2× and 4× upscale</span>
          <span className="text-sm text-muted-foreground">✓ AI-powered detail</span>
          <span className="text-sm text-muted-foreground">✓ No watermarks</span>
        </div>
      </section>

      {/* Upload Tool */}
      <section>
        <UpscalerPage />
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
      <FaqSection items={FAQ_ITEMS} />

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
