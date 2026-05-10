'use client';

import { motion } from 'framer-motion';
import {
  Scissors,
  Image,
  Sparkles,
  SlidersHorizontal,
  Layout,
  Undo2,
  Redo2,
  Download,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { EditorTab } from '@/types/editor.types';

interface EditorToolbarProps {
  activeTab: EditorTab | null;
  onTabChange: (tab: EditorTab | null) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: (format: 'png' | 'jpg' | 'webp') => void;
}

const TABS: { id: EditorTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  // { id: 'cutout', label: 'Cutout', icon: Scissors },
  { id: 'background', label: 'Background', icon: Image },
  // { id: 'effects', label: 'Effects', icon: Sparkles },
  // { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
  // { id: 'design', label: 'Design', icon: Layout },
];

export function EditorToolbar({
  activeTab,
  onTabChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDownload,
}: EditorToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-14 items-center justify-between gap-3 rounded-full bg-card px-4 shadow-sm ring-1 ring-border"
    >
      {/* Tab buttons */}
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
                  className={cn(
                    'gap-2 rounded-full transition-all',
                    activeTab === tab.id && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tab.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8 rounded-full"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 w-8 rounded-full"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Download */}
        <div className="flex items-center overflow-hidden rounded-full">
          <Button size="sm" onClick={() => onDownload('png')} className="rounded-full rounded-r-none pr-3">
            <Download className="mr-1.5 h-4 w-4" />
            Download
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 items-center justify-center rounded-full rounded-l-none border-l border-primary-foreground/20 bg-primary px-2 text-primary-foreground hover:bg-primary/90">
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload('png')}>PNG (Lossless)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload('jpg')}>JPG (Compressed)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload('webp')}>WebP (Modern)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
