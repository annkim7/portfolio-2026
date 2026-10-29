"use client";

import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { SideLabels } from "@/components/SideLabels";
import { SlideObject } from "@/components/SlideObject";
import { SlideTitle } from "@/components/SlideTitle";
import { slides } from "@/data/slides";
import type { SiteLinks } from "@/lib/links";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  useSlideNavigation,
  type SlideDirection,
} from "@/hooks/useSlideNavigation";
import { BACKGROUND_SHIFT_TIMES, DURATION, EASE_OUT, TRANSITION_LOCK_MS } from "@/lib/motion";
import { motion, useAnimation } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Nudge = { dir: SlideDirection; id: number };

function BackgroundShift({
  index,
  direction,
}: {
  index: number;
  direction: SlideDirection;
}) {
  const controls = useAnimation();
  const first = useRef(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    if (reduced) return;

    void controls.start({
      backgroundPosition: ["50% 100%", `${50 + direction * 3}% 100%`, "50% 100%"],
      transition: { duration: DURATION.enter, ease: EASE_OUT, times: [...BACKGROUND_SHIFT_TIMES] },
    });
  }, [controls, direction, index, reduced]);

  return (
    <motion.div
      aria-hidden
      className="stage-bg pointer-events-none absolute inset-0"
      initial={{ backgroundPosition: "50% 100%" }}
      animate={controls}
    />
  );
}

const imageSizes = "(max-width: 767px) 72vw, (max-width: 1023px) 42vw, 31vw";

function AdjacentSlides({ index }: { index: number }) {
  const neighbors = [index - 1, index + 1].filter(
    (item) => item >= 0 && item < slides.length,
  );

  return (
    <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
      {neighbors.map((item) => {
        const neighbor = slides[item];
        if (neighbor.object === "ascii-ocean") return null;
        return (
          <Image
            key={neighbor.id}
            src={neighbor.image.src}
            alt=""
            width={neighbor.image.width}
            height={neighbor.image.height}
            sizes={imageSizes}
          />
        );
      })}
    </div>
  );
}

export function Stage({ links }: { links: SiteLinks }) {
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const nudgeId = useRef(0);
  const onEdge = useCallback((direction: SlideDirection) => {
    nudgeId.current += 1;
    setNudge({ dir: direction, id: nudgeId.current });
  }, []);

  const { index, direction, goTo, isAnimating } = useSlideNavigation({
    count: slides.length,
    duration: TRANSITION_LOCK_MS,
    ids: slides.map((slide) => slide.id),
    onEdge,
  });
  const slide = slides[index];
  const reduced = useReducedMotion();
  const pointer = usePointerParallax(!reduced);
  const announcement = `${index + 1} / ${slides.length}: ${slide.title.replace(/\s+\.\s*$/, "")} ${slide.subtitle}`;

  return (
    <div
      className="stage fixed inset-0"
      role="region"
      aria-roledescription="carousel"
      aria-label={announcement}
    >
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <BackgroundShift index={index} direction={direction} />
      <Header links={links} />
      <AdjacentSlides index={index} />
      <SlideObject
        slide={slide}
        direction={direction}
        pointer={pointer}
        priority={index === 0}
        isAnimating={isAnimating}
        nudge={nudge}
      />
      <SlideTitle slide={slide} index={index} direction={direction} pointer={pointer} />
      <SideLabels slide={slide} direction={direction} pointer={pointer} />
      <Pagination count={slides.length} active={index} onSelect={goTo} />
    </div>
  );
}
