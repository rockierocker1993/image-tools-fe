'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UploadArea } from '@/components/shared/UploadArea';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorThumbnails } from '@/components/editor/EditorThumbnails';
import { MobileEditorSheet } from '@/components/editor/MobileEditorSheet';
import { BackgroundPanel } from '@/components/editor/BackgroundPanel';
import { useRembgStore } from '@/services/store/upload.store';
import { useRembgEditorStore } from '@/services/store/editor.store';
import { useWebSocket } from '@/services/hooks/useWebSocket';
import { useEditor } from '@/services/hooks/useEditor';
import type { EditorTab } from '@/types/editor.types';
import { useJob } from '@/services/hooks/useJob';

export function RemoveBackgroundPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePanel, setActivePanel] = useState<EditorTab | null>(null);
  const { status, items, activeItemId, setActiveItem, applyBackground, undoBg, redoBg } = useRembgStore();
  useWebSocket();
  const editor = useEditor(useRembgEditorStore);
  const { handleFileDropRembg, isPendingRembg } = useJob();

  const activeItem = items.find((i) => i.id === activeItemId);
  const previewUrl = activeItem?.previewUrl ?? null;
  const requestId = activeItem?.requestId ?? null;
  const resultUrl = activeItem?.resultUrl ?? null;
  const bgColor = activeItem?.bgColor ?? null;
  const bgImageUrl = activeItem?.bgImageUrl ?? null;
  const canUndo = (activeItem?.bgHistoryIndex ?? 0) > 0;
  const canRedo = (activeItem?.bgHistoryIndex ?? -1) < (activeItem?.bgHistory?.length ?? 0) - 1;

  useEffect(() => {
    if (resultUrl) {
      editor.setResultImage(resultUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultUrl]);

  const isLoading = status === 'uploading' || isPendingRembg || (!!requestId && activeItem?.resultUrl === undefined);

  const thumbnailItems = items.map((item) => ({
    id: item.id,
    url: item.resultUrl ?? item.previewUrl,
    label: item.resultUrl ? 'Result' : (item.requestId ? 'Processing...' : 'Original'),
  }));

  const handleAddMore = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) handleFileDropRembg(files);
      e.target.value = '';
    },
    [handleFileDropRembg]
  );

  const handleThumbnailSelect = useCallback(
    (id: string) => {
      setActiveItem(id);
      const item = items.find((i) => i.id === id);
      if (item?.resultUrl) editor.setResultImage(item.resultUrl);
    },
    [items, setActiveItem, editor]
  );

  const hasItems = items.length > 0;

  const { warmingUpRembg } = useJob();

  useEffect(() => {
    warmingUpRembg();
  }, [warmingUpRembg]);

  return (
    <TooltipProvider>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <div className="flex h-full flex-col gap-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Remove Background</h1>
          <p className="mt-2 text-muted-foreground">
            Upload an image and we'll remove the background automatically
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!hasItems ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col items-center justify-center"
            >
              <UploadArea
                onFileDrop={handleFileDropRembg}
                isLoading={isPendingRembg}
                className="w-full max-w-2xl"
              />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col gap-3"
            >
              {/* Desktop toolbar */}
              <div className="hidden md:block">
                <EditorToolbar
                  activeTab={activePanel}
                  onTabChange={setActivePanel}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={() => activeItemId && undoBg(activeItemId)}
                  onRedo={() => activeItemId && redoBg(activeItemId)}
                  onDownload={editor.handleDownload}
                />
              </div>

              {/* Canvas + side panel */}
              <div className="flex flex-1 gap-3 min-h-0">
                <div className="flex flex-1 flex-col gap-3 min-h-0">
                  <EditorCanvas
                    originalUrl={previewUrl}
                    resultUrl={resultUrl}
                    isLoading={isLoading}
                    bgColor={bgColor}
                    bgImageUrl={bgImageUrl}
                  />

                  <EditorThumbnails
                    items={thumbnailItems}
                    activeId={activeItemId}
                    onSelect={handleThumbnailSelect}
                    onAdd={handleAddMore}
                  />
                </div>

                {/* Background side panel — desktop only */}
                <div className="hidden md:block">
                  <AnimatePresence>
                    {activePanel === 'background' && (
                      <BackgroundPanel
                        onApply={(url) => activeItemId && applyBackground(activeItemId, { bgImageUrl: url, bgColor: null })}
                        onApplyColor={(color) => activeItemId && applyBackground(activeItemId, { bgColor: color, bgImageUrl: null })}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile bottom sheet */}
              <MobileEditorSheet
                activeTab={activePanel ?? 'cutout'}
                onTabChange={setActivePanel}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={() => activeItemId && undoBg(activeItemId)}
                onRedo={() => activeItemId && redoBg(activeItemId)}
                onDownload={editor.handleDownload}
                onApplyBackground={(url) => activeItemId && applyBackground(activeItemId, { bgImageUrl: url, bgColor: null })}
                onApplyColor={(color) => activeItemId && applyBackground(activeItemId, { bgColor: color, bgImageUrl: null })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
