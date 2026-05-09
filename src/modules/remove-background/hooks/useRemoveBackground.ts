'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { removeBackgroundApi } from '@/services/api/remove-background.api';
import { useUploadStore } from '@/store/upload.store';
import { validateImageFile, createImagePreviewUrl } from '@/utils/file.utils';
import { useEditorStore } from '@/store/editor.store';

export const useRemoveBackground = () => {
  const { setFile, setStatus, setJobId, setError } = useUploadStore();
  const resetEditor = useEditorStore((s) => s.reset);

  const mutation = useMutation({
    mutationFn: (file: File) => removeBackgroundApi.createJob(file),
    onMutate: (file) => {
      resetEditor();
      const previewUrl = createImagePreviewUrl(file);
      setFile(file, previewUrl);
      setStatus('uploading');
    },
    onSuccess: (job) => {
      setJobId(job.id);
      setStatus('success');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error('Failed to start job. Please try again.');
    },
  });

  const handleFileDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    mutation.mutate(file);
  };

  return {
    handleFileDrop,
    isPending: mutation.isPending,
  };
};
