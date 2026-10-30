import type { Metadata } from "next";
import { Doto, JetBrains_Mono } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const doto = Doto({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-doto",
  display: "swap",
  fallback: ["monospace"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NK Portfolio",
  description: "Fullscreen portfolio",
};

const frameMode = process.env.NEXT_PUBLIC_FRAME_MODE === "true";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={clsx(doto.variable, mono.variable, frameMode && "frame-mode")}>
      <body>{children}</body>
    </html>
  );
}
