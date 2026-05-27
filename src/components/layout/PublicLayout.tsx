import Link from 'next/link';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ImageTools</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4">
            <Link href={ROUTES.LOGIN}>
              <Button size="sm">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 ImageTools. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
