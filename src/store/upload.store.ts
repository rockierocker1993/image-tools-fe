import { create } from 'zustand';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface BgState {
  bgColor: string | null;
  bgImageUrl: string | null;
}

export interface UploadItem {
  id: string;
  previewUrl: string;
  requestId: string | null;
  /** undefined = WS event not yet received; null = job failed/no URL; string = result URL */
  resultUrl?: string | null;
  /** Current background applied to this item */
  bgColor: string | null;
  bgImageUrl: string | null;
  /** Undo/redo history for background changes */
  bgHistory: BgState[];
  bgHistoryIndex: number;
}

interface UploadState {
  status: UploadStatus;
  error: string | null;
  items: UploadItem[];
  activeItemId: string | null;
}

interface UploadActions {
  addItem: (previewUrl: string) => string;
  setItemRequestId: (itemId: string, requestId: string | null) => void;
  setItemResultByRequestId: (requestId: string, resultUrl: string | null) => void;
  setActiveItem: (itemId: string) => void;
  setStatus: (status: UploadStatus) => void;
  setError: (error: string | null) => void;
  applyBackground: (itemId: string, bg: Partial<BgState>) => void;
  undoBg: (itemId: string) => void;
  redoBg: (itemId: string) => void;
  reset: () => void;
}

type UploadStore = UploadState & UploadActions;

const initialState: UploadState = {
  status: 'idle',
  error: null,
  items: [],
  activeItemId: null,
};

export const useUploadStore = create<UploadStore>()((set) => ({
  ...initialState,

  addItem: (previewUrl) => {
    const id = crypto.randomUUID();
    set((state) => ({
      items: [...state.items, {
        id,
        previewUrl,
        requestId: null,
        bgColor: null,
        bgImageUrl: null,
        bgHistory: [],
        bgHistoryIndex: -1,
      }],
      activeItemId: id,
    }));
    return id;
  },

  setItemRequestId: (itemId, requestId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, requestId } : item
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

  applyBackground: (itemId, bg) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        const newEntry: BgState = {
          bgColor: 'bgColor' in bg ? (bg.bgColor ?? null) : item.bgColor,
          bgImageUrl: 'bgImageUrl' in bg ? (bg.bgImageUrl ?? null) : item.bgImageUrl,
        };
        const newHistory = [...item.bgHistory.slice(0, item.bgHistoryIndex + 1), newEntry];
        return {
          ...item,
          bgColor: newEntry.bgColor,
          bgImageUrl: newEntry.bgImageUrl,
          bgHistory: newHistory,
          bgHistoryIndex: newHistory.length - 1,
        };
      }),
    })),

  undoBg: (itemId) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        const idx = item.bgHistoryIndex - 1;
        if (idx < 0) return item;
        const entry = item.bgHistory[idx];
        return { ...item, bgColor: entry.bgColor, bgImageUrl: entry.bgImageUrl, bgHistoryIndex: idx };
      }),
    })),

  redoBg: (itemId) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        const idx = item.bgHistoryIndex + 1;
        if (idx >= item.bgHistory.length) return item;
        const entry = item.bgHistory[idx];
        return { ...item, bgColor: entry.bgColor, bgImageUrl: entry.bgImageUrl, bgHistoryIndex: idx };
      }),
    })),

  reset: () => set(initialState),
}));
