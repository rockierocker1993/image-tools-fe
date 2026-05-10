'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eraser, ZoomIn, ArrowRight, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes';
import { useWarmingUp } from '@/hooks/useWarmingUp';
import { useEffect, useRef } from 'react';

const TOOLS = [
  {
    href: ROUTES.REMOVE_BACKGROUND,
    icon: Eraser,
    title: 'Remove Background',
    description: 'Automatically remove backgrounds from any image using AI',
    badge: 'Popular',
    color: 'bg-violet-500/10 text-violet-500',
  },
  {
    href: ROUTES.UPSCALER,
    icon: ZoomIn,
    title: 'Image Upscaler',
    description: 'Enhance image resolution up to 4x with AI upscaling',
    badge: 'New',
    color: 'bg-blue-500/10 text-blue-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};




export function DashboardHome() {
  const initialWarmingUp = useRef(true);
  const { warmingUpAll } = useWarmingUp();
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
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-muted-foreground">
          What would you like to work on today?
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.href} className="group transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{tool.badge}</Badge>
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={tool.href}>
                  <Button className="w-full group-hover:gap-3 transition-all" variant="default">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <Link href={ROUTES.HISTORY}>
            <Button variant="ghost" size="sm">
              <History className="mr-2 h-4 w-4" />
              View all
            </Button>
          </Link>
        </div>
        <div className="mt-4 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">No recent activity. Start by processing an image!</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
