'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCompare } from '@/components/shared/ImageCompare';
import { cn } from '@/lib/utils';

interface EditorCanvasProps {
  originalUrl: string | null;
  resultUrl: string | null;
  zoom: number;
  isComparing: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

const CHECKER_BG = `
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%)
`;

export function EditorCanvas({
  originalUrl,
  resultUrl,
  zoom,
  isComparing,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: EditorCanvasProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const displayUrl = resultUrl ?? originalUrl;

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden"
      style={{
        backgroundImage: CHECKER_BG,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
        backgroundColor: '#f0f0f0',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {displayUrl ? (
        isComparing && originalUrl && resultUrl ? (
          <motion.div
            animate={{ x: offset.x, y: offset.y, scale: zoom }}
            className="max-h-[80%] max-w-[80%] rounded-[20px] shadow-2xl overflow-hidden"
          >
            <ImageCompare originalUrl={originalUrl} resultUrl={resultUrl} className="h-full w-full" />
          </motion.div>
        ) : (
          <motion.div
            animate={{ x: offset.x, y: offset.y, scale: zoom }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-h-[80%] max-w-[80%] cursor-grab rounded-[20px] shadow-2xl active:cursor-grabbing overflow-hidden"
            onMouseDown={handleMouseDown}
          >
            <img
              src={displayUrl}
              alt="Preview"
              className="block max-h-[70vh] max-w-full rounded-[20px] object-contain"
              draggable={false}
            />
          </motion.div>
        )
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No image loaded</p>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 rounded-xl bg-card p-1 shadow-sm ring-1 ring-border">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs tabular-nums"
          onClick={onZoomReset}
        >
          {Math.round(zoom * 100)}%
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Compare toggle hint */}
      <div className="absolute bottom-4 left-4">
        <span className="rounded-full bg-card/80 px-3 py-1 text-xs text-muted-foreground shadow-sm ring-1 ring-border backdrop-blur">
          {isComparing ? 'Comparing' : 'Drag to pan • Scroll to zoom'}
        </span>
      </div>
    </div>
  );
}
