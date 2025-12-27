"use client";

import { useEffect, useState, useCallback } from "react";

type NotificationPermission = "default" | "granted" | "denied";

interface NotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}

/**
 * Hook for managing push notifications.
 */
export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    permission: "default",
    isSubscribed: false,
  });

  // Check notification support and permission on mount
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setState((s) => ({ ...s, isSupported: false }));
      return;
    }

    setState((s) => ({
      ...s,
      isSupported: true,
      permission: Notification.permission,
    }));

    // Check if already subscribed
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setState((s) => ({
            ...s,
            isSubscribed: !!subscription,
          }));
        });
      });
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setState((s) => ({ ...s, permission }));
      return permission === "granted";
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return false;
    }
  }, [state.isSupported]);

  // Show a local notification (for testing)
  const showNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (state.permission !== "granted") {
        const granted = await requestPermission();
        if (!granted) return false;
      }

      try {
        // Try to use service worker notification first
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(title, {
            icon: "/icons/icon-192.svg",
            badge: "/icons/icon-192.svg",
            vibrate: [100, 50, 100],
            ...options,
          });
          return true;
        }

        // Fallback to regular notification
        new Notification(title, {
          icon: "/icons/icon-192.svg",
          ...options,
        });
        return true;
      } catch (error) {
        console.error("Failed to show notification:", error);
        return false;
      }
    },
    [state.permission, requestPermission]
  );

  return {
    ...state,
    requestPermission,
    showNotification,
  };
}

/**
 * Pre-defined notifications for plant care
 */
export const plantNotifications = {
  wateringReminder: (plantName: string) => ({
    title: "Time to water!",
    body: `${plantName} is thirsty and needs watering today.`,
    tag: "watering-reminder",
  }),
  wateringOverdue: (plantName: string, daysSince: number) => ({
    title: "Plant needs attention!",
    body: `${plantName} hasn't been watered in ${daysSince} days.`,
    tag: "watering-overdue",
  }),
  streakMilestone: (plantName: string, streak: number) => ({
    title: "Streak milestone!",
    body: `You've kept ${plantName} on schedule for ${streak} waterings in a row!`,
    tag: "streak-milestone",
  }),
  plantBirthday: (plantName: string, age: string) => ({
    title: "Plant birthday!",
    body: `${plantName} turns ${age} today!`,
    tag: "plant-birthday",
  }),
};
