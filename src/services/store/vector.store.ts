import { create } from 'zustand';
import type { TraceSvgRegion } from '@/types/job.types';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadItem {
  id: string;
  previewUrl: string;
  requestId: string | null;
  svg: string | null;
  regions: TraceSvgRegion[] | null;
}

interface UploadState {
  status: UploadStatus;
  error: string | null;
  items: UploadItem[];
  activeItemId: string | null;
}

interface UploadActions {
  addItem: (previewUrl: string) => string;
  setItemRequestId: (
    itemId: string,
    requestId: string | null,
    svg: string | null,
    regions: TraceSvgRegion[] | null,
  ) => void;
  setItemResultByRequestId: (requestId: string, resultUrl: string | null) => void;
  setActiveItem: (itemId: string) => void;
  setStatus: (status: UploadStatus) => void;
  setError: (error: string | null) => void;
  undo: (itemId: string) => void;
  redo: (itemId: string) => void;
  reset: () => void;
}

type UploadStore = UploadState & UploadActions;

const initialState: UploadState = {
  status: 'idle',
  error: null,
  items: [],
  activeItemId: null,
};

const createVectorStore = () => create<UploadStore>()((set) => ({
  ...initialState,

  addItem: (previewUrl) => {
    const id = crypto.randomUUID();
    set((state) => ({
      items: [...state.items, {
        id,
        previewUrl,
        requestId: null,
        svg: null,
        regions: null,
      }],
      activeItemId: id,
    }));
    return id;
  },

  setItemRequestId: (itemId, requestId, svg, regions) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, requestId, svg, regions } : item
      ),
    })),

  setItemResultByRequestId: (requestId, resultUrl) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.requestId === requestId ? { ...item, resultUrl } : item
      ),
    })),

  setActiveItem: (itemId) => set({ activeItemId: itemId }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'error' }),


  undo: (itemId) =>
    set((state) => ({
    //   items: state.items.map((item) => {
    //     if (item.id !== itemId) return item;
    //     const idx = item.bgHistoryIndex - 1;
    //     if (idx < 0) return item;
    //     const entry = item.bgHistory[idx];
    //     return { ...item, bgColor: entry.bgColor, bgImageUrl: entry.bgImageUrl, bgHistoryIndex: idx };
    //   }),
    })),

  redo: (itemId) =>
    set((state) => ({
    //   items: state.items.map((item) => {
    //     if (item.id !== itemId) return item;
    //     const idx = item.bgHistoryIndex + 1;
    //     if (idx >= item.bgHistory.length) return item;
    //     const entry = item.bgHistory[idx];
    //     return { ...item, bgColor: entry.bgColor, bgImageUrl: entry.bgImageUrl, bgHistoryIndex: idx };
    //   }),
    })),

  reset: () => set(initialState),
}));

export type VectorStoreHook = ReturnType<typeof createVectorStore>;

export const useVectorStore = createVectorStore();