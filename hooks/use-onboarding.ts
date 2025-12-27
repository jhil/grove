"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "grove_onboarding_complete";

/**
 * Hook for managing onboarding state.
 * Tracks whether user has completed onboarding.
 */
export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY) === "true";
    setHasCompletedState(completed);
    setIsLoaded(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setHasCompletedState(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasCompletedState(false);
  }, []);

  return {
    hasCompletedOnboarding,
    isLoaded,
    completeOnboarding,
    resetOnboarding,
  };
}
