import { create } from 'zustand';
import type { FaqResponse } from '@/types/job.types';

 interface FaqStore {
  faqs: FaqResponse[];
  setFaqs: (faqs: FaqResponse[]) => void;
}

export const useFaqStore = create<FaqStore>((set) => ({
  faqs: [],
  setFaqs: (faqs) => set({ faqs }),
}));