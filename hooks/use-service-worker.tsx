"use client";

import { useEffect, useState, useCallback } from "react";

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  registration: ServiceWorkerRegistration | null;
  isUpdating: boolean;
  error: string | null;
}

/**
 * Hook for managing service worker registration and updates.
 */
export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    registration: null,
    isUpdating: false,
    error: null,
  });

  // Register service worker on mount
  useEffect(() => {
    // Check if service workers are supported
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      setState((s) => ({ ...s, isSupported: false }));
      return;
    }

    setState((s) => ({ ...s, isSupported: true }));

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("[SW] Service worker registered:", registration.scope);

        setState((s) => ({
          ...s,
          isRegistered: true,
          registration,
          error: null,
        }));

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[SW] New version available");
                setState((s) => ({ ...s, isUpdating: true }));
              }
            });
          }
        });
      } catch (error) {
        console.error("[SW] Registration failed:", error);
        setState((s) => ({
          ...s,
          error: error instanceof Error ? error.message : "Failed to register service worker",
        }));
      }
    };

    registerSW();

    // Handle controller change (new SW taking over)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[SW] Controller changed - reloading");
      // Optionally reload to get new version
    });
  }, []);

  // Force update to new service worker version
  const update = useCallback(async () => {
    if (state.registration) {
      await state.registration.update();
      // Skip waiting to activate new SW immediately
      if (state.registration.waiting) {
        state.registration.waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    }
  }, [state.registration]);

  return {
    ...state,
    update,
  };
}
