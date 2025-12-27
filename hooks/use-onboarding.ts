"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "grove_onboarding_complete";

/**
 * Hook for managing onboarding state.
 * Tracks whether user has completed onboarding using useSyncExternalStore.
 */
export function useOnboarding() {
  const subscribe = useCallback((callback: () => void) => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) callback();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(STORAGE_KEY) === "true";
  }, []);

  const getServerSnapshot = useCallback(() => true, []);

  const hasCompletedOnboarding = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  return {
    hasCompletedOnboarding,
    isLoaded: true,
    completeOnboarding,
    resetOnboarding,
  };
}
