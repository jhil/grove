"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Web Vitals monitoring component.
 * Reports Core Web Vitals metrics to console in development
 * and to Google Analytics in production.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vital] ${metric.name}:`, metric.value);
    }

    // Send to Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });

  return null;
}
