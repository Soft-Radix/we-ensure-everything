import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeInsureEverything.com | Find Your Local Insurance Specialist",
  description:
    "Find a licensed, exclusive insurance agent in your county for commercial, health, personal, medicare, financial, and group insurance. AgentPro! powered by WeInsureEverything.",
  keywords:
    "insurance agent, local insurance, county insurance specialist, commercial insurance, health insurance, medicare, personal insurance",
  openGraph: {
    title: "WeInsureEverything.com | Find Your Local Insurance Specialist",
    description:
      "Connect with your exclusive local insurance agent. One agent. Your county. Every coverage.",
    url: "https://weinsureeverything.com",
    siteName: "WeInsureEverything.com",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
