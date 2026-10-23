export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: { src: string; alt: string; width: number; height: number };
  labelInverse: string[];
  label: string[];
  href?: string;
};

// TODO: Replace placeholder SVGs in public/images/slides with transparent
// product photos (WebP, long edge 1200–1600px, under 300KB).
export const slides: Slide[] = [
  {
    id: "ring",
    title: "SILVER .",
    subtitle: "RING",
    image: {
      src: "/images/slides/placeholder-01.svg",
      alt: "Silver ring",
      width: 1200,
      height: 1200,
    },
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
  {
    id: "diamond",
    title: "DIAMOND .",
    subtitle: "JEWELRY",
    image: {
      src: "/images/slides/placeholder-02.svg",
      alt: "Diamond jewelry",
      width: 1200,
      height: 1200,
    },
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
  {
    id: "pearl",
    title: "PEARL .",
    subtitle: "EARRING",
    image: {
      src: "/images/slides/placeholder-03.svg",
      alt: "Pearl earring",
      width: 1200,
      height: 1200,
    },
    labelInverse: ["LUSON", "ONE DAY WORKS"],
    label: ["UI", "PROJECT", "WORKS"],
  },
];
