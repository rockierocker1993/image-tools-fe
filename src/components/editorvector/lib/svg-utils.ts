"use client";

/**
 * Lightweight metadata utilities for SVG strings.
 * Avoids parsing in-place; uses a cached DOMParser per call.
 */

export interface SvgMetadata {
  width: number | null;
  height: number | null;
  viewBox: string | null;
  nodeCount: number;
  pathCount: number;
  byteSize: number;
}

export function parseSvgMetadata(svg: string | null | undefined): SvgMetadata {
  if (!svg) {
    return { width: null, height: null, viewBox: null, nodeCount: 0, pathCount: 0, byteSize: 0 };
  }
  const byteSize = new Blob([svg]).size;
  try {
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    const root = doc.documentElement;
    if (root.nodeName === "parsererror") {
      return { width: null, height: null, viewBox: null, nodeCount: 0, pathCount: 0, byteSize };
    }
    const widthAttr = root.getAttribute("width");
    const heightAttr = root.getAttribute("height");
    const viewBox = root.getAttribute("viewBox");
    let vbW: number | null = null;
    let vbH: number | null = null;
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
        vbW = parts[2];
        vbH = parts[3];
      }
    }
    const width = parseFloat(widthAttr ?? "") || vbW;
    const height = parseFloat(heightAttr ?? "") || vbH;
    const all = root.getElementsByTagName("*");
    const paths = root.getElementsByTagName("path");
    return {
      width: width ?? null,
      height: height ?? null,
      viewBox,
      nodeCount: all.length,
      pathCount: paths.length,
      byteSize,
    };
  } catch {
    return { width: null, height: null, viewBox: null, nodeCount: 0, pathCount: 0, byteSize };
  }
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}
