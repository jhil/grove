"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Error boundary for grove pages.
 * Handles errors when loading or interacting with a grove.
 */
export default function GroveError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Grove error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-8">
          <Leaf className="w-10 h-10 text-sage-600" />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-3">
          Couldn&apos;t load this grove
        </h1>

        <p className="text-muted-foreground mb-8">
          We had trouble loading this grove. It may have been deleted, or there
          might be a temporary issue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} className="gap-2 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>

          <Link href="/">
            <Button variant="secondary" className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
