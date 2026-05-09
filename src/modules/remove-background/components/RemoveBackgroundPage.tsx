'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UploadArea } from '@/components/shared/UploadArea';
import { JobStatusBadge } from '@/components/shared/JobStatusBadge';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorThumbnails } from '@/components/editor/EditorThumbnails';
import { MobileEditorSheet } from '@/components/editor/MobileEditorSheet';
import { useUploadStore } from '@/store/upload.store';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useEditor } from '@/hooks/useEditor';
import { useRemoveBackground } from '../hooks/useRemoveBackground';

export function RemoveBackgroundPage() {
  const { status, previewUrl, jobId } = useUploadStore();
  const { jobStatus, resultUrl, error } = useWebSocket(jobId, 'remove-background');
  const editor = useEditor();
  const { handleFileDrop, isPending } = useRemoveBackground();

  useEffect(() => {
    if (resultUrl) {
      editor.setResultImage(resultUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultUrl]);

  const isProcessing = jobStatus === 'PROCESSING' || status === 'uploading' || isPending;
  const isCompleted = jobStatus === 'COMPLETED' && !!resultUrl;

  const thumbnailItems = previewUrl
    ? [{ id: 'original', url: previewUrl, label: 'Original' }]
    : [];
  if (resultUrl) {
    thumbnailItems.push({ id: 'result', url: resultUrl, label: 'Result' });
  }

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col gap-4">
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col items-center justify-center gap-6"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Remove Background</h1>
                <p className="mt-2 text-muted-foreground">
                  Upload an image and we'll remove the background automatically
                </p>
              </div>
              <UploadArea
                onFileDrop={handleFileDrop}
                isLoading={isProcessing}
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
              {jobStatus && (
                <div className="flex items-center justify-between">
                  <JobStatusBadge status={jobStatus} />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              )}

              {isProcessing ? (
                <LoadingSkeleton variant="editor" className="flex-1" />
              ) : (
                <>
                  {/* Desktop toolbar — hidden on mobile */}
                  <div className="hidden md:block">
                    <EditorToolbar
                      activeTab={editor.activeTab}
                      onTabChange={editor.handleTabChange}
                      canUndo={editor.canUndo}
                      canRedo={editor.canRedo}
                      onUndo={editor.undo}
                      onRedo={editor.redo}
                      onDownload={editor.handleDownload}
                    />
                  </div>
                  <EditorCanvas
                    originalUrl={previewUrl}
                    resultUrl={editor.resultImageUrl}
                    zoom={editor.zoom}
                    isComparing={editor.isComparing}
                    onZoomIn={editor.handleZoomIn}
                    onZoomOut={editor.handleZoomOut}
                    onZoomReset={editor.handleZoomReset}
                  />
                  <EditorThumbnails
                    items={thumbnailItems}
                    activeId={isCompleted ? 'result' : 'original'}
                    onSelect={() => {}}
                  />
                  {/* Mobile bottom sheet */}
                  <MobileEditorSheet
                    activeTab={editor.activeTab}
                    onTabChange={editor.handleTabChange}
                    canUndo={editor.canUndo}
                    canRedo={editor.canRedo}
                    onUndo={editor.undo}
                    onRedo={editor.redo}
                    onDownload={editor.handleDownload}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
