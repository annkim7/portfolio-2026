"use client";

import { useReducedMotion as useMotionPreference } from "motion/react";
import { useEffect, useState } from "react";

export function useReducedMotion() {
  const prefersReduced = useMotionPreference();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(Boolean(prefersReduced));
  }, [prefersReduced]);

  return reduced;
}
