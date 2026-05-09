'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageCompareProps {
  originalUrl: string;
  resultUrl: string;
  className?: string;
}

export function ImageCompare({ originalUrl, resultUrl, className }: ImageCompareProps) {
  const [sliderX, setSliderX] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderX(Math.max(0, Math.min(100, x)));
  }, []);

  const handleMouseDown = useCallback(() => { isDragging.current = true; }, []);
  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging.current) updateSlider(e.clientX);
  }, [updateSlider]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-2xl cursor-col-resize select-none', className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* Result image (full) */}
      <img src={resultUrl} alt="Result" className="h-full w-full object-contain" />

      {/* Original image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderX}%` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="h-full w-full object-contain"
          style={{ width: `${100 / (sliderX / 100)}%` }}
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute inset-y-0 flex items-center justify-center"
        style={{ left: `${sliderX}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="w-0.5 h-full bg-white/80 shadow-md" />
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <span className="text-xs font-bold text-foreground">⟺</span>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3">
        <span className="rounded-md bg-black/50 px-2 py-1 text-xs text-white">Original</span>
      </div>
      <div className="absolute bottom-3 right-3">
        <span className="rounded-md bg-black/50 px-2 py-1 text-xs text-white">Result</span>
      </div>
    </div>
  );
}
