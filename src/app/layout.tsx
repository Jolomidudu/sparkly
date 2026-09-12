import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lovenorth",
  description: "A beautiful light view of a modern dating app. Swipe, match, connect.",
  openGraph: {
    title: "lovenorth",
    description: "Swipe, match, and chat in lovenorth.",
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
