'use client';

import { motion } from 'framer-motion';
import {
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
import type { DownloadFormat, EditorTab } from '@/types/editor.types';

interface EditorToolbarProps {
  tabs: { id: EditorTab; label: string; icon: React.ComponentType<{ className?: string }> }[];
  activeTab: EditorTab | null;
  onTabChange: (tab: EditorTab | null) => void;
  canUndoRedo: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: (format: DownloadFormat) => void;
  downloadOptions?: { label: string; format: DownloadFormat }[];
  isSingleDownloadOption?: boolean;
  singleDownloadOptionFormat?: DownloadFormat;
}


export function EditorToolbar({
  tabs,
  activeTab,
  onTabChange,
  canUndoRedo,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDownload,
  downloadOptions,
  isSingleDownloadOption,
  singleDownloadOptionFormat,
}: EditorToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-14 items-center justify-between gap-3 rounded-full bg-card px-4 shadow-sm ring-1 ring-border"
    >
      {/* Tab buttons */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tooltip key={tab.id}>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
                    className={cn(
                      'gap-2 rounded-full transition-all',
                      activeTab === tab.id && 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  />
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TooltipTrigger>
              <TooltipContent>{tab.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="flex items-center gap-2">


        {/* Undo/Redo */}
        {canUndoRedo && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onUndo}
                    className="h-8 w-8 rounded-full"
                    disabled={!canUndo}
                  />
                }
              >
                <Undo2 className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRedo}
                    className="h-8 w-8 rounded-full"
                    disabled={!canRedo}
                  />
                }
              >
                <Redo2 className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Download */}
        {isSingleDownloadOption ? (
          <div className="flex items-center overflow-hidden rounded-full">
            <Button size="sm" onClick={() => onDownload(singleDownloadOptionFormat!)} className="rounded-full rounded-r-none pr-3">
              <Download className="mr-1.5 h-4 w-4" />
              Download
            </Button>
          </div>
        ) : (
          <div className="flex items-center overflow-hidden rounded-full">
            <Button size="sm" className="rounded-full rounded-r-none pr-3">
              <Download className="mr-1.5 h-4 w-4" />
              Download
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 items-center justify-center rounded-full rounded-l-none border-l border-primary-foreground/20 bg-primary px-2 text-primary-foreground hover:bg-primary/90">
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {downloadOptions?.map((option) => (
                  <DropdownMenuItem key={option.format} onClick={() => onDownload(option.format)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>)}
      </div>
    </motion.div>
  );
}
