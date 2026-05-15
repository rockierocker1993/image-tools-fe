import { create } from 'zustand';
import type { FaqResponse } from '@/types/job.types';

 interface FaqStore {
  faqsRembg: FaqResponse[];
  setFaqsRembg: (faqs: FaqResponse[]) => void;
  faqsUpscale: FaqResponse[];
  setFaqsUpscale: (faqs: FaqResponse[]) => void;
}

export const useFaqStore = create<FaqStore>((set) => ({
  faqsRembg: [],
  setFaqsRembg: (faqs) => set({ faqsRembg: faqs }),
  faqsUpscale: [],
  setFaqsUpscale: (faqs) => set({ faqsUpscale: faqs }),
}));