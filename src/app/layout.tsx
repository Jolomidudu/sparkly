import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sparkly — Dating Demo",
  description: "A beautiful light demo of a modern dating app. Swipe, match, connect.",
  openGraph: {
    title: "Sparkly — Dating Demo",
    description: "Swipe, match, and chat in this polished dating app demo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0f0f12] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
