import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streak Tracker - Build Better Habits",
  description: "Track your daily habits with beautiful 3D animations and gamification",
  keywords: ["habits", "streak", "tracker", "gamification", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
