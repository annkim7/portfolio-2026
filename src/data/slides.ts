export type SlideVisual = "rings" | "rock" | "ocean";

export type Slide = {
  id: string;
  stack: string;
  category: string;
  title: string;
  subtitle: string;
  meta: string;
  tab: string;
  visual: SlideVisual;
  image?: { src: string; alt: string; width: number; height: number };
};

export const sideCopy = {
  left: "ANN DEVELOPMENT STACK",
  right: "NK PORTFOLIO — 2026",
};

export const slides: Slide[] = [
  {
    id: "ring",
    stack: "STACK 01",
    category: "FRONTEND",
    title: "REACT.",
    subtitle: "REACT NATIVE",
    meta: "(ST-01)",
    tab: "01 REACT NATIVE",
    visual: "rings",
    image: {
      src: "/images/slides/main_slider_01.png",
      alt: "나이테 단면",
      width: 564,
      height: 752,
    },
  },
  {
    id: "diamond",
    stack: "STACK 02",
    category: "BACKEND",
    title: "JAVA.",
    subtitle: "JAVA SPRING",
    meta: "(ST-02)",
    tab: "02 JAVA SPRING",
    visual: "rock",
    image: {
      src: "/images/slides/main_slider_02.png",
      alt: "돌 조각",
      width: 750,
      height: 1000,
    },
  },
  {
    id: "pearl",
    stack: "STACK 03",
    category: "DATABASE",
    title: "SQL.",
    subtitle: "POSTGRESQL",
    meta: "(ST-03)",
    tab: "03 POSTGRESQL",
    visual: "ocean",
  },
];
