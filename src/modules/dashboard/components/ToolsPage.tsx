'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Eraser,
  ZoomIn,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Palette,
  Layers,
  Shirt,
  Camera,
  Package,
  Type as TypeIcon,
  Video,
  Expand,
  Sun,
  Maximize2,
  Box,
  Shapes,
  Wallpaper,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

type Tool = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  /** Tailwind classes used for the thumbnail accent */
  accent: string;
  /** Whether the tool is implemented and clickable */
  available?: boolean;
};

const ALL_TOOLS: Tool[] = [
  {
    id: 'remove-background',
    label: 'Remove Background',
    icon: Eraser,
    href: ROUTES.REMOVE_BACKGROUND,
    accent: 'bg-violet-500/10 text-violet-500',
    available: true,
  },
  {
    id: 'upscaler',
    label: 'Image Upscaler',
    icon: ZoomIn,
    href: ROUTES.UPSCALER,
    accent: 'bg-blue-500/10 text-blue-500',
    available: true,
  },
  {
    id: 'vector',
    label: 'Vectorize',
    icon: Shapes,
    href: ROUTES.VECTOR,
    accent: 'bg-emerald-500/10 text-emerald-500',
    available: true,
  },
  {
    id: 'recolor',
    label: 'Recolor',
    icon: Palette,
    href: '#',
    accent: 'bg-pink-500/10 text-pink-500',
  },
  {
    id: 'product-enhancer',
    label: 'Product Enhancer',
    icon: Package,
    href: '#',
    accent: 'bg-amber-500/10 text-amber-500',
  },
  {
    id: 'virtual-model',
    label: 'Virtual Model',
    icon: ImageIcon,
    href: '#',
    accent: 'bg-rose-500/10 text-rose-500',
  },
  {
    id: 'product-staging',
    label: 'Product Staging',
    icon: Box,
    href: '#',
    accent: 'bg-teal-500/10 text-teal-500',
  },
  {
    id: 'ai-edit',
    label: 'Edit with AI',
    icon: Wand2,
    href: '#',
    accent: 'bg-fuchsia-500/10 text-fuchsia-500',
  },
  {
    id: 'ghost-mannequin',
    label: 'Ghost Mannequin',
    icon: Shirt,
    href: '#',
    accent: 'bg-slate-500/10 text-slate-500',
  },
  {
    id: 'iron',
    label: 'Iron',
    icon: Shirt,
    href: '#',
    accent: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    id: 'top-view',
    label: 'Top View',
    icon: Layers,
    href: '#',
    accent: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    id: 'logo',
    label: 'Logo',
    icon: Sparkles,
    href: '#',
    accent: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    id: 'text',
    label: 'Text',
    icon: TypeIcon,
    href: '#',
    accent: 'bg-red-500/10 text-red-500',
  },
  {
    id: 'create-image',
    label: 'Create any image',
    icon: ImageIcon,
    href: '#',
    accent: 'bg-orange-500/10 text-orange-500',
  },
  {
    id: 'instagram-story',
    label: 'Instagram Story',
    icon: ImageIcon,
    href: '#',
    accent: 'bg-pink-500/10 text-pink-500',
  },
  {
    id: 'product-photography',
    label: 'Product Photography',
    icon: Camera,
    href: '#',
    accent: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    id: 'product-packaging',
    label: 'Product Packaging',
    icon: Package,
    href: '#',
    accent: 'bg-lime-500/10 text-lime-600',
  },
  {
    id: 'video-maker',
    label: 'Video Maker',
    icon: Video,
    href: '#',
    accent: 'bg-purple-500/10 text-purple-500',
  },
  {
    id: 'ai-background',
    label: 'AI Background',
    icon: Wallpaper,
    href: '#',
    accent: 'bg-sky-500/10 text-sky-500',
  },
  {
    id: 'ai-expand',
    label: 'AI Expand',
    icon: Expand,
    href: '#',
    accent: 'bg-violet-500/10 text-violet-500',
  },
  {
    id: 'ai-shadow',
    label: 'AI Shadow',
    icon: Sun,
    href: '#',
    accent: 'bg-amber-500/10 text-amber-600',
  },
  {
    id: 'resize',
    label: 'Resize',
    icon: Maximize2,
    href: '#',
    accent: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 'studio-shot',
    label: 'Studio Shot',
    icon: Camera,
    href: '#',
    accent: 'bg-neutral-500/10 text-neutral-600',
  },
];

