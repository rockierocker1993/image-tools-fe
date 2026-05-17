'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UploadArea } from '@/components/shared/UploadArea';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorThumbnails } from '@/components/editor/EditorThumbnails';
import { MobileEditorSheet } from '@/components/editor/MobileEditorSheet';
import { BackgroundPanel } from '@/components/editor/BackgroundPanel';
import { Button } from '@/components/ui/button';
import { useUpscalerStore } from '@/services/store/upload.store';
import { useUpscalerEditorStore } from '@/services/store/editor.store';
import { useWebSocket } from '@/services/hooks/useWebSocket';
import { useEditor } from '@/services/hooks/useEditor';
import type { EditorTab } from '@/types/editor.types';
import { useJob } from '@/services/hooks/useJob';

export function UpscalerPage() {
  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [activePanel, setActivePanel] = useState<EditorTab | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, items, activeItemId, setActiveItem, applyBackground, undoBg, redoBg } = useUpscalerStore();
  useWebSocket();
  const editor = useEditor(useUpscalerEditorStore);
  const { handleFileDropUpscaler, isPendingUpscaler } = useJob();

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

  const isLoading = status === 'uploading' || isPendingUpscaler || (!!requestId && activeItem?.resultUrl === undefined);
  console.log('isLoading:', { status, isPendingUpscaler, requestId, resultUrl, activeItem });
  const thumbnailItems = items.map((item) => ({
    id: item.id,
    url: item.resultUrl ?? item.previewUrl,
    label: item.resultUrl ? `${scaleFactor}x Result` : (item.requestId ? 'Processing...' : 'Original'),
  }));

  const handleAddMore = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) handleFileDropUpscaler(files);
      e.target.value = '';
    },
    [handleFileDropUpscaler]
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

  const { warmingUpUpscaler } = useJob();
  useEffect(() => {
    warmingUpUpscaler();
  }, [warmingUpUpscaler]);

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
        <AnimatePresence mode="wait">
          {!hasItems ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col items-center justify-center gap-6"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Image Upscaler</h1>
                <p className="mt-2 text-muted-foreground">
                  Enhance your image resolution with AI
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Scale factor:</span>
                <div className="flex gap-2">
                  {([2, 4] as const).map((factor) => (
                    <Button
                      key={factor}
                      variant={scaleFactor === factor ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setScaleFactor(factor)}
                    >
                      {factor}x
                    </Button>
                  ))}
                </div>
              </div>

              <UploadArea
                onFileDrop={handleFileDropUpscaler}
                isLoading={isPendingUpscaler}
                className="w-full max-w-2xl"
                description={`Drop your image to upscale ${scaleFactor}x`}
              />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col gap-3"
            >
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

