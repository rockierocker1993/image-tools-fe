import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BADGE_STATUS } from '@/constants/constant';

export type BadgeStatus = keyof typeof BADGE_STATUS;

interface BadgeStatusProps {
  status: BadgeStatus;
  className?: string;
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    variant: 'secondary' as const,
    className: 'text-muted-foreground',
  },
  PROCESSING: {
    label: 'Processing',
    icon: Loader2,
    variant: 'default' as const,
    className: 'text-primary animate-pulse',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    variant: 'default' as const,
    className: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  FAILED: {
    label: 'Failed',
    icon: XCircle,
    variant: 'destructive' as const,
    className: '',
  },
};

export function JobStatusBadge({ status, className }: BadgeStatusProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      key={status}
    >
      <Badge
        variant={config.variant}
        className={cn('flex items-center gap-1.5', config.className, className)}
      >
        <Icon className={cn('h-3.5 w-3.5', status === 'PROCESSING' && 'animate-spin')} />
        {config.label}
      </Badge>
    </motion.div>
  );
}
