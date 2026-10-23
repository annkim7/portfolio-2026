"use client";

import { maskedLineVariants } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

type MaskedLineProps = {
  children: ReactNode;
  delay: number;
  className?: string;
};

export function MaskedLine({ children, delay, className }: MaskedLineProps) {
  return (
    <span className="block overflow-hidden whitespace-nowrap">
      <motion.span
        className={`block whitespace-nowrap ${className ?? ""}`}
        variants={maskedLineVariants(delay)}
      >
        {children}
      </motion.span>
    </span>
  );
}
