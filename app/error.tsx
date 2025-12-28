"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Root error boundary for the application.
 * Catches errors in the app and displays a friendly fallback.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-8">
          <Leaf className="w-10 h-10 text-sage-600" />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-3">
          Something went wrong
        </h1>

        <p className="text-muted-foreground mb-8">
          We encountered an unexpected error. Please try again, or return to the
          home page.
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

        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mt-8 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 p-4 bg-sage-50 rounded-lg text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
