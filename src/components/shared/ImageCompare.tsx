'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CHECKER_BG = `
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%)
`;

interface ImageCompareProps {
  originalUrl: string;
  resultUrl: string;
  className?: string;
  /** Animate slider from 100%→50% on mount to reveal the result */
  autoPlay?: boolean;
  minHeight?: string;
  maxHeight?: string;
  /** Applied solid color background (null = transparent/checkerboard) */
  bgColor?: string | null;
  /** Applied image background URL */
  bgImageUrl?: string | null;
}

export function ImageCompare({ originalUrl, resultUrl, className, autoPlay, minHeight, maxHeight, bgColor, bgImageUrl }: ImageCompareProps) {
  const [sliderX, setSliderX] = useState(autoPlay ? 100 : 50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Animate 100 → 50 on mount, revealing the result from right to left
  useEffect(() => {
    if (!autoPlay) return;
    const startTime = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setSliderX(100 - 50 * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    const timerId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 250);

    return () => {
      clearTimeout(timerId);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [autoPlay]);

  const updateSlider = useCallback((clientX: number) => {
    // Cancel auto-play if user starts dragging
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSliderX(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging.current) updateSlider(e.clientX);
  }, [updateSlider]);

  const stopDrag = useCallback(() => { isDragging.current = false; }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-[20px] shadow-2xl select-none', className)}
      style={{
        // If a background is applied, replace checkerboard with it
        ...(bgImageUrl
          ? {
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : bgColor
          ? { backgroundColor: bgColor, backgroundImage: 'none' }
          : {
              backgroundImage: CHECKER_BG,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              backgroundColor: '#f0f0f0',
            }),
        cursor: 'col-resize',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDrag}
    >
      {/* Result image — base layer (shows transparent/checkerboard bg) */}
      <img
        src={resultUrl}
        alt="After"
        className="block max-h-[70vh] max-w-full object-contain"
        draggable={false}
        style={{ minHeight: minHeight, maxHeight: maxHeight }}
      />

      {/* Original image — clipped to left side of slider */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
      >
        <img
          src={originalUrl}
          alt="Before"
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          style={{ minHeight: minHeight, maxHeight: maxHeight }}
        />
      </div>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.45)]"
        style={{ left: `${sliderX}%`, transform: 'translateX(-50%)' }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-col-resize touch-none"
        style={{ left: `${sliderX}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800/90 shadow-xl ring-2 ring-white/25 transition-transform hover:scale-110">
          <ChevronLeft className="h-3.5 w-3.5 text-white" />
          <ChevronRight className="h-3.5 w-3.5 text-white" />
        </div>
      </div>

      {/* Labels */}
      <div className="pointer-events-none absolute bottom-3 left-3">
        <span className="rounded bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          Before
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3">
        <span className="rounded bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          After
        </span>
      </div>
    </div>
  );
}
