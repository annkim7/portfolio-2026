"use client";

import { OCEAN_FADE_MS } from "@/lib/motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AsciiOcean = dynamic(
  () => import("@/components/ascii-ocean/AsciiOcean").then((mod) => mod.AsciiOcean),
  { ssr: false },
);

export function CreatureLayer({ active, preload = false }: { active: boolean; preload?: boolean }) {
  const [mounted, setMounted] = useState(active);

  useEffect(() => {
    if (!preload) return;
    void import("@/components/ascii-ocean/AsciiOcean");
  }, [preload]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(active), active ? 0 : OCEAN_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div className={`creature-layer${active ? "" : " is-hidden"}`} aria-hidden="true">
      {mounted ? (
        <AsciiOcean
          decorative
          sharkCount={4}
          sharkSize={0.78}
          background="transparent"
          showGrid={false}
          fishColor="#C9A0A6"
          interactive={false}
          className="ocean-fill"
        />
      ) : null}
    </div>
  );
}
