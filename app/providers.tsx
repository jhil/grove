"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/components/ui/toast";

/**
 * Root providers for the application.
 * Includes TanStack Query and Toast notifications.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each session
  // This prevents data sharing between requests in SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time of 1 minute for most queries
            staleTime: 60 * 1000,
            // Retry once on failure
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
