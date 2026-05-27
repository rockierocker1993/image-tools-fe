"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { TraceSvgRegion } from "@/types/job.types";
import { VectorEditorToolbar } from "./VectorEditorToolbar";
import { VectorCompareCanvas } from "./VectorCompareCanvas";
import { VectorEditorSidebar } from "./editorsidebar/VectorEditorSidebar";
import { parseSvgMetadata } from "./lib/svg-utils";
import { deriveEditedSvg, type EditableRegion } from "./lib/svg-edit";

export interface VectorEditorOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    originalUrl: string | null;
    svg: string | null;
    regions?: TraceSvgRegion[] | null;
    filename?: string | null;
    isLoading?: boolean;
    onUpload?: () => void;
    /** Called with the final edited SVG when the user clicks Save. */
    onSave?: (svg: string | null, regions: EditableRegion[]) => void;
    onDownloadSvg: () => void;
    onDownloadAs?: (format: "svg" | "png" | "pdf") => void;
}

export function VectorEditorOverlay({
    open,
    onOpenChange,
    originalUrl,
    svg,
    regions,
    filename,
    isLoading,
    onSave,
}: VectorEditorOverlayProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [split, setSplit] = useState(true);
    const [showOutline, setShowOutline] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [renderMs, setRenderMs] = useState<number | null>(null);
    const canvasApi = useRef<{ fit: () => void; zoomBy: (f: number) => void; setScale: (s: number) => void } | null>(null);

    // Editable region state — seeded from props whenever a new SVG/regions arrive.
    const [editRegions, setEditRegions] = useState<EditableRegion[]>([]);
    const [baseEditRegions, setBaseEditRegions] = useState<EditableRegion[]>([]);
    const [visibleCount, setVisibleCount] = useState(0);
    const [highlightedRegionId, setHighlightedRegionId] = useState<string | null>(null);

    // Reset editing state when the source SVG or regions change.
    useEffect(() => {
        const seed: EditableRegion[] = (regions ?? []).map((r) => ({ ...r, copy_color: null }));
        setEditRegions(seed);
        setBaseEditRegions(seed);
        setVisibleCount(seed.length);
        setHighlightedRegionId(null);
    }, [svg, regions]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onOpenChange]);

    useEffect(() => {
        const seed: EditableRegion[] = (regions ?? []).map((r) => ({ ...r, copy_color: null }));
        setEditRegions(seed.slice(0, visibleCount));
    }, [visibleCount]);

    // Apply region edits to produce the SVG actually rendered in the canvas.
    const displayedSvg = useMemo(
        () => { // Ensure edits are only applied to visible regions.
            return deriveEditedSvg(svg, baseEditRegions, visibleCount, highlightedRegionId)
        }
        ,
        [svg, baseEditRegions, editRegions, highlightedRegionId]
    );
    
    // Measure render time once SVG is parsed/painted.
    useEffect(() => {
        if (!displayedSvg) {
            setRenderMs(null);
            return;
        }
        const start = performance.now();
        requestAnimationFrame(() => setRenderMs(performance.now() - start));
    }, [displayedSvg]);

    const metadata = useMemo(() => parseSvgMetadata(displayedSvg), [displayedSvg]);

    const handleSave = useCallback(() => {
        onSave?.(displayedSvg, editRegions);
        toast.success("Changes saved");
        onOpenChange(false);
    }, [onSave, displayedSvg, editRegions, onOpenChange]);

    const handleCopyColor = useCallback((regionId: string, targetColor: string | null) => {
        setEditRegions((prev) =>
            prev.map((r) => (r.id === regionId ? { ...r, copy_color: targetColor } : r))
        );
    }, []);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="vector-editor-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="light fixed inset-0 z-50 bg-background text-foreground"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Vector Editor"
                    data-theme="light"
                    style={{ colorScheme: "light" }}
                >
                    <TooltipProvider>
                        <div className="flex h-full w-full flex-col">
                            <VectorEditorToolbar
                                zoom={zoom}
                                onZoomIn={() => canvasApi.current?.zoomBy(1.2)}
                                onZoomOut={() => canvasApi.current?.zoomBy(1 / 1.2)}
                                onFit={() => canvasApi.current?.fit()}
                                sidebarOpen={sidebarOpen}
                                onToggleSidebar={() => setSidebarOpen((v) => !v)}
                                split={split}
                                onToggleSplit={() => setSplit((v) => !v)}
                                showOutline={showOutline}
                                onToggleOutline={() => setShowOutline((v) => !v)}
                                canUndo={false}
                                canRedo={false}
                                onUndo={() => { }}
                                onRedo={() => { }}
                                onSave={handleSave}
                                onClose={() => onOpenChange(false)}
                            />

                            <div className="flex flex-1 min-h-0">
                                <div className="relative flex-1 min-w-0">
                                    <VectorCompareCanvas
                                        originalUrl={originalUrl}
                                        svg={displayedSvg}
                                        isLoading={isLoading}
                                        tool="pan"
                                        split={split}
                                        showOutline={showOutline}
                                        onZoomChange={setZoom}
                                        onReady={(api) => (canvasApi.current = api)}
                                    />
                                </div>

                                <VectorEditorSidebar
                                    open={sidebarOpen}
                                    regions={editRegions}
                                    baseRegions={regions ?? []}
                                    visibleCount={visibleCount}
                                    highlightedRegionId={highlightedRegionId}
                                    onHighlight={setHighlightedRegionId}
                                    onCopyColor={handleCopyColor}
                                    onSetVisibleCount={setVisibleCount}
                                />
                            </div>
                        </div>
                    </TooltipProvider>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
