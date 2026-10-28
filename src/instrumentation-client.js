// src/instrumentation-client.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});