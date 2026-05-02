import { PostHog } from "posthog-node";
import type { AnalyticsProperties } from "@/lib/analytics-events";
import { cleanAnalyticsProperties } from "@/lib/analytics-events";

export async function captureServerEvent(
  event: string,
  distinctId: string,
  properties?: AnalyticsProperties
) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
  if (!token || !distinctId) return;

  const posthog = new PostHog(token, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    posthog.capture({
      distinctId,
      event,
      properties: cleanAnalyticsProperties(properties),
    });
  } catch {
    return;
  } finally {
    await posthog.shutdown().catch(() => {});
  }
}
