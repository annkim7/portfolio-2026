"use client";

import type { Slide } from "@/data/slides";
import { AnimatePresence, motion } from "motion/react";

export function SlideTitle({ slide, reduced }: { slide: Slide; reduced: boolean }) {
  return (
    <div className="title-slot">
      <AnimatePresence initial={false}>
        <motion.h1
          key={slide.id}
          className="hero-title"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="l1">{slide.title}</span>
          <span className="l2">{slide.subtitle}</span>
          <span className="l3">
            {slide.meta}{" "}
            <span
              className="copy-mark"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, sans-serif', fontWeight: 500 }}
            >
              ©
            </span>{" "}
            2026
          </span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
