"use client";

import type { Slide } from "@/data/slides";
import type { SlideDirection } from "@/hooks/useSlideNavigation";
import {
  DURATION,
  EASE_OUT,
  objectVariants,
  RUBBER_BAND_PX,
  SETTLE_SPRING,
} from "@/lib/motion";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";

type SlideObjectProps = {
  slide: Slide;
  direction: SlideDirection;
  priority?: boolean;
  nudge?: { dir: SlideDirection; id: number } | null;
};

export function SlideObject({ slide, direction, priority = false, nudge }: SlideObjectProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!nudge || !scope.current) return;
    void animate(
      scope.current,
      { y: [0, -RUBBER_BAND_PX * nudge.dir, 0] },
      { duration: 0.5, ease: EASE_OUT },
    );
  }, [animate, nudge, scope]);

  return (
    <div className="absolute top-[var(--object-cy)] left-1/2 aspect-square w-[var(--object-w)] -translate-x-1/2 -translate-y-1/2">
      <div ref={scope} className="relative h-full w-full">
        <AnimatePresence custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={objectVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <motion.div
              className="h-full w-full"
              initial={{ rotate: -1.5 * direction }}
              animate={{ rotate: 0 }}
              transition={{ ...SETTLE_SPRING, delay: DURATION.enter * 0.85 }}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                width={slide.image.width}
                height={slide.image.height}
                priority={priority}
                sizes="31vw"
                className="h-full w-full object-contain"
                style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.12))" }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
