"use client";

import { MaskedLine } from "@/components/MaskedLine";
import type { Slide } from "@/data/slides";
import type { SlideDirection } from "@/hooks/useSlideNavigation";
import type { PointerParallax } from "@/hooks/usePointerParallax";
import { PARALLAX, TITLE_DELAY } from "@/lib/motion";
import { AnimatePresence, motion, useTransform } from "motion/react";

type SlideTitleProps = {
  slide: Slide;
  index: number;
  direction: SlideDirection;
  pointer: PointerParallax;
};

export function SlideTitle({ slide, index, direction, pointer }: SlideTitleProps) {
  const number = String(index + 1).padStart(2, "0");
  const x = useTransform(pointer.x, (value) => value * PARALLAX.title.x);
  const y = useTransform(pointer.y, (value) => value * PARALLAX.title.y);

  return (
    <>
      <motion.div
        className="absolute bottom-[var(--index-bottom)] left-[var(--pad-x)] h-0"
        style={{ x, y }}
      >
        <AnimatePresence custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            className="absolute bottom-0 left-0 w-max"
            initial="enter"
            animate="center"
            exit="exit"
          >
            <p className="m-0 text-[length:var(--fs-index)] font-semibold whitespace-nowrap">
              <MaskedLine delay={TITLE_DELAY.index}>{number}</MaskedLine>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute bottom-[var(--title-bottom)] left-[var(--pad-x)] h-0"
        style={{ x, y }}
      >
        <AnimatePresence custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            className="absolute bottom-0 left-0 w-max"
            initial="enter"
            animate="center"
            exit="exit"
          >
            <p className="m-0 text-[length:var(--fs-title)] leading-none font-bold whitespace-nowrap">
              <MaskedLine delay={TITLE_DELAY.title}>{slide.title}</MaskedLine>
            </p>
            <p className="m-0 text-[length:var(--fs-sub)] leading-[1.1] font-bold whitespace-nowrap">
              <MaskedLine delay={TITLE_DELAY.subtitle}>{slide.subtitle}</MaskedLine>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
}
