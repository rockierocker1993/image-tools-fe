'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors,
  Image,
  Sparkles,
  SlidersHorizontal,
  Layout,
  Undo2,
  Redo2,
  Download,
  ChevronUp,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BackgroundPanel } from '@/components/editor/BackgroundPanel';
import type { EditorTab } from '@/types/editor.types';

interface MobileEditorSheetProps {
  activeTab: EditorTab | null;
  onTabChange: (tab: EditorTab | null) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: (format: 'png' | 'jpg' | 'webp') => void;
  onApplyBackground?: (url: string) => void;
  onApplyColor?: (color: string | null) => void;
}

const TABS: { id: EditorTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'cutout', label: 'Cutout', icon: Scissors },
  { id: 'background', label: 'Background', icon: Image },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
  { id: 'design', label: 'Design', icon: Layout },
];

export function MobileEditorSheet({
  activeTab,
  onTabChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDownload,
  onApplyBackground,
  onApplyColor,
}: MobileEditorSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full px-6 shadow-lg"
          size="sm"
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          Edit Tools
        </Button>
      </div>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-card pb-safe shadow-xl md:hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium">Edit Tools</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Tab grid */}
              <div className="grid grid-cols-5 gap-1 px-4 pb-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { onTabChange(activeTab === tab.id ? null : tab.id); }}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs transition-colors',
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Background panel — shown inline when Background tab is active */}
              {activeTab === 'background' && (
                <div className="border-t border-border">
                  <BackgroundPanel
                    inline
                    onApply={onApplyBackground}
                    onApplyColor={onApplyColor}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 border-t px-4 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="flex-1"
                >
                  <Undo2 className="mr-1.5 h-4 w-4" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="flex-1"
                >
                  <Redo2 className="mr-1.5 h-4 w-4" />
                  Redo
                </Button>
                <Button
                  size="sm"
                  onClick={() => { onDownload('png'); setIsOpen(false); }}
                  className="flex-1"
                >
                  <Download className="mr-1.5 h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="h-safe-bottom" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
