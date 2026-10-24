export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: { src: string; alt: string; width: number; height: number };
  labelInverse: string[];
  label: string[];
  href?: string;
};

const slideImage = {
  src: "/images/slides/main_slider_01.png",
  alt: "Wood grain cross section",
  width: 433,
  height: 577,
};

export const slides: Slide[] = [
  {
    id: "ring",
    title: "SILVER .",
    subtitle: "RING",
    image: slideImage,
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
  {
    id: "diamond",
    title: "DIAMOND .",
    subtitle: "JEWELRY",
    image: slideImage,
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
  {
    id: "pearl",
    title: "PEARL .",
    subtitle: "EARRING",
    image: slideImage,
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
];
