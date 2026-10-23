"use client";

import { MaskedLine } from "@/components/MaskedLine";
import type { Slide } from "@/data/slides";
import type { SlideDirection } from "@/hooks/useSlideNavigation";
import type { PointerParallax } from "@/hooks/usePointerParallax";
import {
  EASE_IN,
  EASE_OUT,
  INVERSE_DELAY,
  INVERSE_SCALE_DURATION,
  INVERSE_TEXT_DELAY,
  INVERSE_TEXT_DURATION,
  INVERSE_TEXT_EXIT,
  INVERSE_STAGGER,
  LABEL_DELAY,
  LABEL_STAGGER,
  PARALLAX,
  reducedFadeVariants,
} from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion, useTransform } from "motion/react";

type SideLabelsProps = {
  slide: Slide;
  direction: SlideDirection;
  pointer: PointerParallax;
};

function InverseLine({ text, delay }: { text: string; delay: number }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.span
        className="inline-block bg-[var(--fg)] px-[3px] text-[length:var(--fs-label)] leading-[1.15] font-bold whitespace-nowrap text-[var(--fg-inverse)]"
        variants={reducedFadeVariants}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <motion.span
      className="inline-block overflow-hidden bg-[var(--fg)] px-[3px]"
      variants={{
        enter: (direction: number) => ({ scaleX: 0, originX: direction > 0 ? 0 : 1 }),
        center: (direction: number) => ({
          scaleX: 1,
          originX: direction > 0 ? 0 : 1,
          transition: { duration: INVERSE_SCALE_DURATION, ease: EASE_OUT, delay },
        }),
        exit: (direction: number) => ({
          scaleX: 0,
          originX: direction > 0 ? 1 : 0,
          transition: { duration: INVERSE_SCALE_DURATION, ease: EASE_IN },
        }),
      }}
    >
      <motion.span
        className="block text-[length:var(--fs-label)] leading-[1.15] font-bold whitespace-nowrap text-[var(--fg-inverse)]"
        variants={{
          enter: { y: "100%" },
          center: {
            y: "0%",
            transition: {
              duration: INVERSE_TEXT_DURATION,
              ease: EASE_OUT,
              delay: delay + INVERSE_TEXT_DELAY,
            },
          },
          exit: {
            y: "-110%",
            transition: { duration: INVERSE_TEXT_EXIT, ease: EASE_IN },
          },
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

export function SideLabels({ slide, direction, pointer }: SideLabelsProps) {
  const x = useTransform(pointer.x, (value) => value * PARALLAX.label.x);
  const y = useTransform(pointer.y, (value) => value * PARALLAX.label.y);

  return (
    <>
      <motion.div
        className="absolute right-[var(--pad-x-right)] bottom-[var(--label-top-bottom)] h-0"
        style={{ x, y }}
      >
        <AnimatePresence custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            className="absolute right-0 bottom-0 flex w-max flex-col items-end gap-px"
            initial="enter"
            animate="center"
            exit="exit"
          >
            {slide.labelInverse.map((line, index) => (
              <InverseLine
                key={`${slide.id}-inverse-${index}`}
                text={line}
                delay={INVERSE_DELAY + index * INVERSE_STAGGER}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="label-plain absolute right-[var(--pad-x-right)] bottom-[var(--label-bottom)] h-0"
        style={{ x, y }}
      >
        <AnimatePresence custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            className="absolute right-0 bottom-0 flex w-max flex-col items-end text-right"
            initial="enter"
            animate="center"
            exit="exit"
          >
            {slide.label.map((line, index) => (
              <p
                key={`${slide.id}-label-${index}`}
                className="m-0 text-[length:var(--fs-label)] leading-[1.15] font-bold whitespace-nowrap"
              >
                <MaskedLine delay={LABEL_DELAY + index * LABEL_STAGGER}>{line}</MaskedLine>
              </p>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
}
