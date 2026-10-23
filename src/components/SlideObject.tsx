"use client";

import type { Slide } from "@/data/slides";
import type { SlideDirection } from "@/hooks/useSlideNavigation";
import type { PointerParallax } from "@/hooks/usePointerParallax";
import {
  DURATION,
  EASE_OUT,
  objectVariants,
  PARALLAX,
  RUBBER_BAND_PX,
  SETTLE_SPRING,
} from "@/lib/motion";
import { AnimatePresence, motion, useAnimate, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";

type SlideObjectProps = {
  slide: Slide;
  direction: SlideDirection;
  pointer: PointerParallax;
  priority?: boolean;
  nudge?: { dir: SlideDirection; id: number } | null;
};

export function SlideObject({
  slide,
  direction,
  pointer,
  priority = false,
  nudge,
}: SlideObjectProps) {
  const [scope, animate] = useAnimate();
  const x = useTransform(pointer.x, (value) => `calc(-50% + ${value * PARALLAX.object.x}px)`);
  const y = useTransform(pointer.y, (value) => `calc(-50% + ${value * PARALLAX.object.y}px)`);
  const shadowX = useTransform(
    pointer.x,
    (value) => `calc(-50% + ${value * PARALLAX.shadow.x}px)`,
  );
  const shadowY = useTransform(
    pointer.y,
    (value) => `calc(-50% + ${value * PARALLAX.shadow.y}px)`,
  );
  const rotateY = useTransform(pointer.x, (value) => value * PARALLAX.object.rotate);
  const rotateX = useTransform(pointer.y, (value) => value * -PARALLAX.object.rotate);

  useEffect(() => {
    if (!nudge || !scope.current) return;
    void animate(
      scope.current,
      { y: [0, -RUBBER_BAND_PX * nudge.dir, 0] },
      { duration: 0.5, ease: EASE_OUT },
    );
  }, [animate, nudge, scope]);

  return (
    <div className="absolute top-[var(--object-cy)] left-1/2 aspect-square w-[var(--object-w)]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[78%] left-1/2 h-[16%] w-[58%] rounded-[50%] bg-black/10 blur-2xl"
        style={{ x: shadowX, y: shadowY }}
      />
      <motion.div
        className="h-full w-full"
        style={{
          x,
          y,
          rotateX,
          rotateY,
          transformPerspective: PARALLAX.perspective,
        }}
      >
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
      </motion.div>
    </div>
  );
}
