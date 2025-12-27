"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * App header with logo and optional back navigation.
 * Used across all pages for consistent navigation.
 */
interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  title?: string;
  actions?: React.ReactNode;
}

export function Header({
  showBack = false,
  backHref = "/",
  backLabel = "Back",
  title,
  actions,
}: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side: Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBack && !isHome ? (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center group-hover:bg-sage-200 transition-colors">
                <Leaf className="w-5 h-5 text-sage-600" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Plangrove
              </span>
            </Link>
          )}

          {/* Title (when showing back button) */}
          {showBack && title && (
            <>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {title}
              </span>
            </>
          )}
        </div>

        {/* Right side: Actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
