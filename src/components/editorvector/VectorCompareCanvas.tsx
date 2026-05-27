"use client";
// vector compare canvas
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useZoomPan, type CanvasTool } from "./hooks/useZoomPan";
import { FabricVectorPane } from "./FabricVectorPane";
import { parseSvgMetadata } from "./lib/svg-utils";

const CHECKER =
  "[background-image:linear-gradient(45deg,#0000000d_25%,transparent_25%),linear-gradient(-45deg,#0000000d_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0000000d_75%),linear-gradient(-45deg,transparent_75%,#0000000d_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]";

export interface VectorCompareCanvasProps {
  originalUrl: string | null;
  svg: string | null;
  isLoading?: boolean;
  tool: CanvasTool;
  split?: boolean;
  showOutline?: boolean;
  onZoomChange?: (z: number) => void;
  onReady?: (api: { fit: () => void; zoomBy: (f: number) => void; setScale: (s: number) => void }) => void;
}

export function VectorCompareCanvas({
  originalUrl,
  svg,
  isLoading,
  tool,
  split = true,
  showOutline = false,
  onZoomChange,
  onReady,
}: VectorCompareCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale, x, y, zoomBy, setScale, fit, handlers, cursor, setTool } = useZoomPan(containerRef);

  useEffect(() => setTool(tool), [tool, setTool]);
  useEffect(() => onZoomChange?.(scale), [scale, onZoomChange]);
  useEffect(() => {
    onReady?.({ fit, zoomBy, setScale });
  }, [fit, zoomBy, setScale, onReady]);

  // Track a single pane's pixel size so we can compute one shared content rect.
  const [paneSize, setPaneSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const cols = split ? 2 : 1;
      setPaneSize({ w: el.clientWidth / cols, h: el.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [split]);

  // Probe original image natural dimensions — these are the canonical base
  // both panes align to, so the vector overlays the original 1:1 in display space.
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    if (!originalUrl) {
      setNatural(null);
      return;
    }
    const img = new Image();
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = originalUrl;
  }, [originalUrl]);

  const svgMeta = useMemo(() => parseSvgMetadata(svg), [svg]);

  const baseDims = useMemo(() => {
    if (natural && natural.w > 0 && natural.h > 0) return natural;
    if (svgMeta.width && svgMeta.height) return { w: svgMeta.width, h: svgMeta.height };
    return null;
  }, [natural, svgMeta.width, svgMeta.height]);

  // Object-contain fit into 90% × 80% of the pane (no upscale).
  const content = useMemo(() => {
    if (!baseDims || !paneSize.w || !paneSize.h) return { w: 0, h: 0 };
    const r = Math.min((paneSize.w * 0.9) / baseDims.w, (paneSize.h * 0.8) / baseDims.h, 1);
    return { w: baseDims.w * r, h: baseDims.h * r };
  }, [baseDims, paneSize]);

  return (
    <div
      ref={containerRef}
      {...handlers}
      style={{ cursor }}
      className={cn(
        "relative grid h-full w-full select-none overflow-hidden bg-muted/40",
        split ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {split && (
        <Pane
          label="Original Image"
          src={originalUrl}
          contentW={content.w}
          contentH={content.h}
          scale={scale}
          x={x}
          y={y}
        />
      )}
      <FabricVectorPane
        label="Vector Result"
        svg={svg}
        svgWidth={svgMeta.width}
        svgHeight={svgMeta.height}
        contentW={content.w}
        contentH={content.h}
        scale={scale}
        x={x}
        y={y}
        bordered={split}
        showOutline={showOutline}
      />

      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">AI is tracing your image…</p>
          </div>
        </div>
      )}

      {!isLoading && !originalUrl && !svg && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Upload an image to start</p>
        </div>
      )}
    </div>
  );
}

function Pane({
  label,
  src,
  contentW,
  contentH,
  scale,
  x,
  y,
  bordered,
}: {
  label: string;
  src: string | null;
  contentW: number;
  contentH: number;
  scale: number;
  x: number;
  y: number;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        CHECKER,
        bordered && "border-l border-border/60"
      )}
    >
      <div className="pointer-events-none absolute left-3 top-3 z-10">
        <div className="rounded-full bg-background/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/70 shadow-sm ring-1 ring-border/60 backdrop-blur-md">
          {label}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {src && contentW > 0 ? (
          <motion.img
            src={src}
            alt={label}
            draggable={false}
            animate={{ x, y, scale }}
            transition={{ type: "tween", duration: 0 }}
            style={{
              transformOrigin: "center",
              width: contentW,
              height: contentH,
            }}
            className="shadow-2xl ring-1 ring-border/40"
          />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}
