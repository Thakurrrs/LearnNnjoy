import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnNnjoy | Maths worth exploring",
  description: "A gentle, visual Maths adventure for curious learners.",
  applicationName: "LearnNnjoy",
  appleWebApp: { capable: true, title: "LearnNnjoy", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#6847e8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
