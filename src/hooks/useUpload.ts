'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useUploadStore } from '@/store/upload.store';
import { validateImageFile, createImagePreviewUrl } from '@/utils/file.utils';

interface UseUploadOptions {
  onUpload: (file: File) => Promise<string>;
}

export const useUpload = ({ onUpload }: UseUploadOptions) => {
  const { setFile, setStatus, setProgress, setError, setJobId, reset } = useUploadStore();

  const handleFileSelect = useCallback(
    async (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      const previewUrl = createImagePreviewUrl(file);
      setFile(file, previewUrl);
      setStatus('uploading');
      setProgress(0);

      try {
        const jobId = await onUpload(file);
        setJobId(jobId);
        setStatus('success');
        setProgress(100);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed.';
        setError(message);
        toast.error(message);
      }
    },
    [onUpload, setFile, setStatus, setProgress, setError, setJobId]
  );

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  return { handleFileSelect, handleDrop, reset };
};
