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
    title: "REACT .",
    subtitle: "REACT NATIVE",
    image: {
      src: "/images/slides/main_slider_01.png",
      alt: "Wood grain cross section",
      width: 564,
      height: 752,
    },
    labelInverse: ["ANN", "DEVELOPMENT", "STACK"],
    label: ["2026", "PROJECT", "HISTORY"],
  },
  {
    id: "diamond",
    title: "JAVA .",
    subtitle: "JAVA SPRING",
    image: {
      src: "/images/slides/main_slider_02.png",
      alt: "Rough stone",
      width: 750,
      height: 1000,
    },
    labelInverse: ["ANN", "DEVELOPMENT", "STACK"],
    label: ["2026", "PROJECT", "HISTORY"],
  },
  {
    id: "pearl",
    title: "SQL .",
    subtitle: "POSTGRESQL",
    image: {
      src: "/images/slides/main_slider_03.png",
      alt: "Folded white form",
      width: 580,
      height: 870,
    },
    labelInverse: ["ANN", "DEVELOPMENT", "STACK"],
    label: ["2026", "PROJECT", "HISTORY"],
  },
];
