import { type EditableRegion } from "@/components/editorvector/lib/svg-edit";
import { cn } from "@/lib/utils";
export function PalettePresets({
    regions,
    visibleCount,
    onSetVisibleCount,
}: {
    regions: EditableRegion[];
    visibleCount: number;
    onSetVisibleCount: (n: number) => void;
}) {
    const total = regions.length;
    if (total === 0) {
        return <p className="text-xs text-muted-foreground">No presets available.</p>;
    }
    const chips = Array.from({ length: total }, (_, i) => i + 1);
    return (
        <div className="flex flex-wrap gap-1.5">
            {chips.map((n) => {
                
                const active = visibleCount === n;
                const color = regions[n - 1]?.color ?? "#9ca3af";
                const text = readableText(color);
                return (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onSetVisibleCount(n)}
                        className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ring-1 ring-black/10 transition-all hover:scale-110",
                            active && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-background"
                        )}
                        style={{ backgroundColor: color, color: text }}
                        aria-label={`Use ${n} ${n === 1 ? "color" : "colors"}`}
                    >
                        {n}
                    </button>
                );
            })}
        </div>
    );
}

function readableText(hex: string): string {
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length !== 6) return "#111";
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.6 ? "#111" : "#fff";
}
