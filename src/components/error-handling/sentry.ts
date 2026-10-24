import * as Sentry from "@sentry/react-native";

// Set EXPO_PUBLIC_SENTRY_DSN in your .env file
const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";

export function initSentry(): void {
  Sentry.init({
    dsn: DSN,
    environment: __DEV__ ? "development" : "production",
    // Always enabled so dev builds can verify events reach the dashboard.
    // Once confirmed working, flip back to `!__DEV__` to keep dev clean.
    enabled: true,
    // Capture 20 % of transactions for performance monitoring
    tracesSampleRate: 0.2,
    // Attach the full JS stack to every event
    attachStacktrace: true,
    debug: false,
    beforeSend(event) {
      // Strip any accidental PII from error messages before they leave the device
      if (event.exception?.values) {
        event.exception.values = event.exception.values.map((ex) => ({
          ...ex,
          value: ex.value?.replace(/\b[\w.+-]+@[\w-]+\.\w+\b/g, "[email]"),
        }));
      }
      return event;
    },
  });
}

/** Report an error with optional extra context. */
export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (context) {
    Sentry.withScope((scope) => {
      scope.setExtras(context);
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/** Log a message at the given severity level (default: "info"). */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
): void {
  Sentry.captureMessage(message, level);
}

/** Attach a user identity to all subsequent events. Pass null to clear. */
export function setUserContext(
  user: { id?: string; email?: string; username?: string } | null,
): void {
  Sentry.setUser(user);
}

/** Add a breadcrumb to help reconstruct what led to an error. */
export function addBreadcrumb(
  message: string,
  category?: string,
  data?: Record<string, unknown>,
): void {
  Sentry.addBreadcrumb({ message, category, data, level: "info" });
}
