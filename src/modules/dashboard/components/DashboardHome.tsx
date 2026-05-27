'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Eraser,
  ZoomIn,
  History,
  Shapes,
  Wand2,
  Palette,
  Package,
  Image as ImageIcon,
  Upload,
  MoreHorizontal,
  ArrowUpDown,
  LayoutGrid,
  Star,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/services/store/auth.store';
import { ROUTES } from '@/constants/routes';
import { useJob } from '@/services/hooks/useJob';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const QUICK_TOOLS = [
  { href: ROUTES.REMOVE_BACKGROUND, icon: Eraser, label: 'Remove BG', color: 'bg-violet-500/10 text-violet-500', badge: 'Popular' },
  { href: ROUTES.UPSCALER, icon: ZoomIn, label: 'Upscaler', color: 'bg-blue-500/10 text-blue-500', badge: 'New' },
  { href: ROUTES.VECTOR, icon: Shapes, label: 'Vectorize', color: 'bg-emerald-500/10 text-emerald-500' },
  { href: '#', icon: Wand2, label: 'AI Edit', color: 'bg-fuchsia-500/10 text-fuchsia-500' },
  { href: '#', icon: Palette, label: 'Recolor', color: 'bg-pink-500/10 text-pink-500' },
  { href: '#', icon: Package, label: 'Product', color: 'bg-amber-500/10 text-amber-500' },
  { href: '#', icon: ImageIcon, label: 'AI Image', color: 'bg-orange-500/10 text-orange-500' },
  { href: '#', icon: Upload, label: 'Upload', color: 'bg-sky-500/10 text-sky-500' },
  { href: ROUTES.TOOLS, icon: MoreHorizontal, label: 'More', color: 'bg-muted text-muted-foreground' },
];

// Placeholder — ganti dengan data nyata dari jobs/history API.
const RECENT_ITEMS: Array<{
  id: string;
  name: string;
  type: string;
  editedLabel: string;
  thumbnail?: string | null;
}> = [];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardHome() {
  const initialWarmingUp = useRef(true);
  const { warmingUpAll } = useJob();
  useEffect(() => {
    if (initialWarmingUp.current) {
      initialWarmingUp.current = false;
      warmingUpAll();
    }
  }, [warmingUpAll]);
  const { user } = useAuthStore();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants} className="text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-muted-foreground">
          What would you like to work on today?
        </p>
      </motion.div>

      {/* Quick tools row */}
      <motion.div variants={itemVariants}>
        <ScrollArea className="w-full">
          <div className="flex items-start justify-center gap-2 pb-3 sm:gap-4">
            {QUICK_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const disabled = tool.href === '#';
              return (
                <Link
                  key={tool.label}
                  href={disabled ? '#' : tool.href}
                  aria-disabled={disabled}
                  onClick={(e) => disabled && e.preventDefault()}
                  className={cn(
                    'group flex w-20 flex-col items-center gap-2 rounded-lg p-2 transition-colors',
                    'hover:bg-muted',
                    disabled && 'cursor-not-allowed opacity-70 hover:bg-transparent'
                  )}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-105',
                        tool.color
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    {tool.badge && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-2 h-4 px-1.5 text-[10px]"
                      >
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="line-clamp-1 text-center text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    {tool.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.div>

      {/* Recents */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">Recents</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              Owner
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Any type
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Sort">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Toggle layout">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_140px_160px_160px_80px] items-center gap-4 border-b px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>Name</span>
          <span className="hidden md:block">People</span>
          <span className="hidden md:block">Type</span>
          <span>Edited</span>
          <span className="sr-only">Actions</span>
        </div>

        {/* Rows */}
        {RECENT_ITEMS.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center">
            <History className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No recent activity yet. Start by processing an image!
            </p>
            <Link href={ROUTES.TOOLS}>
              <Button size="sm" variant="secondary">
                Browse tools
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y rounded-xl border">
            {RECENT_ITEMS.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[1fr_140px_160px_160px_80px] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="truncate text-sm font-medium">{item.name}</span>
                </div>
                <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
                  <Lock className="h-3 w-3" />
                  Private
                </span>
                <span className="hidden truncate text-sm text-muted-foreground md:block">
                  {item.type}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {item.editedLabel}
                </span>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" aria-label="Favorite">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="More">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center">
          <Link href={ROUTES.HISTORY}>
            <Button variant="ghost" size="sm">
              <History className="mr-2 h-4 w-4" />
              View all history
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
