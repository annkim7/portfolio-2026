"use client";

import { AsciiOcean } from "@/components/ascii-ocean/AsciiOcean";
import { OCEAN_FADE_MS } from "@/lib/motion";
import { useEffect, useState } from "react";

export function CreatureLayer({ active }: { active: boolean }) {
  const [paused, setPaused] = useState(!active);

  useEffect(() => {
    const timer = window.setTimeout(() => setPaused(!active), active ? 0 : OCEAN_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div
      className={`creature-layer${active ? "" : " is-hidden"}`}
      aria-hidden="true"
    >
      <AsciiOcean
        decorative
        paused={paused}
        sharkCount={4}
        sharkSize={0.78}
        fishCount={384}
        background="transparent"
        showGrid={false}
        fishColor="#C9A0A6"
        interactive={false}
        className="ocean-fill"
      />
    </div>
  );
}
