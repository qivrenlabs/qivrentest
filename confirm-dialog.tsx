import type { Metadata, Viewport } from "next";
import "highlight.js/styles/github-dark-dimmed.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "QIVREN — Intelligent AI Assistant",
    template: "%s | QIVREN"
  },
  description: "QIVREN is an intelligent AI assistant powered by Vireqon Intelligence.",
  applicationName: "QIVREN",
  icons: {
    icon: "/qivren-mark.svg",
    shortcut: "/qivren-mark.svg",
    apple: "/qivren-mark.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#080a12" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
