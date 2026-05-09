'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/constants/config';

interface UploadAreaProps {
  onFileDrop: (files: File[]) => void;
  isLoading?: boolean;
  className?: string;
  description?: string;
}

export function UploadArea({
  onFileDrop,
  isLoading = false,
  className,
  description = 'Drop your image here, or click to browse',
}: UploadAreaProps) {
  const onDrop = useCallback((files: File[]) => onFileDrop(files), [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: APP_CONFIG.MAX_FILE_SIZE_BYTES,
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed',
        'min-h-[280px] cursor-pointer transition-all duration-200',
        isDragActive
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30',
        isLoading && 'pointer-events-none opacity-60',
        className
      )}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {isDragActive ? (
          <motion.div
            key="drag"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-3 text-primary"
          >
            <Upload className="h-12 w-12" />
            <p className="text-lg font-medium">Drop your image here</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 px-6 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{description}</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP up to {APP_CONFIG.MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
