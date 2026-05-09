'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ShowcaseItem {
  before: string;
  after: string;
  label: string;
}

interface BeforeAfterShowcaseProps {
  items: ShowcaseItem[];
  title?: string;
  description?: string;
}

export function BeforeAfterShowcase({
  items,
  title = 'See the Results',
  description,
}: BeforeAfterShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Main before/after display */}
        <div className="grid w-full max-w-3xl grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Before</p>
            <motion.div
              key={`before-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden rounded-2xl border bg-muted/30"
            >
              <div className="flex aspect-square items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZGRkIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNkZGQiLz48L3N2Zz4=')]">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted/80 p-8">
                  <span className="text-4xl font-bold text-muted-foreground/30">IMG</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-2">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">After</p>
            <motion.div
              key={`after-${activeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden rounded-2xl border bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=')]">
              <div className="flex aspect-square items-center justify-center p-8">
                <span className="text-4xl font-bold text-primary/30">✓</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Thumbnail selector */}
        {items.length > 1 && (
          <div className="flex gap-3">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Upload your own image</span>
          <ArrowRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Get instant results</span>
        </div>
      </div>
    </section>
  );
}
