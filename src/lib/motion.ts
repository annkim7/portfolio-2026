export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN = [0.64, 0, 0.78, 0] as const;
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

export const DURATION = { enter: 1.0, exit: 0.6, text: 0.8, textExit: 0.5 };
export const TRANSITION_LOCK_MS = 1100;
export const REDUCED_DURATION = 0.3;

export const OBJECT_ENTER_DELAY = 0.15;
export const TITLE_DELAY = { index: 0.3, title: 0.35, subtitle: 0.42 };
export const INVERSE_DELAY = 0.45;
export const INVERSE_STAGGER = 0.06;
export const LABEL_DELAY = 0.55;
export const LABEL_STAGGER = 0.05;
export const RUBBER_BAND_PX = 12;

export const SETTLE_SPRING = { type: "spring" as const, stiffness: 120, damping: 18 };
export const DOT_SPRING = { type: "spring" as const, stiffness: 400, damping: 32 };
export const POINTER_SPRING = { stiffness: 60, damping: 20, mass: 0.6 };
export const PARALLAX = {
  object: { x: 18, y: 14, rotate: 4 },
  shadow: { x: -10, y: -6 },
  title: { x: 6, y: 4 },
  label: { x: 6, y: 4 },
  perspective: 1200,
};

export const objectVariants = {
  enter: (direction: number) => ({
    y: `${45 * direction}vh`,
    scale: 0.85,
    rotate: 10 * direction,
    opacity: 0,
    filter: "blur(8px)",
  }),
  center: {
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: DURATION.enter,
      ease: EASE_OUT,
      delay: OBJECT_ENTER_DELAY,
    },
  },
  exit: (direction: number) => ({
    y: `${-35 * direction}vh`,
    scale: 0.9,
    rotate: -8 * direction,
    opacity: 0,
    filter: "blur(6px)",
    transition: { duration: DURATION.exit, ease: EASE_IN },
  }),
};

export const reducedObjectVariants = {
  enter: { opacity: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: REDUCED_DURATION },
  },
  exit: {
    opacity: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: REDUCED_DURATION },
  },
};

export const reducedFadeVariants = {
  enter: { opacity: 0, y: 0, scaleX: 1 },
  center: { opacity: 1, y: 0, scaleX: 1, transition: { duration: REDUCED_DURATION } },
  exit: { opacity: 0, y: 0, scaleX: 1, transition: { duration: REDUCED_DURATION } },
};

export function maskedLineVariants(delay: number) {
  return {
    enter: (direction: number) => ({ y: direction > 0 ? "110%" : "-110%" }),
    center: {
      y: 0,
      transition: { duration: DURATION.text, ease: EASE_OUT, delay },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-110%" : "110%",
      transition: { duration: DURATION.textExit, ease: EASE_IN },
    }),
  };
}
