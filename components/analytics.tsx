"use client";

import Script from "next/script";

/**
 * Google Analytics component.
 * Placeholder for future GA integration.
 *
 * To enable:
 * 1. Create a Google Analytics 4 property
 * 2. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local
 * 3. This component will automatically start tracking
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  // Don't render anything if no GA ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

/**
 * Track a custom event in Google Analytics.
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Track plant-related events.
 */
export const plantEvents = {
  plantCreated: (type: string) => trackEvent("plant_created", "Plant", type),
  plantWatered: (name: string) => trackEvent("plant_watered", "Care", name),
  plantDeleted: () => trackEvent("plant_deleted", "Plant"),
  photoUploaded: () => trackEvent("photo_uploaded", "Media"),
};

export const groveEvents = {
  groveCreated: (name: string) => trackEvent("grove_created", "Grove", name),
  groveShared: () => trackEvent("grove_shared", "Social"),
};
