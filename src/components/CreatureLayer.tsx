"use client";

import { AsciiOcean } from "@/components/ascii-ocean/AsciiOcean";
import { useEffect, useState } from "react";

export function CreatureLayer({ active }: { active: boolean }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setPaused(!active), active ? 0 : 300);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div
      className={`creature-layer${active ? "" : " is-hidden"}${paused ? " is-paused" : ""}`}
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
