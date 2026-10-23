"use client";

import { POINTER_SPRING } from "@/lib/motion";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useEffect } from "react";

export type PointerParallax = {
  x: MotionValue<number>;
  y: MotionValue<number>;
};

export function usePointerParallax(enabled = true): PointerParallax {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, POINTER_SPRING);
  const springY = useSpring(y, POINTER_SPRING);

  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
      return;
    }

    const hoverNone = window.matchMedia("(hover: none)");
    const reset = () => {
      x.set(0);
      y.set(0);
    };

    if (hoverNone.matches) {
      reset();
      return;
    }

    const onMove = (event: PointerEvent) => {
      if (hoverNone.matches) return;
      x.set((event.clientX / window.innerWidth) * 2 - 1);
      y.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove);
    hoverNone.addEventListener("change", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      hoverNone.removeEventListener("change", reset);
    };
  }, [enabled, x, y]);

  return { x: springX, y: springY };
}
