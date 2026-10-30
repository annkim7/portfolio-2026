"use client";

import type { Slide } from "@/data/slides";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type SlideObjectProps = {
  slide: Slide;
  reduced: boolean;
  priority?: boolean;
};

export function SlideObject({ slide, reduced, priority = false }: SlideObjectProps) {
  return (
    <div className="visual-slot">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="visual-pane"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
        >
          {slide.visual === "ocean" || !slide.image ? null : (
            <div className={slide.visual === "rings" ? "still rings" : "still rock"}>
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                priority={priority}
                sizes="100vw"
                className="still-img"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
