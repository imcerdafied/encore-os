"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { ensurePostHog } from "@/lib/analytics";

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lastUrl = useRef("");

  useEffect(() => {
    if (!ensurePostHog()) return;

    const currentUrl = window.location.href;
    if (lastUrl.current === currentUrl) return;

    lastUrl.current = currentUrl;
    posthog.capture("$pageview", {
      $current_url: currentUrl,
    });
  }, [pathname]);

  return <>{children}</>;
}
