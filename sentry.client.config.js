import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // সাইটে ট্রাফিকের ১০% ট্র্যাক করবে (ফ্রি প্ল্যানের জন্য ভালো)
  tracesSampleRate: 0.1,
  
  // প্রোডাকশনে এরর লগ করবে
  debug: false,
  
  // এনভায়রনমেন্ট
  environment: process.env.NODE_ENV,
  
  // সেশন রিপ্লে (ইউজার কী করছে সেটি দেখতে পারবেন)
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  
  // সংবেদনশীল ডেটা ফিল্টার
  beforeSend(event) {
    // পাসওয়ার্ড বা টোকেন যেন লগ না হয়
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});