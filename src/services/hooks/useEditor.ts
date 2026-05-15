'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/services/store/editor.store';
import { downloadImage } from '@/utils/image.utils';
import { toast } from 'sonner';
import type { EditorTab } from '@/types/editor.types';

export const useEditor = () => {
  const store = useEditorStore();

  const handleDownload = useCallback(
    async (format: 'png' | 'jpg' | 'webp' = 'png') => {
      if (!store.resultImageUrl) {
        toast.error('No image to download.');
        return;
      }
      try {
        await downloadImage(store.resultImageUrl, `result.${format}`);
        toast.success('Image downloaded!');
      } catch {
        toast.error('Download failed. Please try again.');
      }
    },
    [store.resultImageUrl]
  );

  const handleZoomIn = useCallback(() => store.setZoom(store.zoom * 1.2), [store]);
  const handleZoomOut = useCallback(() => store.setZoom(store.zoom / 1.2), [store]);
  const handleZoomReset = useCallback(() => store.setZoom(1), [store]);

  const handleTabChange = useCallback(
    (tab: EditorTab) => store.setActiveTab(tab),
    [store]
  );

  const canUndo = store.historyIndex > 0;
  const canRedo = store.historyIndex < store.history.length - 1;

  return {
    ...store,
    handleDownload,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleTabChange,
    canUndo,
    canRedo,
  };
};