const AI_TOOL_IDS = new Set([
  'recolor',
  'product-enhancer',
  'virtual-model',
  'product-staging',
  'ai-edit',
  'ghost-mannequin',
  'iron',
  'top-view',
  'logo',
  'text',
  'create-image',
  'instagram-story',
  'product-photography',
  'product-packaging',
]);

const RECENT_STORAGE_KEY = 'image-tools:recent';
const RECENT_LIMIT = 4;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function loadRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function saveRecent(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function ToolsPage() {
  const router = useRouter();
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [showAllAi, setShowAllAi] = useState(false);

  useEffect(() => {
    setRecentIds(loadRecent());
  }, []);

  const toolsById = useMemo(() => {
    const map = new Map<string, Tool>();
    ALL_TOOLS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  const recentTools = useMemo(
    () =>
      recentIds
        .map((id) => toolsById.get(id))
        .filter((t): t is Tool => Boolean(t))
        .slice(0, RECENT_LIMIT),
    [recentIds, toolsById]
  );

  const aiTools = useMemo(
    () => ALL_TOOLS.filter((t) => AI_TOOL_IDS.has(t.id)),
    []
  );

  const visibleAiTools = showAllAi ? aiTools : aiTools.slice(0, 12);

  const handleToolClick = (tool: Tool) => (e: React.MouseEvent) => {
    if (!tool.available || tool.href === '#') {
      e.preventDefault();
    }

    setRecentIds((prev) => {
      const next = [tool.id, ...prev.filter((id) => id !== tool.id)].slice(0, RECENT_LIMIT);
      saveRecent(next);
      return next;
    });

    if (tool.available && tool.href !== '#') {
      router.push(tool.href);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Image Tools</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a tool to start editing or generating images.
        </p>
      </motion.div>

      {recentTools.length > 0 && (
        <Section title="Recently used">
          <ToolGrid tools={recentTools} onToolClick={handleToolClick} />
        </Section>
      )}

      <Section
        title="Create images with AI"
        action={
          aiTools.length > 12 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAllAi((v) => !v)}
            >
              {showAllAi ? 'Show less' : 'View all'}
            </Button>
          ) : null
        }
      >
        <ToolGrid tools={visibleAiTools} onToolClick={handleToolClick} />
      </Section>

      <Section title="All tools">
        <ToolGrid tools={ALL_TOOLS} onToolClick={handleToolClick} />
      </Section>
    </motion.div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={itemVariants} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

function ToolGrid({
  tools,
  onToolClick,
}: {
  tools: Tool[];
  onToolClick: (tool: Tool) => (e: React.MouseEvent) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} onClick={onToolClick(tool)} />
      ))}
    </div>
  );
}

function ToolCard({
  tool,
  onClick,
}: {
  tool: Tool;
  onClick: (e: React.MouseEvent) => void;
}) {
  const Icon = tool.icon;
  const disabled = !tool.available || tool.href === '#';

  return (
    <Link
      href={disabled ? '#' : tool.href}
      onClick={onClick}
      aria-disabled={disabled}
      className={cn(
        'group flex items-center justify-between gap-3 rounded-xl border bg-card p-3 transition-all',
        'hover:border-primary/40 hover:shadow-sm',
        disabled && 'cursor-not-allowed opacity-70 hover:border-border hover:shadow-none'
      )}
    >
      <span className="line-clamp-2 text-sm font-medium leading-snug">
        {tool.label}
      </span>
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform',
          tool.accent,
          'group-hover:scale-105'
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
    </Link>
  );
}
