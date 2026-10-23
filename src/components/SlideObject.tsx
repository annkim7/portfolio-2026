import Image from "next/image";
import type { Slide } from "@/data/slides";

type SlideObjectProps = {
  slide: Slide;
  priority?: boolean;
};

export function SlideObject({ slide, priority = false }: SlideObjectProps) {
  return (
    <div className="absolute top-[var(--object-cy)] left-1/2 w-[var(--object-w)] -translate-x-1/2 -translate-y-1/2">
      <Image
        src={slide.image.src}
        alt={slide.image.alt}
        width={slide.image.width}
        height={slide.image.height}
        priority={priority}
        sizes="31vw"
        className="h-auto w-full"
        style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.12))" }}
      />
    </div>
  );
}
