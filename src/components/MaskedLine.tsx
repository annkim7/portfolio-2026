"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { maskedLineVariants, reducedFadeVariants } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

type MaskedLineProps = {
  children: ReactNode;
  delay: number;
  className?: string;
};

export function MaskedLine({ children, delay, className }: MaskedLineProps) {
  const reduced = useReducedMotion();

  return (
    <span className="block overflow-hidden whitespace-nowrap">
      <motion.span
        className={`block whitespace-nowrap ${className ?? ""}`}
        variants={reduced ? reducedFadeVariants : maskedLineVariants(delay)}
      >
        {children}
      </motion.span>
    </span>
  );
}
