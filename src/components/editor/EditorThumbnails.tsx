'use client';

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThumbnailItem {
  id: string;
  url: string;
  label?: string;
}

interface EditorThumbnailsProps {
  items: ThumbnailItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd?: () => void;
}

export function EditorThumbnails({ items, activeId, onSelect, onAdd }: EditorThumbnailsProps) {
  return (
    <div className="flex h-24 items-center gap-3 rounded-xl bg-card px-4 shadow-sm ring-1 ring-border">
      <ScrollArea className="flex-1">
        <div className="flex gap-3 pb-1 overflow-x-auto">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(item.id)}
              className={cn(
                'relative flex-shrink-0 overflow-hidden rounded-lg transition-all',
                'h-16 w-16 border-2',
                activeId === item.id
                  ? 'border-primary shadow-md'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
              style={{
                backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                backgroundSize: '8px 8px',
                backgroundColor: '#f0f0f0',
              }}
            >
              <img
                src={item.url}
                alt={item.label ?? `Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      </ScrollArea>

      {onAdd && (
        <Button
          variant="outline"
          size="icon"
          onClick={onAdd}
          className="h-12 w-12 shrink-0 rounded-lg border-dashed"
        >
          <Plus className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
