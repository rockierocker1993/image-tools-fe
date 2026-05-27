"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { type EditableRegion, regionDisplayColor } from "@/components/editorvector/lib/svg-edit";

export interface RegionBubblesProps {
    regions: EditableRegion[];
    highlightedRegionId: string | null;
    onHighlight: (id: string | null) => void;
    onUpdateColor: (regionId: string, targetColor: string | null) => void;
}
export function RegionBubbles({ regions, highlightedRegionId, onHighlight, onUpdateColor }: RegionBubblesProps) {

    const [dragId, setDragId] = useState<string | null>(null);
    const [hoverTargetId, setHoverTargetId] = useState<string | null>(null);
    const [editRegions, setEditRegions] = useState<EditableRegion[]>(regions);
    useEffect(() => {
        setEditRegions(structuredClone(regions));
    }, [regions]);
    function getParentRegion(list: EditableRegion[], id: string): EditableRegion | null {
        for (const region of list) {
            if (region.children?.some(child => child.id === id)) {
                return region;
            }
            const parent = region.children ? getParentRegion(region.children, id) : null;
            if (parent) {
                return parent;
            }
        }
        return null;
    }

    function addChildToRegion(list: EditableRegion[], targetDropId: string, sourceDropId: string): EditableRegion[] {
        let parentOfTarget: EditableRegion | null = null;
        if (targetDropId !== "root") {
            parentOfTarget = getParentRegion(list, targetDropId);
            targetDropId = parentOfTarget ? parentOfTarget.id : targetDropId;
        }
        if (targetDropId === sourceDropId) {
            return list;
        }

        let sourceRegion: EditableRegion | null = null;

        // remove source dari semua level
        function detach(regions: EditableRegion[]): EditableRegion[] {
            const result: EditableRegion[] = [];
            for (const region of regions) {
                if (region.id === sourceDropId) {
                    sourceRegion = region;
                    continue;
                }
                result.push({
                    ...region,
                    children: region.children
                        ? detach(region.children)
                        : []
                });
            }
            return result;
        }

        const cleaned = detach(list);

        if (!sourceRegion) {
            return list;
        }
        const regionToMove: EditableRegion = sourceRegion;
        // =========================
        // MOVE TO ROOT
        // =========================

        if (targetDropId === "root") {
            return [
                ...cleaned,
                // children source jadi root
                ...(regionToMove.children || []),
                // source jadi root tanpa children
                {
                    ...regionToMove,
                    children: []
                }
            ];
        }

        // =========================
        // ATTACH TO TARGET
        // =========================

        function attach(
            regions: EditableRegion[]
        ): EditableRegion[] {

            return regions.map(region => {

                if (region.id !== targetDropId) {

                    return {
                        ...region,
                        children: region.children
                            ? attach(region.children)
                            : []
                    };
                }

                const children = [
                    ...(region.children || [])
                ];

                // source children dipindah
                if (regionToMove.children?.length) {

                    for (const child of regionToMove.children) {

                        if (!children.some(c => c.id === child.id)) {
                            children.push(child);
                        }
                    }
                }

                // source juga jadi child
                if (!children.some(c => c.id === regionToMove!.id)) {

                    children.push({
                        ...regionToMove,
                        children: []
                    });
                }

                return {
                    ...region,
                    children
                };
            });
        }

        return attach(cleaned);
    }

    // =========================
    // SIZE
    // =========================

    const visible = editRegions;

    const maxSize = useMemo(() => {
        let m = 1;
        for (const r of visible) {
            m = Math.max(m, r.element_ids.length);
        }
        return m;
    }, [visible]);

    const sizeFor = (r: EditableRegion) => {
        const min = 26;
        const max = 84;
        const ratio = Math.sqrt(r.element_ids.length / maxSize);
        return Math.round(
            min + (max - min) * ratio
        );
    };

    // =========================
    // RENDER
    // =========================

    function renderRegion(
        r: EditableRegion,
        parentSize?: number
    ) {

        let size = parentSize
            ? Math.round(parentSize * 0.42)
            : sizeFor(r);

        const fill = regionDisplayColor(
            r,
            !!parentSize
        );

        const isHighlighted =
            highlightedRegionId === r.id;

        const isDragging =
            dragId === r.id;

        const isHover =
            hoverTargetId === r.id &&
            dragId &&
            dragId !== r.id;

        // =========================
        // CHILD POSITIONS
        // =========================

        const childCount =
            r.children?.length || 0;

        const childSize =
            Math.round(size * 0.42);

        const childRadius =
            (size - childSize) / 2 - 4;

        const childTransforms =
            Array.from({
                length: childCount
            }).map((_, i) => {

                const angle =
                    (2 * Math.PI * i) / childCount
                    - Math.PI / 2;

                return {
                    x:
                        size / 2 +
                        childRadius * Math.cos(angle)
                        - childSize / 2,

                    y:
                        size / 2 +
                        childRadius * Math.sin(angle)
                        - childSize / 2,
                };
            });

        return (
            <div
                key={r.id}
                style={{
                    position: "relative",
                    width: size,
                    height: size,
                }}
            >

                <button
                    type="button"
                    draggable

                    onClick={() => {
                        onHighlight(
                            isHighlighted
                                ? null
                                : r.id
                        );
                    }}

                    onDragStart={(e) => {

                        e.stopPropagation();

                        setDragId(r.id);

                        e.dataTransfer.setData(
                            "regionId",
                            r.id
                        );

                        e.dataTransfer.effectAllowed =
                            "move";
                    }}

                    onDragOver={(e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        if (dragId !== r.id) {
                            const parentOfTarget = getParentRegion(editRegions, r.id);
                            setHoverTargetId(parentOfTarget ? parentOfTarget.id : r.id);
                        }

                        e.dataTransfer.dropEffect =
                            "move";
                    }}

                    onDragLeave={(e) => {

                        e.stopPropagation();

                        const related =
                            e.relatedTarget as HTMLElement | null;

                        if (
                            related &&
                            e.currentTarget.contains(related)
                        ) {
                            return;
                        }

                        setHoverTargetId(prev =>
                            prev === r.id
                                ? null
                                : prev
                        );
                    }}

                    onDrop={(e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        const sourceId =
                            e.dataTransfer.getData(
                                "regionId"
                            );

                        setHoverTargetId(null);
                        setDragId(null);

                        if (
                            !sourceId ||
                            sourceId === r.id
                        ) {
                            return;
                        }

                        setEditRegions(prev =>
                            addChildToRegion(
                                prev,
                                r.id,
                                sourceId
                            )
                        );
                    }}

                    onDragEnd={() => {

                        setDragId(null);
                        setHoverTargetId(null);
                    }}

                    className={cn(
                        "relative rounded-full shadow-md transition-all",
                        "hover:scale-105 active:scale-95",
                        isDragging && "opacity-50",
                        isHover &&
                        "ring-4 ring-cyan-400",
                        isHighlighted &&
                        "ring-4 ring-primary"
                    )}

                    style={{
                        width: size,
                        height: size,
                        backgroundColor: fill,
                        overflow: "visible",
                    }}
                >

                    {/* CHILDREN */}

                    {r.children?.map((child, i) => (

                        <div
                            key={child.id}

                            style={{
                                position: "absolute",

                                left:
                                    childTransforms[i]?.x || 0,

                                top:
                                    childTransforms[i]?.y || 0,

                                width: childSize,
                                height: childSize,

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {renderRegion(
                                child,
                                size
                            )}
                        </div>
                    ))}

                </button>
            </div>
        );
    }

    // =========================
    // ROOT
    // =========================

    return (

        <div
            className={cn(
                "relative flex min-h-[220px]",
                "flex-wrap items-center justify-center",
                "gap-4 rounded-xl border p-4"
            )}

            onDragOver={(e) => {
                e.preventDefault();
            }}

            onDrop={(e) => {

                e.preventDefault();

                const sourceId =
                    e.dataTransfer.getData(
                        "regionId"
                    );

                if (!sourceId) {
                    return;
                }

                setEditRegions(prev =>
                    addChildToRegion(
                        prev,
                        "root",
                        sourceId
                    )
                );

                setDragId(null);
                setHoverTargetId(null);
            }}
        >

            {visible.map((r) => (

                <div
                    key={r.id}

                    style={{
                        position: "relative",
                        width: sizeFor(r),
                        height: sizeFor(r),
                    }}
                >
                    {renderRegion(r)}
                </div>
            ))}
        </div>
    );
}