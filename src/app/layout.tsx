import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "encore-os — Where Should You Go Next?",
  description:
    "AI-powered relocation advisor. Tell us about your life and we'll find your next chapter in a world reshaped by AI and economic change.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    other: [{ rel: "icon", url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#10141F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
