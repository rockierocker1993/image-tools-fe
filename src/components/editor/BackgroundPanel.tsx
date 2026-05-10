'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface BackgroundPanelProps {
  /** Called when user picks a background to apply */
  onApply?: (backgroundUrl: string) => void;
  /** Called when user picks a solid color */
  onApplyColor?: (color: string | null) => void;
  /** Render without the card wrapper (for embedding inside a sheet) */
  inline?: boolean;
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const MAGIC_BACKGROUNDS = [
  { id: 'forest',    label: 'Forest',      url: 'https://picsum.photos/seed/forest/400/300' },
  { id: 'mountain',  label: 'Mountain',    url: 'https://picsum.photos/seed/mountain/400/300' },
  { id: 'beach',     label: 'Beach',       url: 'https://picsum.photos/seed/beach/400/300' },
  { id: 'city',      label: 'City',        url: 'https://picsum.photos/seed/city/400/300' },
  { id: 'office',    label: 'Office',      url: 'https://picsum.photos/seed/office/400/300' },
  { id: 'studio',    label: 'Studio',      url: 'https://picsum.photos/seed/studio/400/300' },
  { id: 'abstract',  label: 'Abstract',    url: 'https://picsum.photos/seed/abstract/400/300' },
  { id: 'kitchen',   label: 'Kitchen',     url: 'https://picsum.photos/seed/kitchen/400/300' },
  { id: 'room',      label: 'Living Room', url: 'https://picsum.photos/seed/livingroom/400/300' },
  { id: 'dark',      label: 'Dark',        url: 'https://picsum.photos/seed/darkroom/400/300' },
];

const PHOTO_BACKGROUNDS = [
  { id: 'nature1',   label: 'Nature',      url: 'https://picsum.photos/seed/nature1/400/300' },
  { id: 'sunset',    label: 'Sunset',      url: 'https://picsum.photos/seed/sunset/400/300' },
  { id: 'indoor',    label: 'Indoor',      url: 'https://picsum.photos/seed/indoor/400/300' },
  { id: 'urban',     label: 'Urban',       url: 'https://picsum.photos/seed/urban/400/300' },
  { id: 'rain',      label: 'Rain',        url: 'https://picsum.photos/seed/rain/400/300' },
  { id: 'snow',      label: 'Snow',        url: 'https://picsum.photos/seed/snow/400/300' },
  { id: 'desert',    label: 'Desert',      url: 'https://picsum.photos/seed/desert/400/300' },
  { id: 'ocean',     label: 'Ocean',       url: 'https://picsum.photos/seed/ocean/400/300' },
  { id: 'gradient1', label: 'Gradient 1',  url: 'https://picsum.photos/seed/gradient1/400/300' },
  { id: 'gradient2', label: 'Gradient 2',  url: 'https://picsum.photos/seed/gradient2/400/300' },
];

const PRESET_COLORS = [
  '#ffffff', '#000000',
  '#ef4444', '#ec4899', '#a855f7',
  '#6366f1', '#3b82f6', '#06b6d4',
  '#22c55e', '#eab308', '#f97316',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BgGrid({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; label: string; url: string }[];
  activeId: string | null;
  onSelect: (id: string, url: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id, item.url)}
          className={cn(
            'group relative aspect-[4/3] overflow-hidden rounded-xl transition-all',
            'ring-2',
            activeId === item.id
              ? 'ring-primary shadow-md'
              : 'ring-transparent hover:ring-muted-foreground/30'
          )}
        >
          <img
            src={item.url}
            alt={item.label}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BackgroundPanel({ onApply, onApplyColor, inline }: BackgroundPanelProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState('#3b82f6');
  const colorInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleBgSelect = useCallback(
    (id: string, url: string) => {
      setActiveId(id);
      onApply?.(url);
    },
    [onApply]
  );

  const handleColorSelect = useCallback(
    (color: string | null) => {
      setActiveId(color ?? 'none');
      onApplyColor?.(color);
    },
    [onApplyColor]
  );

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setActiveId('custom-photo');
      onApply?.(url);
      e.target.value = '';
    },
    [onApply]
  );

  const inner = (
    <Tabs defaultValue="magic" className="flex flex-col">
        {/* Tab headers */}
        <div className="border-b border-border px-4 pt-3 pb-0">
          <TabsList className="w-full bg-transparent p-0 gap-0 h-auto">
            {(['magic', 'photo', 'color'] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  'flex-1 capitalize rounded-none border-b-2 border-transparent pb-2 pt-1 text-sm font-medium text-muted-foreground transition-all',
                  'data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Magic tab */}
        <TabsContent value="magic" className="m-0">
          <div className="max-h-72 overflow-y-auto">
            <div className="p-3">
              <BgGrid items={MAGIC_BACKGROUNDS} activeId={activeId} onSelect={handleBgSelect} />
            </div>
          </div>
        </TabsContent>

        {/* Photo tab */}
        <TabsContent value="photo" className="m-0">
          <div className="max-h-72 overflow-y-auto">
            <div className="p-3 flex flex-col gap-3">
              {/* Upload own photo */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-5 w-5" />
                  <span className="text-xs font-medium">Upload photo</span>
                </div>
              </button>

              <BgGrid items={PHOTO_BACKGROUNDS} activeId={activeId} onSelect={handleBgSelect} />
            </div>
          </div>
        </TabsContent>

        {/* Color tab */}
        <TabsContent value="color" className="m-0">
          <div className="max-h-72 overflow-y-auto">
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {/* No color (transparent) */}
                <button
                  onClick={() => handleColorSelect(null)}
                  className={cn(
                    'relative aspect-square rounded-xl border-2 transition-all overflow-hidden',
                    activeId === 'none'
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-muted-foreground/50'
                  )}
                  style={{
                    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                    backgroundSize: '12px 12px',
                    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  {/* Diagonal cancel line */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-[2px] w-[70%] rotate-45 rounded-full bg-red-400/80" />
                  </div>
                </button>

                {/* Custom color picker */}
                <button
                  onClick={() => colorInputRef.current?.click()}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-xl border-2 transition-all',
                    activeId === 'custom'
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-muted-foreground/50'
                  )}
                  style={{
                    background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                  }}
                >
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={customColor}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setActiveId('custom');
                      onApplyColor?.(e.target.value);
                    }}
                  />
                </button>

                {/* Preset colors */}
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={cn(
                      'aspect-square rounded-xl border-2 transition-all',
                      activeId === color
                        ? 'border-primary shadow-md scale-95'
                        : 'border-transparent hover:border-muted-foreground/50'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
  );

  if (inline) return inner;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex w-72 shrink-0 flex-col rounded-2xl bg-card shadow-sm ring-1 ring-border overflow-hidden"
    >
      {inner}
    </motion.div>
  );
}
