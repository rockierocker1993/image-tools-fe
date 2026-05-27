"use client";

import type { TraceSvgRegion } from "@/types/job.types";

/**
 * In-memory region with a `copy_color` override.
 * When `copy_color` is set, every path in `element_ids` is repainted with
 * that color; clearing it restores the original `color`.
 */
export interface EditableRegion extends TraceSvgRegion {
  copy_color?: string | null;
  children?: EditableRegion[]; // For drag-nest, max 1 child
}

const HIGHLIGHT_COLOR = "#22d3ee";

/**
 * Build an "edited" version of the original SVG by applying the current
 * region overrides:
 *   1. Drop elements for regions beyond `visibleCount` (palette truncation).
 *   2. Replace fill on every region that has a `copy_color`.
 *   3. Add a stroke on the elements of `highlightedRegionId` for visual feedback.
 *
 * Returns the original SVG unchanged if no edits apply or the parse fails.
 */
export function deriveEditedSvg(
  baseSvg: string | null,
  regions: EditableRegion[] | null,
  visibleCount: number,
  highlightedRegionId: string | null
): string | null {
  if (!baseSvg) return baseSvg;
  if (!regions || regions.length === 0) return baseSvg;

  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(baseSvg, "image/svg+xml");
  } catch {
    return baseSvg;
  }
  if (doc.documentElement.nodeName === "parsererror") return baseSvg;

  const visible = regions.slice(0, Math.max(0, visibleCount));
  const hidden = regions.slice(Math.max(0, visibleCount));

  // 1. Remove hidden regions' elements.
  const firstEl = doc.getElementById(visible[0].element_ids[0]);
  for (const r of hidden) {
    for (const id of r.element_ids) {
      const el = doc.getElementById(id);
      if (el) el.setAttribute("fill", firstEl?.getAttribute("fill") || "transparent"); // hide by matching the first visible region's fill (or transparent if none)
    }
  }

  // 2. Apply copy_color on visible regions.
  for (const r of visible) {
    if (r.copy_color) {
      for (const id of r.element_ids) {
        const el = doc.getElementById(id);
        if (el) el.setAttribute("fill", r.copy_color);
      }
    }
  }

  // 3. Highlight stroke (non-scaling so it stays crisp at any zoom).
  if (highlightedRegionId) {
    const r = visible.find((x) => x.id === highlightedRegionId);
    if (r) {
      for (const id of r.element_ids) {
        const el = doc.getElementById(id);
        if (el) {
          el.setAttribute("stroke", HIGHLIGHT_COLOR);
          el.setAttribute("stroke-width", "3");
          el.setAttribute("vector-effect", "non-scaling-stroke");
        }
      }
    }
  }

  return new XMLSerializer().serializeToString(doc);
}

/** Resolve the displayed color for a region (override wins). */
export function regionDisplayColor(r: EditableRegion, ignoreCopyColor = false): string {
  return !ignoreCopyColor && r.copy_color ? r.copy_color : r.color;
}
