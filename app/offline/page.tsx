"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Offline page - shown when the user is offline and no cached content is available
 */
export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-cream-500" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          You&apos;re Offline
        </h1>
        <p className="text-muted-foreground mb-6">
          It looks like you&apos;ve lost your internet connection. Some features may be limited
          until you&apos;re back online.
        </p>
        <Button onClick={handleRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <p className="text-xs text-muted-foreground mt-6">
          Previously visited pages may still be available from cache.
        </p>
      </div>
    </div>
  );
}
