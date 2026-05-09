import type { Metadata } from 'next';
import { History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'History',
};

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-muted-foreground">View all your processed images</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-16 text-center">
        <History className="h-12 w-12 text-muted-foreground/50" />
        <div>
          <p className="font-medium">No history yet</p>
          <p className="text-sm text-muted-foreground">Your processed images will appear here</p>
        </div>
      </div>
    </div>
  );
}
