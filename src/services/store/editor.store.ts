import { create } from 'zustand';
import type { EditorState, EditorTab } from '@/types/editor.types';

interface EditorActions {
  setOriginalImage: (url: string) => void;
  setResultImage: (url: string) => void;
  setActiveTab: (tab: EditorTab) => void;
  setZoom: (zoom: number) => void;
  toggleCompare: () => void;
  addToHistory: (imageUrl: string, action: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

type EditorStore = EditorState & EditorActions;

const initialState: EditorState = {
  originalImageUrl: null,
  resultImageUrl: null,
  activeTab: 'cutout',
  zoom: 1,
  isComparing: false,
  history: [],
  historyIndex: -1,
};

const createEditorStore = () => create<EditorStore>()((set, get) => ({
  ...initialState,

  setOriginalImage: (url) => set({ originalImageUrl: url }),

  setResultImage: (url) => {
    const { history, historyIndex } = get();
    const newEntry = { imageUrl: url, timestamp: Date.now(), action: 'update' };
    const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
    set({ resultImageUrl: url, history: newHistory, historyIndex: newHistory.length - 1 });
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(zoom, 5)) }),
  toggleCompare: () => set((state) => ({ isComparing: !state.isComparing })),

  addToHistory: (imageUrl, action) => {
    const { history, historyIndex } = get();
    const newEntry = { imageUrl, timestamp: Date.now(), action };
    const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        resultImageUrl: history[historyIndex - 1].imageUrl,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        resultImageUrl: history[historyIndex + 1].imageUrl,
      });
    }
  },

  reset: () => set(initialState),
}));

export type EditorStoreHook = ReturnType<typeof createEditorStore>;

/** Isolated editor store for the Remove Background module */
export const useRembgEditorStore = createEditorStore();
/** Isolated editor store for the Upscaler module */
export const useUpscalerEditorStore = createEditorStore();
/** Legacy export kept for backward compatibility */
export const useEditorStore = useRembgEditorStore;
