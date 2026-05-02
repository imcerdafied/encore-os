import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "encore-os — Where Should You Go Next?",
  description:
    "A thoughtful relocation guide for people choosing a next chapter with more room, warmth, and practical confidence.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    other: [{ rel: "icon", url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF7EF",
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
