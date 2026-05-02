"use client";

import Link, { LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { AnalyticsProperties } from "@/lib/analytics-events";

type AnalyticsLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    eventName: string;
    eventProperties?: AnalyticsProperties;
  };

export default function AnalyticsLink({
  children,
  eventName,
  eventProperties,
  href,
  onClick,
  ...props
}: AnalyticsLinkProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        track(eventName, {
          href: typeof href === "string" ? href : String(href),
          ...eventProperties,
        });
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
