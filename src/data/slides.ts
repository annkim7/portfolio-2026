export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: { src: string; alt: string; width: number; height: number };
  labelInverse: string[];
  label: string[];
  href?: string;
};

export const slides: Slide[] = [
  {
    id: "ring",
    title: "SILVER .",
    subtitle: "RING",
    image: {
      src: "/images/slides/main_slider_01.png",
      alt: "Wood grain cross section",
      width: 564,
      height: 752,
    },
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
  {
    id: "diamond",
    title: "DIAMOND .",
    subtitle: "JEWELRY",
    image: {
      src: "/images/slides/main_slider_02.png",
      alt: "Rough stone",
      width: 750,
      height: 1000,
    },
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
  {
    id: "pearl",
    title: "PEARL .",
    subtitle: "EARRING",
    image: {
      src: "/images/slides/main_slider_03.png",
      alt: "Folded white form",
      width: 580,
      height: 870,
    },
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
];
