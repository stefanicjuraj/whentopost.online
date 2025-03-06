import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "When to Post",
  description: "Find the best time to post on social media.",
  keywords: [
    "when to post",
    "when to post online",
    "when to post on social media",
    "when to post on linkedin",
    "when to post on reddit",
    "when to post on instagram",
    "when to post on bluesky",
    "when to post on twitter",
    "when to post on facebook",
    "when to post on hacker news",
    "best time to post",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "2e95fd1152c64921a3ae563c960a9803"}'
        />
      </body>
    </html>
  );
}
