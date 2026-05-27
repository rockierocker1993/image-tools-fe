"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CanvasTool = "select" | "pan";

export interface ZoomPanState {
  scale: number;
  x: number;
  y: number;
}

interface UseZoomPanOptions {
  minScale?: number;
  maxScale?: number;
  initial?: Partial<ZoomPanState>;
}

/**
 * Provides shared zoom + pan state for the vector comparison canvas.
 * - Mouse wheel zooms toward the cursor.
 * - Spacebar (or `pan` tool) enables drag-to-pan.
 */
export function useZoomPan(
  containerRef: React.RefObject<HTMLElement | null>,
  { minScale = 0.1, maxScale = 8, initial }: UseZoomPanOptions = {}
) {
  const [state, setState] = useState<ZoomPanState>({
    scale: initial?.scale ?? 1,
    x: initial?.x ?? 0,
    y: initial?.y ?? 0,
  });
  const [tool, setTool] = useState<CanvasTool>("select");
  const [isSpaceHeld, setIsSpaceHeld] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  const isPanning = tool === "pan" || isSpaceHeld;

  const zoomBy = useCallback(
    (factor: number, focal?: { x: number; y: number }) => {
      setState((prev) => {
        const next = Math.max(minScale, Math.min(maxScale, prev.scale * factor));
        if (next === prev.scale) return prev;
        if (!focal) return { ...prev, scale: next };
        // Keep the focal point steady while zooming.
        const ratio = next / prev.scale;
        return {
          scale: next,
          x: focal.x - (focal.x - prev.x) * ratio,
          y: focal.y - (focal.y - prev.y) * ratio,
        };
      });
    },
    [maxScale, minScale]
  );

  const reset = useCallback(() => setState({ scale: 1, x: 0, y: 0 }), []);

  const fit = useCallback(() => setState({ scale: 1, x: 0, y: 0 }), []);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 50) return;
      e.preventDefault();
      // Center-anchored zoom — matches the toolbar +/- buttons so behaviour is
      // consistent regardless of cursor position.
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      zoomBy(factor);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [containerRef, zoomBy]);

  // Spacebar pan
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
        e.preventDefault();
        setIsSpaceHeld(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpaceHeld(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Drag handlers (attach via spread on container)
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      e.preventDefault();
      setIsDragging(true);
      dragOrigin.current = { x: e.clientX, y: e.clientY, startX: state.x, startY: state.y };
    },
    [isPanning, state.x, state.y]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const origin = dragOrigin.current;
      if (!isDragging || !origin) return;
      const dx = e.clientX - origin.x;
      const dy = e.clientY - origin.y;
      setState((prev) => ({ ...prev, x: origin.startX + dx, y: origin.startY + dy }));
    },
    [isDragging]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragOrigin.current = null;
  }, []);

  return {
    ...state,
    tool,
    setTool,
    isPanning,
    isDragging,
    zoomBy,
    setScale: (scale: number) => setState((p) => ({ ...p, scale: Math.max(minScale, Math.min(maxScale, scale)) })),
    reset,
    fit,
    handlers: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp },
    cursor: isDragging ? "grabbing" : isPanning ? "grab" : "default",
  };
}
