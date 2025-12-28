/**
 * Logging utilities for Google Home integration.
 *
 * Provides structured logging for debugging OAuth flows,
 * fulfillment requests, and device operations.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  requestId?: string;
  userId?: string;
  agentUserId?: string;
  intent?: string;
  deviceId?: string;
  groveId?: string;
  plantId?: string;
  [key: string]: unknown;
}

/**
 * Format a log message with context.
 */
function formatLog(
  level: LogLevel,
  component: string,
  message: string,
  context?: LogContext
): string {
  const timestamp = new Date().toISOString();
  const contextStr = context
    ? ` | ${Object.entries(context)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(" ")}`
    : "";

  return `[${timestamp}] [${level.toUpperCase()}] [GoogleHome:${component}] ${message}${contextStr}`;
}

/**
 * Log an OAuth-related event.
 */
export function logOAuth(
  level: LogLevel,
  message: string,
  context?: LogContext
): void {
  const formatted = formatLog(level, "OAuth", message, context);
  switch (level) {
    case "debug":
      console.debug(formatted);
      break;
    case "info":
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

/**
 * Log a fulfillment-related event.
 */
export function logFulfillment(
  level: LogLevel,
  message: string,
  context?: LogContext
): void {
  const formatted = formatLog(level, "Fulfillment", message, context);
  switch (level) {
    case "debug":
      console.debug(formatted);
      break;
    case "info":
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

/**
 * Log a device operation event.
 */
export function logDevice(
  level: LogLevel,
  message: string,
  context?: LogContext
): void {
  const formatted = formatLog(level, "Device", message, context);
  switch (level) {
    case "debug":
      console.debug(formatted);
      break;
    case "info":
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

/**
 * Log an intent handler event.
 */
export function logIntent(
  intent: string,
  level: LogLevel,
  message: string,
  context?: LogContext
): void {
  const formatted = formatLog(level, `Intent:${intent}`, message, context);
  switch (level) {
    case "debug":
      console.debug(formatted);
      break;
    case "info":
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

/**
 * Log the start of a request.
 */
export function logRequestStart(
  requestId: string,
  intent: string,
  context?: LogContext
): void {
  logFulfillment("info", `Request started: ${intent}`, {
    requestId,
    intent,
    ...context,
  });
}

/**
 * Log the completion of a request.
 */
export function logRequestComplete(
  requestId: string,
  intent: string,
  success: boolean,
  context?: LogContext
): void {
  const level = success ? "info" : "error";
  const status = success ? "completed successfully" : "failed";
  logFulfillment(level, `Request ${status}: ${intent}`, {
    requestId,
    intent,
    success,
    ...context,
  });
}

/**
 * Log a watering action.
 */
export function logWateringAction(
  plantId: string,
  plantName: string,
  success: boolean,
  context?: LogContext
): void {
  const level = success ? "info" : "error";
  const status = success ? "watered" : "failed to water";
  logDevice(level, `Plant ${status}: ${plantName}`, {
    plantId,
    plantName,
    success,
    ...context,
  });
}
