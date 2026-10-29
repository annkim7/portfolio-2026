"use client";

import type { Slide } from "@/data/slides";
import type { SlideDirection } from "@/hooks/useSlideNavigation";
import type { PointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  DURATION,
  EASE_OUT,
  objectVariants,
  PARALLAX,
  reducedObjectVariants,
  RUBBER_BAND_DURATION,
  RUBBER_BAND_PX,
  SETTLE_SPRING,
} from "@/lib/motion";
import { AnimatePresence, motion, useAnimate, useTransform } from "motion/react";
import Image from "next/image";
import { AsciiOcean } from "@/components/ascii-ocean/AsciiOcean";
import { useEffect, useMemo, useSyncExternalStore } from "react";

const NARROW_QUERY = "(max-width: 767px)";
const readyQueries = new Set<string>();

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query);
      const notify = () => {
        readyQueries.add(query);
        onStoreChange();
      };
      media.addEventListener("change", notify);
      const frame = window.requestAnimationFrame(notify);
      return () => {
        media.removeEventListener("change", notify);
        window.cancelAnimationFrame(frame);
      };
    },
    () => readyQueries.has(query) && window.matchMedia(query).matches,
    () => false,
  );
}

type SlideObjectProps = {
  slide: Slide;
  direction: SlideDirection;
  pointer: PointerParallax;
  priority?: boolean;
  isAnimating?: boolean;
  nudge?: { dir: SlideDirection; id: number } | null;
};

export function SlideObject({
  slide,
  direction,
  pointer,
  priority = false,
  isAnimating = false,
  nudge,
}: SlideObjectProps) {
  const reduced = useReducedMotion();
  const narrow = useMediaQuery(NARROW_QUERY);
  const variants = useMemo(() => {
    if (reduced) return reducedObjectVariants;
    if (!narrow) return objectVariants;
    return {
      enter: (direction: number) => ({ ...objectVariants.enter(direction), filter: "blur(0px)" }),
      center: { ...objectVariants.center, filter: "blur(0px)" },
      exit: (direction: number) => ({ ...objectVariants.exit(direction), filter: "blur(0px)" }),
    };
  }, [narrow, reduced]);
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
    if (reduced || !nudge || !scope.current) return;
    void animate(
      scope.current,
      { y: [0, -RUBBER_BAND_PX * nudge.dir, 0] },
      { duration: RUBBER_BAND_DURATION, ease: EASE_OUT },
    );
  }, [animate, nudge, reduced, scope]);

  const ocean = slide.object === "ascii-ocean";

  return (
    <div
      className={
        ocean
          ? "absolute inset-0 h-full w-full"
          : "absolute top-[var(--object-cy)] left-1/2 aspect-square w-[var(--object-w)]"
      }
    >
      {ocean ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-[78%] left-1/2 h-[16%] w-[58%] rounded-[50%] bg-black/10 blur-2xl"
          style={{ x: shadowX, y: shadowY }}
        />
      )}
      <motion.div
        className="h-full w-full"
        style={
          ocean
            ? { x: 0, y: 0, rotateX: 0, rotateY: 0 }
            : {
                x,
                y,
                rotateX,
                rotateY,
                transformPerspective: PARALLAX.perspective,
              }
        }
      >
      <div ref={scope} className="relative h-full w-full">
        <AnimatePresence custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
            style={{ willChange: isAnimating ? "transform, opacity, filter" : "auto" }}
          >
            <motion.div
              className="h-full w-full"
              initial={ocean || reduced ? false : { rotate: -1.5 * direction }}
              animate={{ rotate: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { ...SETTLE_SPRING, delay: DURATION.enter * 0.85 }
              }
            >
              {slide.object === "ascii-ocean" ? (
                <AsciiOcean
                  label={slide.image.alt}
                  sharkCount={4}
                  sharkSize={0.78}
                  fishCount={384}
                  background="transparent"
                  showGrid={false}
                  fishColor="#C9A0A6"
                  className="h-full w-full"
                />
              ) : (
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  width={slide.image.width}
                  height={slide.image.height}
                  priority={priority}
                  sizes="(max-width: 767px) 72vw, (max-width: 1023px) 42vw, 31vw"
                  className="h-full w-full object-contain"
                  style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.12))" }}
                />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      </motion.div>
    </div>
  );
}
