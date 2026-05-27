"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  ScanSearch,
  Columns2,
  Undo2,
  Redo2,
  X,
  Palette,
  Spline,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface VectorEditorToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  split: boolean;
  onToggleSplit: () => void;
  showOutline: boolean;
  onToggleOutline: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onClose: () => void;
}

function IconBtn({
  label,
  active,
  onClick,
  disabled,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "h-8 w-8 rounded-lg text-foreground/80 transition-all hover:scale-105 hover:bg-foreground/10",
              active && "bg-primary/15 text-primary hover:bg-primary/20"
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function VectorEditorToolbar(props: VectorEditorToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 bg-background/70 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 pr-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="hidden flex-col leading-tight md:flex">
          <span className="text-sm font-semibold">Vector Studio</span>
          <span className="text-[10px] text-muted-foreground">AI-powered tracer</span>
        </div>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Split view toggle */}
      <IconBtn
        label={props.split ? "Hide original (show vector only)" : "Show split view (original + vector)"}
        active={props.split}
        onClick={props.onToggleSplit}
      >
        <Columns2 className="h-4 w-4" />
      </IconBtn>

      {/* Select / outline paths toggle */}
      <IconBtn
        label={props.showOutline ? "Hide path outlines" : "Show path outlines"}
        active={props.showOutline}
        onClick={props.onToggleOutline}
      >
        <Spline className="h-4 w-4" />
      </IconBtn>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom */}
      <IconBtn label="Zoom out" onClick={props.onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </IconBtn>
      <div className="flex h-8 min-w-[58px] items-center justify-center rounded-lg bg-foreground/5 px-2 text-xs font-medium tabular-nums">
        {Math.round(props.zoom * 100)}%
      </div>
      <IconBtn label="Zoom in" onClick={props.onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </IconBtn>
      <IconBtn label="Fit to screen" onClick={props.onFit}>
        <ScanSearch className="h-4 w-4" />
      </IconBtn>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/redo */}
      <IconBtn label="Undo" onClick={props.onUndo} disabled={!props.canUndo}>
        <Undo2 className="h-4 w-4" />
      </IconBtn>
      <IconBtn label="Redo" onClick={props.onRedo} disabled={!props.canRedo}>
        <Redo2 className="h-4 w-4" />
      </IconBtn>

      <div className="ml-auto flex items-center gap-2">
        <IconBtn
          label={props.sidebarOpen ? "Hide palette" : "Show palette"}
          active={props.sidebarOpen}
          onClick={props.onToggleSidebar}
        >
          <Palette className="h-4 w-4" />
        </IconBtn>

        <div className="flex items-center overflow-hidden rounded-lg shadow-sm">
          <Button
            size="sm"
            onClick={props.onSave}
            className="h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold"
          >
            <Check className="h-3.5 w-3.5" />
            Save
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <IconBtn label="Close editor" onClick={props.onClose}>
          <X className="h-4 w-4" />
        </IconBtn>
      </div>
    </motion.div>
  );
}
