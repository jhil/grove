"use client";

import { useEffect } from "react";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { InstallPrompt } from "./install-prompt";
import { UpdatePrompt } from "./update-prompt";

/**
 * PWA Provider - handles service worker registration and PWA prompts
 */
export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { isSupported, isRegistered, isUpdating, error } = useServiceWorker();

  useEffect(() => {
    if (error) {
      console.error("[PWA] Service worker error:", error);
    }
    if (isRegistered) {
      console.log("[PWA] Service worker registered successfully");
    }
  }, [isRegistered, error]);

  return (
    <>
      {children}
      {isSupported && <InstallPrompt />}
      {isUpdating && <UpdatePrompt />}
    </>
  );
}
