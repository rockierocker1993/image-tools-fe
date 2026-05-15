'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useFaq } from '@/services/hooks/useFaq';
import { useFaqStore } from '@/services/store/faq.store';


interface FaqPageProps {
  category: string;
  title?: string;
}

export function FaqPage({ category, title = 'Frequently Asked Questions' }: FaqPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { getFaqRembg, getFaqUpscaler } = useFaq();
  const { faqsRembg, faqsUpscale } = useFaqStore();
  useEffect(() => {
    if (category === 'REMBG') {
      getFaqRembg();
    } else if (category === 'UPSCALE') {
      getFaqUpscaler();
    }
  }, [category, getFaqRembg, getFaqUpscaler]);
  const faqs = category === 'REMBG' ? faqsRembg : faqsUpscale;
  console.log('FAQs:', faqs);
  return (
    <section className="space-y-6">
      <h2 className="text-center text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mx-auto max-w-2xl divide-y rounded-2xl border">
        {faqs.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium transition-colors hover:bg-muted/50"
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <span className="shrink-0 text-muted-foreground">
                {openIndex === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-4 text-sm text-muted-foreground">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
