'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UploadArea } from '@/components/shared/UploadArea';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorThumbnails } from '@/components/editor/EditorThumbnails';
import { MobileEditorSheet } from '@/components/editor/MobileEditorSheet';
import { useVectorStore } from '@/services/store/vector.store';
import type { EditorTab } from '@/types/editor.types';
import { useVector } from '@/services/hooks/useVector';
import { VectorSquare } from 'lucide-react';
import { VectorEditorOverlay } from '@/components/editorvector';

/** Download an SVG string as a .svg file. */
function downloadSvg(svg: string, filename = 'vector.svg') {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function VectorPage() {
  const [activePanel, setActivePanel] = useState<EditorTab | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, items, activeItemId, setActiveItem } = useVectorStore();
  const { handleFileDrop, isPending } = useVector();

  const activeItem = items.find((i) => i.id === activeItemId);
  const previewUrl = activeItem?.previewUrl ?? null;
  const requestId = activeItem?.requestId ?? null;
  const resultSvg = activeItem?.svg ?? null;

  const isLoading =
    status === 'uploading' || isPending || (!!requestId && !resultSvg);

  // Open the full-screen vector editor when the `edit-vector` tab is active.
  const isEditorOpen = activePanel === 'edit-vector';

  const thumbnailItems = items.map((item) => ({
    id: item.id,
    // Thumbnails still show the original preview; the canvas handles the SVG result.
    url: item.previewUrl,
    label: item.svg ? 'Vectorized' : item.requestId ? 'Processing...' : 'Original',
  }));

  const handleAddMore = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) handleFileDrop(files);
      e.target.value = '';
    },
    [handleFileDrop]
  );

  const handleThumbnailSelect = useCallback(
    (id: string) => {
      setActiveItem(id);
    },
    [setActiveItem]
  );

  const handleDownload = useCallback(() => {
    if (!resultSvg) {
      toast.error('No vector result to download.');
      return;
    }
    try {
      downloadSvg(resultSvg, `vector-${activeItemId ?? 'result'}.svg`);
      toast.success('SVG downloaded!');
    } catch {
      toast.error('Download failed. Please try again.');
    }
  }, [resultSvg, activeItemId]);

  const hasItems = items.length > 0;

  const TABS: { id: EditorTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'edit-vector', label: 'Edit', icon: VectorSquare }
  ];

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
                <h1 className="text-3xl font-bold tracking-tight">Vector Tracer</h1>
                <p className="mt-2 text-muted-foreground">
                  Convert your images to vector graphics with AI
                </p>
              </div>

              <UploadArea
                onFileDrop={handleFileDrop}
                isLoading={isPending}
                className="w-full max-w-2xl"
                description="Drop your image to trace it into a vector graphic"
              />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col gap-3"
            >
              <div>
                <EditorToolbar
                  tabs={TABS}
                  activeTab={activePanel}
                  onTabChange={setActivePanel}
                  canUndoRedo={false}
                  canUndo={false}
                  canRedo={false}
                  onUndo={() => { }}
                  onRedo={() => { }}
                  onDownload={handleDownload}
                  isSingleDownloadOption={true}
                  singleDownloadOptionFormat="pro"
                 />
              </div>

              {/* Canvas + thumbnails */}
              <div className="flex flex-1 gap-3 min-h-0">
                <div className="flex flex-1 flex-col gap-3 min-h-0">
                  <EditorCanvas
                    originalUrl={previewUrl}
                    resultUrl={null}
                    resultSvg={resultSvg}
                    isLoading={isLoading}
                  />

                  <EditorThumbnails
                    items={thumbnailItems}
                    activeId={activeItemId}
                    onSelect={handleThumbnailSelect}
                    onAdd={handleAddMore}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VectorEditorOverlay
        open={isEditorOpen}
        onOpenChange={(open: boolean) => setActivePanel(open ? 'edit-vector' : null)}
        originalUrl={previewUrl}
        svg={resultSvg}
        regions={activeItem?.regions ?? null}
        filename={activeItemId ? `vector-${activeItemId}.svg` : null}
        isLoading={isLoading}
        onUpload={handleAddMore}
        onDownloadSvg={handleDownload}
      />
    </TooltipProvider>
  );
}

