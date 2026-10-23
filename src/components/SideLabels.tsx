"use client";

import { MaskedLine } from "@/components/MaskedLine";
import type { Slide } from "@/data/slides";
import type { SlideDirection } from "@/hooks/useSlideNavigation";
import {
  EASE_IN,
  EASE_OUT,
  INVERSE_DELAY,
  INVERSE_STAGGER,
  LABEL_DELAY,
  LABEL_STAGGER,
} from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";

type SideLabelsProps = {
  slide: Slide;
  direction: SlideDirection;
};

function InverseLine({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.span
      className="inline-block overflow-hidden bg-[var(--fg)] px-[3px]"
      variants={{
        enter: (direction: number) => ({ scaleX: 0, originX: direction > 0 ? 0 : 1 }),
        center: (direction: number) => ({
          scaleX: 1,
          originX: direction > 0 ? 0 : 1,
          transition: { duration: 0.45, ease: EASE_OUT, delay },
        }),
        exit: (direction: number) => ({
          scaleX: 0,
          originX: direction > 0 ? 1 : 0,
          transition: { duration: 0.45, ease: EASE_IN },
        }),
      }}
    >
      <motion.span
        className="block text-[length:var(--fs-label)] leading-[1.15] font-bold whitespace-nowrap text-[var(--fg-inverse)]"
        variants={{
          enter: { y: "100%" },
          center: {
            y: "0%",
            transition: { duration: 0.4, ease: EASE_OUT, delay: delay + 0.18 },
          },
          exit: {
            y: "-110%",
            transition: { duration: 0.3, ease: EASE_IN },
          },
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

export function SideLabels({ slide, direction }: SideLabelsProps) {
  return (
    <>
      <div className="absolute right-[var(--pad-x-right)] bottom-[var(--label-top-bottom)] h-0">
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
      </div>
      <div className="label-plain absolute right-[var(--pad-x-right)] bottom-[var(--label-bottom)] h-0">
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
      </div>
    </>
  );
}
