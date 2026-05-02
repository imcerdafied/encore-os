"use client";

import posthog from "posthog-js";
import type { AnalyticsProperties } from "@/lib/analytics-events";
import { cleanAnalyticsProperties } from "@/lib/analytics-events";

let initialized = false;

export function isPostHogEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_TOKEN);
}

export function ensurePostHog() {
  if (initialized) return true;
  if (!isPostHogEnabled() || typeof window === "undefined") return false;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN!, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    defaults: "2026-01-30",
    person_profiles: "identified_only",
  });

  initialized = true;
  return true;
}

export function track(event: string, properties?: AnalyticsProperties) {
  if (!ensurePostHog()) return;
  posthog.capture(event, cleanAnalyticsProperties(properties));
}

export function identify(
  distinctId: string,
  properties?: AnalyticsProperties
) {
  if (!distinctId || !ensurePostHog()) return;
  posthog.identify(distinctId, cleanAnalyticsProperties(properties));
}
