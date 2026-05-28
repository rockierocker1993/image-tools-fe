"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, GitMerge, Split, Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type EditableRegion } from "../lib/svg-edit";
import { RegionBubbles } from "./RegionBubbles";
import { PalettePresets } from "./PalettePresets";

export interface VectorEditorSidebarProps {
    open: boolean;
    regions: EditableRegion[];
    baseRegions: EditableRegion[];
    visibleCount: number;
    highlightedRegionId: string | null;
    onHighlight: (id: string | null) => void;
    /** Copy `targetColor` onto `regionId`. Pass null to revert. */
    onSetVisibleCount: (n: number) => void;
    onSetEditRegions: (editableRegions: EditableRegion[]) => void;
}

/** Sidebar shown to the right of the canvas — region circles + palette presets. */
export function VectorEditorSidebar({
    open,
    regions,
    baseRegions,
    visibleCount,
    highlightedRegionId,
    onHighlight,
    onSetVisibleCount,
    onSetEditRegions,
}: VectorEditorSidebarProps) {
    return (
        <AnimatePresence initial={false}>
            {open && (
                <motion.aside
                    key="sidebar"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 360, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="relative h-full shrink-0 overflow-hidden border-l border-border/60 bg-card/60 backdrop-blur-md"
                >
                    <div className="flex h-full w-[360px] flex-col">
                        <ScrollArea className="flex-1 min-h-0">
                            <div className="p-4">
                                <RegionBubbles
                                    regions={regions}
                                    highlightedRegionId={highlightedRegionId}
                                    onHighlight={onHighlight}
                                    onSetEditRegions={onSetEditRegions}
                                />
                            </div>

                            <Separator />

                            <ActionsRow />
                        </ScrollArea>
                        <Separator />
                        <div className="shrink-0 p-4">
                            <h3 className="mb-3 text-sm font-semibold text-foreground/90">
                                Palette Presets{" "}
                                <span className="text-xs font-normal text-muted-foreground">
                                    (by number of colors)
                                </span>
                            </h3>
                            <PalettePresets
                                regions={baseRegions}
                                visibleCount={visibleCount}
                                onSetVisibleCount={onSetVisibleCount}
                            />
                        </div>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

function ActionsRow() {
    return (
        <div className="flex items-center justify-around gap-2 px-4 py-3 text-[11px] text-muted-foreground">
            <Action icon={<ArrowLeftRight className="h-4 w-4" />} label="Original ↔ Output" />
            <Action icon={<GitMerge className="h-4 w-4 rotate-90" />} label="Merge" />
            <Action icon={<Split className="h-4 w-4" />} label="Split" />
            <Action icon={<Wand2 className="h-4 w-4" />} label="Edit" />
        </div>
    );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1 text-primary/80">
            <div className="text-primary">{icon}</div>
            <span className="text-[10px] font-medium">{label}</span>
        </div>
    );
}
