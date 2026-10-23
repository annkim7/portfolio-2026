import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Fullscreen parallax portfolio",
};

const frameMode = process.env.NEXT_PUBLIC_FRAME_MODE === "true";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={clsx(oswald.variable, frameMode && "frame-mode")}>
      <body>{children}</body>
    </html>
  );
}
