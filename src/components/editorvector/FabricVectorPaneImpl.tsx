"use client";

import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { cn } from "@/lib/utils";

const CHECKER =
  "[background-image:linear-gradient(45deg,#0000000d_25%,transparent_25%),linear-gradient(-45deg,#0000000d_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0000000d_75%),linear-gradient(-45deg,transparent_75%,#0000000d_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]";

export interface FabricVectorPaneImplProps {
  svg: string | null;
  /** Authoritative SVG viewBox dims (from parseSvgMetadata) — drives centering math. */
  svgWidth: number | null;
  svgHeight: number | null;
  scale: number;
  x: number;
  y: number;
  /** Shared object-contain rect (px) at scale=1 — matches the Original pane's <img> size. */
  contentW: number;
  contentH: number;
  label: string;
  bordered?: boolean;
  /** When true, overlays cyan stroked clones of every SVG path on top of the
   *  filled rendering — gives the user a visual map of all editable paths. */
  showOutline?: boolean;
}

export function FabricVectorPaneImpl({
  svg,
  svgWidth,
  svgHeight,
  scale,
  x,
  y,
  contentW,
  contentH,
  label,
  bordered,
  showOutline = false,
}: FabricVectorPaneImplProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const baseDimRef = useRef<{ w: number; h: number } | null>(null);
  const outlineGroupRef = useRef<fabric.Object | null>(null);
  const stateRef = useRef({ scale, x, y, contentW, contentH });
  stateRef.current = { scale, x, y, contentW, contentH };

  const applyTransform = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const cw = canvas.getWidth();
    const ch = canvas.getHeight();
    const base = baseDimRef.current;
    const { scale: s, x: tx, y: ty, contentW: contW, contentH: contH } = stateRef.current;
    if (!base || contW <= 0 || contH <= 0) {
      canvas.setViewportTransform([s, 0, 0, s, cw / 2 + tx, ch / 2 + ty]);
      canvas.requestRenderAll();
      return;
    }
    // object-contain the SVG viewBox into the shared content rect.
    const z = Math.min(contW / base.w, contH / base.h) * s;
    // Map SVG (0,0)..(vbW, vbH) so viewBox center lands at pane center + pan offset.
    const vx = cw / 2 - (base.w / 2) * z + tx;
    const vy = ch / 2 - (base.h / 2) * z + ty;
    canvas.setViewportTransform([z, 0, 0, z, vx, vy]);
    canvas.requestRenderAll();
  };

  // Init canvas + resize observer
  useEffect(() => {
    if (!canvasElRef.current || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const canvas = new fabric.Canvas(canvasElRef.current, {
      selection: false,
      preserveObjectStacking: true,
      backgroundColor: "transparent",
      enableRetinaScaling: true,
      width: Math.max(1, wrapper.clientWidth),
      height: Math.max(1, wrapper.clientHeight),
      renderOnAddRemove: true,
    });
    fabricRef.current = canvas;

    const ro = new ResizeObserver(() => {
      if (!fabricRef.current) return;
      fabricRef.current.setDimensions({
        width: Math.max(1, wrapper.clientWidth),
        height: Math.max(1, wrapper.clientHeight),
      });
      applyTransform();
    });
    ro.observe(wrapper);

    applyTransform();

    return () => {
      ro.disconnect();
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load SVG into canvas (each path becomes a fabric object, ready to be made selectable)
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.remove(...canvas.getObjects());
    baseDimRef.current = null;
    outlineGroupRef.current = null;
    if (!svg) {
      canvas.requestRenderAll();
      return;
    }
    // Authoritative viewBox dims come from the parent (parseSvgMetadata). We do NOT
    // rely on fabric's parsed options or the group bbox, because content may not fill
    // the entire viewBox — using bbox would mis-center vs. the original image.
    const vbW = svgWidth && svgWidth > 0 ? svgWidth : null;
    const vbH = svgHeight && svgHeight > 0 ? svgHeight : null;

    let cancelled = false;
    fabric
      .loadSVGFromString(svg)
      .then((result) => {
        if (cancelled || !fabricRef.current) return;
        const objects = (result.objects ?? []).filter(
          (o): o is fabric.FabricObject => !!o
        );
        if (objects.length === 0) {
          canvas.requestRenderAll();
          return;
        }
        const group = fabric.util.groupSVGElements(
          objects,
          result.options as Record<string, unknown>
        );
        // Use the viewBox as the canonical base — falls back to options/group bbox
        // if no explicit viewBox was provided in the source SVG.
        const w =
          vbW ?? Number(result.options?.width ?? group.width ?? 1);
        const h =
          vbH ?? Number(result.options?.height ?? group.height ?? 1);
        baseDimRef.current = { w, h };
        // Important: do NOT translate the group. Its coordinates are already in
        // SVG space (0..vbW, 0..vbH). Centering is handled by viewportTransform
        // in applyTransform(), which maps the viewBox center to the pane center.
        group.set({
          // Editing disabled for now (tool === "pan" only). Flip these to true
          // when a "select" tool is reintroduced to make paths editable.
          selectable: false,
          evented: false,
        });
        canvas.add(group);
        applyTransform();
      })
      .catch(() => {
        /* ignore parse errors */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svg, svgWidth, svgHeight]);

  // Outline overlay: re-parses the SVG fresh and stacks a cyan stroked copy
  // on top of the filled rendering. We re-parse (instead of cloning the source
  // objects) because `groupSVGElements` mutates the input objects' coordinates,
  // which makes naive clones drift.
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    if (outlineGroupRef.current) {
      canvas.remove(outlineGroupRef.current);
      outlineGroupRef.current = null;
      canvas.requestRenderAll();
    }
    if (!showOutline || !svg) return;

    let cancelled = false;
    fabric
      .loadSVGFromString(svg)
      .then((result) => {
        if (cancelled || !fabricRef.current) return;
        const objects = (result.objects ?? []).filter(
          (o): o is fabric.FabricObject => !!o
        );
        if (objects.length === 0) return;
        objects.forEach((o) => {
          o.set({
            fill: "transparent",
            stroke: "#22d3ee",
            strokeWidth: 2,
            strokeUniform: true,
            selectable: false,
            evented: false,
            opacity: 1,
            shadow: new fabric.Shadow({
              color: "rgba(34, 211, 238, 0.9)",
              blur: 4,
              offsetX: 0,
              offsetY: 0,
            }),
          });
        });
        const overlay = fabric.util.groupSVGElements(
          objects,
          (result.options ?? {}) as Record<string, unknown>
        );
        overlay.set({ selectable: false, evented: false });
        outlineGroupRef.current = overlay;
        fabricRef.current.add(overlay);
        fabricRef.current.requestRenderAll();
      })
      .catch(() => {
        /* ignore parse errors */
      });

    return () => {
      cancelled = true;
    };
  }, [showOutline, svg]);

  // Sync transform from parent (driven by useZoomPan in VectorCompareCanvas)
  useEffect(() => {
    applyTransform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, x, y, contentW, contentH]);

  return (
    <div
      ref={wrapperRef}
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
      {/* pointer-events: none so wheel/drag bubble to the parent container handlers
          (kept in sync with the Original pane). When a "select" tool is added later,
          set this to "auto" + flip object.selectable/evented to enable editing. */}
      <div className="absolute inset-0 pointer-events-none">
        <canvas ref={canvasElRef} />
      </div>
      {!svg && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">—</span>
        </div>
      )}
    </div>
  );
}
